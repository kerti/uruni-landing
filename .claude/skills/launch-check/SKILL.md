---
name: launch-check
description: Run the launch checklist (landing guidelines section 16) against the build, the repo and the live site - security headers, 404 status, immutable caching, the Cloudflare beacon, CSP, SEO tags, npm audit, brand drift, GitHub settings and Lighthouse on the plain live URL - then the items no script can see. Lists findings with IDs and waits. Use for a hardening pass, before dropping noindex or announcing the site, after any change to hosting, headers or the Cloudflare zone, and when asked to "check launch readiness" or "run Lighthouse".
---

# Launch check

`npm run launch-check` (`scripts/launch-check.mjs`) is the mechanical half. This skill adds what it can't see and the order to run things in.

## 1. Start from what production should be

```sh
git switch main && git pull --ff-only
npm run check            # lint, format, astro check, build: dist/ is now what main builds
```

The script compares the live page's hashed `/_astro/` assets with `dist/`. On anything but an up-to-date `main` that comparison is meaningless.

## 2. Run it

```sh
npm run launch-check                       # build + repo + live (astro.config.mjs `site`)
npm run launch-check -- --lighthouse       # plus Lighthouse 13.6.0, mobile and desktop
npm run launch-check -- --url https://<branch>.uruni-landing.pages.dev
npm run launch-check -- --local            # no network
```

Exits 1 on any FAIL. What the lines mean when they go wrong:

- **live: serves the same build as dist/ (WARN), with the 404, data-font or other live checks failing:** production didn't deploy `main`. On 2026-11-04 a GitHub incident dropped the push event for a merge, so neither CI nor Cloudflare Pages ran; Dependabot didn't rescan either. Check `gh run list --branch main` for a run on the head commit. If there is none, the maintainer retries the production deploy in the Cloudflare dashboard. A `*.uruni-landing.pages.dev` alias that answers "Nothing is here yet" is Cloudflare's own 404 for an alias that doesn't exist, not this site's.
- **no Cloudflare Web Analytics beacon:** the zone (kerti.dev) injects it into responses that look like browser page loads, which is why the script sends a browser `Accept` header; a bare `curl` misses it. Off is a zone setting the maintainer changes (issue #8). Until then Lighthouse Best Practices sits at 92, because our CSP refuses the beacon and logs it.
- **index is indexable (WARN):** `noindex` stays until #8 is closed; dropping it is the last step before launch.
- **Lighthouse:** test the plain URL only (a `?query` skips Cloudflare's cache). Below 95 is a FAIL except SEO under `noindex`. A contrast failure in the hero on desktop only is Lighthouse sampling the tally mid-fade; confirm against the resting colours before calling it real. Reports are saved to the temp folder the script prints.

## 3. The items no script sees

Run or confirm each, and report it alongside the script's output:

- **Copy:** the `copy-audit` skill. The claims list, CTA caveats, no version numbers.
- **Layout and motion:** the `visual-check` skill across the matrix, including its motion section (JavaScript disabled: page complete; reduced motion: no animation).
- **Brand:** the `brand-sync` skill if the script reported drift.
- **Screen-reader text** from the built HTML: skip link first, labelled navs, one H1, `aria-hidden` on decorative SVGs, the _Tidak termasuk:_ prefixes, no words glued across inline elements.
- **CSP negative test:** an inline `<script>` added to a built page in DevTools must not run, and the console shows no violations except the beacon (until #8).
- **Share card:** `public/og.png` regenerated after any hero change (`npm run og`), legible at about 600x300, and re-uploaded by hand as the GitHub repository's social preview (Settings, General, Social preview; there is no API).
- **Cloudflare Pages settings** (dashboard, maintainer): a Pages project, Node from `.nvmrc` plus the env var, the custom domain, previews on PRs, Web Analytics off.
- **Pre-commit gitleaks hook:** `gitleaks version` works and a staged test secret is refused (then unstaged).

## 4. Report, then wait

One table: every script line that isn't PASS, plus each item from section 3 with its result. Findings get IDs by area (`S` security and hosting, `P` performance, `A` accessibility, `C` copy, `L` layout, `H` housekeeping), each with the evidence (the command or the score) and a proposed fix, and whether it is ours to fix or the maintainer's (dashboard, zone, repo settings). Then stop: fixes wait for approval by number.
