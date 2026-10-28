---
name: visual-check
description: Check the built site across the responsive matrix (1440 down to 320 wide) - full-page screenshots plus a report of horizontal overflow, one-word last lines and content left unrevealed - and look at the screenshots. Use before calling any visual change done, on every PR that touches layout, copy length or motion, and when asked to "check the layout", "check phone", or "screenshot it".
---

# Visual check

`npm run visual` (`scripts/visual-check.mjs`) is the mechanism. It drives the installed Chrome through puppeteer-core with real viewport emulation. Plain headless Chrome on macOS won't make a window narrower than about 500px, so phone shots from `--window-size` are wrong.

## 1. Build, then run

```sh
npm run build
npm run visual                                  # all seven viewports
npm run visual -- --only 390x844,1440x900       # a subset
npm run visual -- --url https://<preview>.pages.dev/   # a deployed preview
```

The script serves `dist/` itself. Don't use `astro preview` for this: run from a script it detaches into a background daemon that outlives the run (stop a stray one with `npx astro preview stop`).

The matrix is 1440x900, 1280x800, 800x1280, 844x390, 390x844, 360x780 and 320x640. Screenshots land in `.visual/` (gitignored). It exits 1 if it reports anything.

## 2. Read the report

- **overflow N px** names the widest elements. Fix the cause; `main { overflow-x: clip }` is a guard, not a fix.
- **lone word** is a one-word last line. Fix with `text-wrap: balance` / `pretty`, a `.nowrap` span around a phrase, or `&nbsp;` between a number and its unit. Never by shortening approved copy without asking.
- **not revealed** is a `[data-reveal]` element still without `.in-view` after a full scroll: the reveal script failed or the element is unreachable.

## 3. Look at the screenshots

The report can't see bad spacing, a chip row that pairs 3 + 1, a cropped illustration or an awkward break. Open at least the 1440, 800 and 390 shots and say what you saw.

## 4. Motion

For an animated element, also check:

- **Reduced motion:** emulate `prefers-reduced-motion: reduce`. Expect no animations and the resting state shown at once.
- **JavaScript disabled:** animations play on load and end on the resting state.
- **Frames:** pause every animation with `document.getAnimations()` and step `currentTime` to see the middle states. Use element screenshots (`elementHandle.screenshot()`); a `clip` on a scrolled page lands in the wrong place.

## 5. Report

List the viewports, the result per viewport, and anything you saw in the shots that the script couldn't. Findings that need a decision get IDs (L1, L2...) and wait for the maintainer.
