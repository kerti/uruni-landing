# 0002: Host on Cloudflare Pages through its Git integration

**Status:** accepted, 2026-10-28

## Decision

The site deploys to **Cloudflare Pages**, connected through its native Git integration: Cloudflare
watches the repo, builds production on merge to `main`, and builds a preview for every PR.

## Why

CI holds **no deploy secrets**: no API token or account id in GitHub, nothing to leak, no deploy job.
CI is quality gates only. Preview URLs per PR are how the maintainer reviews wording and look. The
same setup ran the Balances landing site without trouble.

## Alternatives rejected

- **`wrangler pages deploy` from a workflow.** Gates deploys on CI, at the cost of a Cloudflare token
  stored in GitHub.
- **Cloudflare Workers static assets.** The "import a repository" flow now defaults to it; it wants a
  `wrangler` config and a server entry a static site does not have.
- **The app's stack** (Docker, Fly.io, Caddy). It solves self-hosting a server; this repo has none.

## Consequences

Deploys are not gated on green CI. A broken build fails Cloudflare's own build and the live site
stays on the previous deploy.

## Revisit when

A bad deploy reaches production that CI would have stopped. Moving deploys into CI is a new ADR.
