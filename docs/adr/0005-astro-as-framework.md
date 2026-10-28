# 0005: Astro as the framework

**Status:** accepted, 2026-10-28

## Decision

The site is built with **Astro**, static output, no adapter. Components are `.astro` by default; a
client script or island needs a stated reason in its PR. The major version is pinned to one with a
clean `npm audit` when the scaffold lands.

## Why

A content-first page wants static HTML, zero JavaScript by default, layouts and components, and an
image pipeline. Astro gives all four, and the Balances landing site proved the setup end to end.

## Alternatives rejected

- **Raw HTML and CSS.** No components, layouts or image pipeline.
- **Vite and React, like the app.** Ships a runtime and client rendering a brochure does not need;
  worse SEO by default.
- **Next.js.** Server-oriented, more than a static site warrants.

## Consequences

Cloudflare Pages serves `dist/` directly. The app's React components are not reused; the landing
copies the app's tokens and assets, not its code.

## Revisit when

The site needs something static output cannot serve. That would also reopen ADR-0001.
