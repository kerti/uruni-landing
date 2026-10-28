# 0006: Concrete deploy config and production domain

**Status:** proposed, 2026-10-28. Filled in and accepted once the Pages project is connected.

## Decision

Record the Cloudflare Pages configuration in the repo, not only in the dashboard.

- Product: **Pages**, not Workers. No `wrangler.jsonc`, no deploy command.
- Project name: `uruni-landing` (default subdomain `uruni-landing.pages.dev`)
- Repo: `kerti/uruni-landing`, production branch `main`
- Build command: `npm run build`; output directory: `dist`
- Node: from `.nvmrc`, reinforced by a `NODE_VERSION` project variable
- No environment secrets (ADR-0001, ADR-0002)
- Production domain: **`uruni.kerti.dev`**, added under the Pages project's custom domains (DNS and
  TLS by Cloudflare). Previews on every PR.
- **Web Analytics off** for the zone. Check with a browser user agent:
  `curl -s -A "Mozilla/5.0 Chrome/130" -H "Accept: text/html" "https://uruni.kerti.dev/?v=$RANDOM" | grep -c cloudflareinsights`
  must print `0`.
- No HSTS header: the `.dev` TLD is HSTS-preloaded.

## Why

A dashboard is not reviewable or versioned. A fresh environment should be reproducible from this
file.

## Consequences

Any dashboard change gets mirrored here in the same week, through a PR.

## Revisit when

The domain or the host changes.
