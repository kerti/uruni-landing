// Visual check across the responsive matrix (landing guidelines section 9).
//
//   npm run visual                         serves dist/ itself (run npm run build first)
//   npm run visual -- --url http://...     check a running server or a preview URL
//   npm run visual -- --only 390x844,1440x900 --path /some-page/
//
// For each viewport: a full-page screenshot in .visual/, and a report of
// horizontal overflow (and the elements causing it), one-word last lines in
// headings and short texts, words glued to a link or span, and [data-reveal]
// content left hidden after a full scroll. Exits 1 if anything is reported.
//
// Uses the Chrome already installed (puppeteer-core downloads nothing); set
// CHROME_PATH if it isn't in the usual place.
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import puppeteer from 'puppeteer-core';

const MATRIX = [
  [1440, 900],
  [1280, 800],
  [800, 1280],
  [844, 390],
  [390, 844],
  [360, 780],
  [320, 640],
];

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const chromePath =
  process.env.CHROME_PATH ??
  [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => existsSync(p));
if (!chromePath) {
  console.error('visual-check: no Chrome found; set CHROME_PATH');
  process.exit(2);
}

const only = opt('only')
  ?.split(',')
  .map((s) => s.split('x').map(Number));
const viewports = only ?? MATRIX;
const path = opt('path') ?? '/';
const outDir = opt('out') ?? '.visual';
mkdirSync(outDir, { recursive: true });

// Serve dist/ with a tiny static server. `astro preview` won't do: run
// non-interactively it detaches into a background daemon that outlives this
// script, and a second one on another port refuses to start.
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
let server;
let base = opt('url');
if (!base) {
  if (!existsSync('dist/index.html')) {
    console.error('visual-check: no dist/; run npm run build first');
    process.exit(2);
  }
  server = createServer((req, res) => {
    let file = join('dist', normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)));
    if (!file.startsWith('dist')) file = 'dist/404.html';
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
}

// Runs in the page: everything measured at the current viewport.
function measure() {
  const vw = document.documentElement.clientWidth;
  const overflow = document.documentElement.scrollWidth - vw;

  const wide = [];
  if (overflow > 0) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > vw + 1) {
        const name =
          el.tagName.toLowerCase() + (el.className ? `.${String(el.className).split(' ')[0]}` : '');
        wide.push(`${name} right=${Math.round(r.right)}`);
      }
    }
  }

  // One-word last lines: the words of each block, grouped by line top.
  const lone = [];
  const blocks = document.querySelectorAll(
    'h1, h2, h3, p, li, figcaption, summary, dt, dd, .btn, [data-check-wrap]',
  );
  for (const el of blocks) {
    if (el.closest('[aria-hidden="true"]') || !el.offsetParent) continue;
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      for (const m of n.data.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(n, m.index);
        range.setEnd(n, m.index + m[0].length);
        const rects = range.getClientRects();
        if (rects.length) words.push({ word: m[0], top: Math.round(rects[rects.length - 1].top) });
      }
    }
    if (words.length < 3) continue;
    const lastTop = words[words.length - 1].top;
    const onLast = words.filter((w) => Math.abs(w.top - lastTop) < 4);
    const lines = new Set(words.map((w) => w.top)).size;
    if (lines > 1 && onLast.length === 1) {
      lone.push(`${el.tagName.toLowerCase()}: “…${onLast[0].word}”`);
    }
  }

  // Words glued to an inline element: a formatter that wraps a line just
  // before <a> or <span lang> leaves no space in the built HTML.
  const glued = [];
  for (const el of document.querySelectorAll('body a, body span, body s, body b, body small')) {
    if (el.closest('[aria-hidden="true"]')) continue;
    const text = el.textContent;
    const prev = el.previousSibling;
    const next = el.nextSibling;
    if (prev?.nodeType === 3 && /[\p{L}.,;:]$/u.test(prev.data) && /^\p{L}/u.test(text)) {
      glued.push(`“…${prev.data.slice(-12)}${text.slice(0, 12)}…”`);
    }
    if (next?.nodeType === 3 && /[\p{L}.]$/u.test(text) && /^[\p{L}(]/u.test(next.data)) {
      glued.push(`“…${text.slice(-12)}${next.data.slice(0, 12)}…”`);
    }
  }

  const hidden = [...document.querySelectorAll('[data-reveal]')]
    .filter((el) => !el.classList.contains('in-view'))
    .map((el) => el.id || el.tagName.toLowerCase());

  return { overflow, wide: wide.slice(0, 5), lone, glued, hidden };
}

const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });
let problems = 0;
try {
  const page = await browser.newPage();
  for (const [width, height] of viewports) {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(new URL(path, base).href, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    // Scroll through so scroll-triggered reveals get their chance. Instant,
    // because the page's smooth scrolling would still be travelling when the
    // next step (or the measurement) runs.
    await page.evaluate(async () => {
      const to = (top) => window.scrollTo({ top, behavior: 'instant' });
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
        to(y);
        await new Promise((r) => setTimeout(r, 120));
      }
      to(document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 120));
      to(0);
    });
    await sleep(400);
    const r = await page.evaluate(measure);
    const file = `${outDir}/${width}x${height}.png`;
    await page.screenshot({ path: file, fullPage: true });

    const issues = [];
    if (r.overflow > 0) issues.push(`overflow ${r.overflow}px: ${r.wide.join(', ')}`);
    for (const l of r.lone) issues.push(`lone word ${l}`);
    for (const g of r.glued) issues.push(`no space ${g}`);
    if (r.hidden.length) issues.push(`not revealed: ${r.hidden.join(', ')}`);
    problems += issues.length;
    console.log(`${issues.length ? 'x' : 'ok'} ${width}x${height}  ${file}`);
    for (const i of issues) console.log(`    ${i}`);
  }
} finally {
  await browser.close();
  server?.close();
}

process.exit(problems ? 1 : 0);
