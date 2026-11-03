// The share card (public/og.png): a still of the hero, taken from the built
// page so it can't drift from it.
//
//   npm run build && npm run og
//
// Loads dist/ at 1280x640 (rendered at 2x, so 2560x1280, 2:1 for
// summary_large_image) with reduced motion, so the hero drawing shows its
// resting tally. Keeps the wordmark, the eyebrow, the H1 and the tally; hides
// what is unreadable at share size or not a claim (the nav, the lede, the
// buttons and caveat, the chips) and every later section. Rerun after any
// change to the hero, and check the result at about 600x300. The GitHub
// repository's social preview has no API: upload the new file by hand
// (Settings, General, Social preview).
import { existsSync, statSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { serveDist } from './lib/serve-dist.mjs';

const OUT = 'public/og.png';
const W = 1280;
const H = 640;

const chromePath =
  process.env.CHROME_PATH ??
  [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => existsSync(p));
if (!chromePath) {
  console.error('og-image: no Chrome found; set CHROME_PATH');
  process.exit(2);
}

// The card's layout, over the page's own styles. The hero fills the space
// under the header, its two columns centred; the tally is scaled up a little
// so its figures survive the share size.
const CARD = `
  .skip-link, .site-header nav, .site-header .repo,
  .hero .lede, .hero .ctas, .hero .caveat, .hero .chips,
  main > :not(:first-child), footer { display: none !important; }
  .site-header { position: static; }
  html, body { height: ${H}px; overflow: hidden; }
  .hero {
    box-sizing: border-box;
    height: calc(${H}px - var(--header-height));
    padding-block: 0 !important;
    display: grid;
    align-items: center;
  }
  .hero .grid { grid-template-columns: 1fr 24rem !important; gap: 5rem !important; }
  .hero h1 { font-size: 4.25rem !important; text-wrap: balance; }
  .hero .cekkas { transform: scale(1.15); transform-origin: center; }
`;

const server = await serveDist('og-image');
const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  // The page's CSP refuses the injected card styles; this is a local render.
  await page.setBypassCSP(true);
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(`${server.base}/`, { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: CARD });
  await page.evaluate('document.fonts.ready');
  await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: W, height: H } });
  console.log(`ok ${OUT}  ${W * 2}x${H * 2}  ${Math.round(statSync(OUT).size / 1024)} KB`);
} finally {
  await browser.close();
  server.close();
}
