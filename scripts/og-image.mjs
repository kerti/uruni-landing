// The share card (public/og.png): a still of the hero, taken from the built
// page so it can't drift from it.
//
//   npm run build && npm run og
//
// Loads dist/ at 1200x630, rendered at 2x (2400x1260: the 1.91:1 that Open
// Graph and summary_large_image expect, so nothing is cropped), with reduced
// motion, so the hero drawing shows its resting tally. Keeps the wordmark,
// the eyebrow, the H1 and the tally; hides what is unreadable at share size
// or not a claim (the nav, the lede, the buttons and caveat, the chips) and
// every later section. The ripple is recentred over the tally and the
// closing section's waves run along the foot. Rerun after any change to the
// hero, and check the result at about 600x315. The GitHub repository's social
// preview has no API: upload the new file by hand (Settings, General, Social
// preview).
import { existsSync, statSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { serveDist } from './lib/serve-dist.mjs';

const OUT = 'public/og.png';
const W = 1200;
const H = 630;

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
  /* Room at the sides: some previews round or trim the card's corners. */
  .site-header .container, .hero .container { padding-inline: 4.5rem !important; }
  html, body { height: ${H}px; overflow: hidden; }
  .hero {
    box-sizing: border-box;
    height: calc(${H}px - var(--header-height));
    padding-block: 0 !important;
    display: grid;
    align-items: center;
  }
  .hero .grid { grid-template-columns: 1fr 24rem !important; gap: 4rem !important; }
  .hero h1 { font-size: 4.25rem !important; text-wrap: balance; }
  /* The eyebrow, scaled up so it reads at share size; nudged right so its
     outer ring, not just the dot, lines up with the H1. */
  .hero .eyebrow { zoom: 1.5; margin-left: 0.75rem; }
  .waves { height: 5.5rem !important; }
  .hero .cekkas { transform: scale(1.1); transform-origin: center; }
`;

// Runs in the page. The waves are the closing section's own, copied in, so
// they keep the page's styles.
const PLACE_BACKDROP = `(() => {
  const zones = document.querySelectorAll('main > .zone');
  const hero = zones[0];
  hero.append(zones[zones.length - 1].querySelector('.waves').cloneNode(true));

  const svg = hero.querySelector('.ripples svg');
  const card = hero.querySelector('.cekkas .tally').getBoundingClientRect();
  const header = document.querySelector('.site-header').getBoundingClientRect();
  const zone = hero.getBoundingClientRect();
  const size = svg.getBoundingClientRect().width;
  const cx = card.left + card.width / 2 - zone.left;
  const cy = (header.bottom + card.top) / 2 - zone.top;
  svg.style.left = cx - size / 2 + 'px';
  svg.style.right = 'auto';
  svg.style.top = cy - size / 2 + 'px';
})()`;

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
  // Lay the backdrop out for the card: the closing section's waves along the
  // foot, and the ripple's drop centred over the tally, halfway between the
  // header and the card, so the rings frame it.
  await page.evaluate(PLACE_BACKDROP);
  await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: W, height: H } });
  console.log(`ok ${OUT}  ${W * 2}x${H * 2}  ${Math.round(statSync(OUT).size / 1024)} KB`);
} finally {
  await browser.close();
  server.close();
}
