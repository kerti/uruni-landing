// Screenshots of the live demo for the page, as phone-width crops.
//
//   npm run demo-shots
//
// Signs in to the demo with the account its login screen fills in, fills the
// forms the way the copy describes them (never saving, so the demo is left as
// it was), and writes one PNG per shot to src/assets/demo/. Each shot is cropped
// from the screen's title down to its last control: the app header (which
// carries the version number, kept off the page by CONTEXT.md) and the bottom
// navigation are hidden first.
//
// The demo's figures must match src/data/fund.ts; the script stops if they
// don't. Uses the Chrome already installed; set CHROME_PATH if it isn't in the
// usual place.
import { existsSync, mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { DEMO_URL } from '../src/consts.ts';
import { accounts } from '../src/data/fund.ts';

const OUT = 'src/assets/demo';
const PAD = 16;

const chromePath =
  process.env.CHROME_PATH ??
  [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => existsSync(p));
if (!chromePath) {
  console.error('demo-shots: no Chrome found; set CHROME_PATH');
  process.exit(2);
}

// Each shot: the screen, what to do on it, and the crop, from the element
// whose text matches `from` down to the one whose text matches `to`.
const SHOTS = [
  {
    name: 'catat',
    path: '/record',
    async fill(page) {
      await page.type('main input[inputmode="numeric"]', '75000');
      await page.type('main textarea', 'Snack rapat bulanan');
    },
    from: /^Catat transaksi$/,
    to: /^Simpan$/,
  },
  {
    name: 'cek-kas',
    path: '/reconcile',
    async fill(page) {
      const inputs = await page.$$('main input[inputmode="numeric"]');
      await inputs[0].type(String(accounts.tunai.counted));
      await inputs[1].type(String(accounts.bank.counted));
    },
    from: /^Cek kas$/,
    to: /^Simpan hasil cek$/,
  },
  {
    name: 'laporan',
    path: '/settings',
    from: /^Laporan publik$/,
    to: /^Buat tautan baru$/,
  },
];

mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  await page.goto(`${DEMO_URL}/`, { waitUntil: 'networkidle0' });
  const signIn = await page.$('button[type=submit]');
  if (signIn) {
    await Promise.all([page.waitForNetworkIdle(), signIn.click()]);
  }

  // The demo resets to its seed, so its balances should be the page's.
  const home = await page.evaluate(() => document.querySelector('main')?.innerText ?? '');
  for (const a of Object.values(accounts)) {
    const shown = new Intl.NumberFormat('id-ID').format(a.counted);
    if (!home.includes(shown)) {
      throw new Error(`demo-shots: the demo doesn't show ${a.name} ${shown}; update fund.ts`);
    }
  }

  for (const shot of SHOTS) {
    await page.goto(`${DEMO_URL}${shot.path}`, { waitUntil: 'networkidle0' });
    await page.addStyleTag({
      content: 'body > div header, nav { display: none !important; }',
    });
    await shot.fill?.(page);
    // Blur, so the inputs show their formatted value and no focus ring.
    await page.evaluate(() => document.activeElement?.blur());
    await new Promise((r) => setTimeout(r, 400));

    const clip = await page.evaluate(
      (from, to, pad) => {
        const find = (re) =>
          [...document.querySelectorAll('main *')].find(
            (el) => el.children.length === 0 && new RegExp(re).test(el.textContent.trim()),
          );
        const a = find(from);
        const b = find(to);
        if (!a || !b) return null;
        const top = a.getBoundingClientRect().top + window.scrollY - pad;
        const bottom =
          (b.closest('button, a') ?? b).getBoundingClientRect().bottom + window.scrollY + pad;
        return { x: 0, y: Math.max(0, top), width: window.innerWidth, height: bottom - top };
      },
      shot.from.source,
      shot.to.source,
      PAD,
    );
    if (!clip) throw new Error(`demo-shots: ${shot.name}: crop markers not found`);

    const file = `${OUT}/${shot.name}.png`;
    await page.screenshot({ path: file, clip, captureBeyondViewport: true });
    console.log(`ok ${file}  ${clip.width}x${Math.round(clip.height)}`);
  }
} finally {
  await browser.close();
}
