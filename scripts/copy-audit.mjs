// Copy audit: the mechanical half of CONTEXT.md sections 3, 6 and 7, run over
// what a visitor (or a crawler, or a screen reader) actually gets.
//
//   npm run copy-audit                  every page in dist/ (run npm run build first)
//   npm run copy-audit -- --url https://<preview>.pages.dev/
//
// Each page is rendered in Chrome with every <details> opened, and the audit
// reads its visible text plus the copy a visitor meets without seeing it: the
// title, meta and share tags, JSON-LD, alt text and aria-labels.
//
// FAIL lines break a written rule and exit 1. REVIEW lines are heuristics or
// words that are fine in the right place (a struck-through non-feature names a
// "never" claim on purpose); a person reads each one. The judgment half of the
// audit (claims against the list, voice, X-not-Y contrasts, three-item lists)
// is in .claude/skills/copy-audit/SKILL.md.
import { readdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { serveDist } from './lib/serve-dist.mjs';

const args = process.argv.slice(2);
const urlArg = args.includes('--url') ? args[args.indexOf('--url') + 1] : null;
const chromePath =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Hard rules: a hit is a defect.
const FAIL = [
  ['em dash', /—/g],
  ['dash used as a pause (en dash between spaces)', / – /g],
  ['straight double quote (curly quotes everywhere)', /"/g],
  ['straight apostrophe (curly ’ everywhere)', /(?<=\p{L})'(?=\p{L})|(?<=\s)'(?=\p{L})/gu],
  ['naming law: URUNI', /\bURUNI\b/g],
  ['naming law: lowercase uruni in text', /(?<![./@-])\buruni\b(?![./-])/g],
  ['naming law: mixed case', /\bUruN\w*/g],
  ['naming law: inflected name', /\bUruni-?(nya|mu|ku|lah|kah|pun)\b|\b\w+-Uruni\b/g],
  ['address: Anda (kamu only)', /\bAnda\b/g],
  ['exclamation mark', /!/g],
  ['slop: Tak hanya ... tetapi juga', /\b(tak|tidak) hanya\b.{0,80}\btetapi juga\b/gi],
  ['slop: superlative solution', /\bsolusi (terbaik|terlengkap|nomor satu)\b/gi],
  ['slop: Yuk opener', /\bYuk\b/g],
  ['slop: Mudah, cepat, dan aman', /\bmudah, cepat,? dan aman\b/gi],
  ['slop: urgency', /\b(Buruan|Terbatas)\b/g],
  ['slop: English calque', /\b(level up|game changer)\b/gi],
  ['version number or stage badge', /\bv\d+\.\d+|\b(alpha|beta)\b/gi],
  [
    'loanword: use the Indonesian word',
    /\b(open source|download|backup|self-?host(ed|ing)?|log masuk|peladen|uji coba)\b/gi,
  ],
  ['loanword: link (tautan)', /\blink\b/gi],
  ['loanword: app (aplikasi)', /\bapp\b/gi],
  ['claims: Uruni checks the money itself', /\bUruni (me)?(meriksa|ngecek|nghitung|hitung|cek)\b/g],
];

// Heuristics and words that are allowed in context.
const REVIEW = [
  ['"Dengan Uruni, kamu bisa" frame', /\bDengan Uruni\b/g],
  ['login as a verb? (masuk; login only as a noun)', /\b(untuk|harus|bisa|perlu) login\b/gi],
  [
    'never-claim word: right only when the page says it is not offered',
    /\b(pengingat|QRIS|sinkron(isasi)? bank|jurnal akuntansi|offline|tanpa internet|multi[- ]?mata uang|versi (yang )?tinggal pakai|app store|play store)\b/gi,
    // A struck-through non-feature (FokusUruni) says so in its hidden prefix.
    /Tidak termasuk:\s*[^\n]*$/,
  ],
  [
    'list of 3+ without a comma before dan (EYD V)',
    // Short items only, closed by punctuation: "a, b dan c." Longer clauses
    // joined by dan are usually not a list.
    /\b[\p{L}-]+, [\p{L}-]+(?: [\p{L}-]+)? dan [\p{L}-]+(?: [\p{L}-]+)?(?=[.,;:)])/gu,
  ],
  [
    'number and unit that may break apart',
    /\b\d[\d.,]* (tahun|bulan|hari|jam|menit|juta|ribu|orang)\b/g,
  ],
  [
    '"tidak X, tetapi Y" contrast (few, never in two headings)',
    /\b(bukan|tidak)\b[^.]{1,60}, (tetapi|melainkan)\b/gi,
  ],
];

const context = (text, index, length) =>
  text
    .slice(Math.max(0, index - 40), index + length + 40)
    .replace(/\s+/g, ' ')
    .trim();

function audit(page, chunks) {
  const out = { fail: [], review: [] };
  for (const [where, text] of chunks) {
    for (const [kind, rules] of [
      ['fail', FAIL],
      ['review', REVIEW],
    ]) {
      for (const [rule, re, skipWhenBefore] of rules) {
        for (const m of text.matchAll(re)) {
          if (skipWhenBefore?.test(text.slice(Math.max(0, m.index - 40), m.index))) continue;
          out[kind].push(`${page} [${where}] ${rule}: “…${context(text, m.index, m[0].length)}…”`);
        }
      }
    }
  }
  return out;
}

// Phrases of four words or more that the page says three times or more
// (CONTEXT.md: don't repeat in prose what a chip or list already says).
function repeats(page, text) {
  const words = text.toLowerCase().match(/[\p{L}\d]+/gu) ?? [];
  const counts = new Map();
  for (let i = 0; i + 4 <= words.length; i++) {
    const gram = words.slice(i, i + 4).join(' ');
    counts.set(gram, (counts.get(gram) ?? 0) + 1);
  }
  return [...counts]
    .filter(([, n]) => n >= 3)
    .map(([gram, n]) => `${page} [text] phrase said ${n} times: “${gram}”`);
}

async function readPage(browser, url) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(url, { waitUntil: 'networkidle0' });
  const data = await page.evaluate(() => {
    document.querySelectorAll('details').forEach((d) => (d.open = true));
    const attr = (sel, name) =>
      [...document.querySelectorAll(sel)].map((el) => el.getAttribute(name)).filter(Boolean);
    const jsonStrings = [];
    const walk = (v) =>
      typeof v === 'string'
        ? /^https?:/.test(v) || jsonStrings.push(v)
        : v && typeof v === 'object' && Object.values(v).forEach(walk);
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
      walk(JSON.parse(s.textContent));
    }
    return {
      text: document.body.innerText,
      title: document.title,
      meta: attr(
        'meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]',
        'content',
      ).filter((c) => !/^(https?:|\d+$|summary)/.test(c) && !/^[a-z_]+$/i.test(c)),
      alt: attr('img[alt]', 'alt'),
      aria: [
        ...attr('[aria-label]', 'aria-label'),
        ...attr('[title]', 'title'),
        ...[...document.querySelectorAll('svg title')].map((t) => t.textContent),
      ],
      jsonLd: jsonStrings,
    };
  });
  await page.close();
  return data;
}

const pages = urlArg
  ? [['/', urlArg]]
  : readdirSync('dist')
      .filter((f) => f.endsWith('.html'))
      .map((f) => [f === 'index.html' ? '/' : `/${f}`, null]);

const served = urlArg ? null : await serveDist('copy-audit');
const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });
const fail = [];
const review = [];
try {
  for (const [path, url] of pages) {
    const d = await readPage(browser, url ?? new URL(path, served.base).href);
    const name = path === '/' ? 'index' : path.slice(1);
    const r = audit(name, [
      ['text', d.text],
      ['title', d.title],
      ['meta', d.meta.join('\n')],
      ['alt', d.alt.join('\n')],
      ['aria/title', d.aria.join('\n')],
      ['json-ld', d.jsonLd.join('\n')],
    ]);
    fail.push(...r.fail);
    review.push(...r.review, ...repeats(name, d.text));
  }
} finally {
  await browser.close();
  served?.close();
}

for (const line of fail) console.log(`FAIL   ${line}`);
for (const line of review) console.log(`REVIEW ${line}`);
console.log(
  `\ncopy-audit: ${pages.length} page(s), ${fail.length} fail, ${review.length} to review`,
);
process.exit(fail.length ? 1 : 0);
