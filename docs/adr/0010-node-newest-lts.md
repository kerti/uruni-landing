# 0010: Node tracks the newest LTS line

**Status:** accepted, 2026-11-22. Supersedes the Node line of ADR-0006.

## Decision

Build and develop on the newest Node line that has entered LTS. Move to a new line once it enters
LTS, not at its first release.

- `.nvmrc` holds the major version and is the one source of truth. CI reads it through
  `setup-node`'s `node-version-file`.
- `package.json` `engines.node` is `>=` that major.
- The Cloudflare Pages project variable `NODE_VERSION` matches `.nvmrc`.
- A move to a new LTS line is a PR that changes those three places and the README prerequisite. It
  does not need a new ADR.

## Why

The site is static (ADR-0001), so Node only runs the build and the local tooling. Staying on the
newest LTS gives the longest runway before end of life, and moving early keeps each move small. A
policy instead of a pinned number means bumps don't need a new ADR.

## Alternatives rejected

- **Pin a version in the ADR.** Every bump would need a superseding ADR for a one-line change.
- **`lts/*` in `.nvmrc`.** Builds would change version on their own, unreviewed, and the dashboard
  variable would drift from it.
- **Match the app's Node version.** The app owns the domain and the brand, not the toolchain.

## Consequences

Local development follows `.nvmrc` (`nvm use`). The dashboard variable changes in the same week as
the PR that bumps `.nvmrc` (ADR-0006's mirroring rule). Until it does, Pages builds on the old line,
which still works because `engines` is advisory without `engine-strict`.

## Revisit when

A dependency lags the newest LTS line, or the build starts needing something only a non-LTS release
has.
