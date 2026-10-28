# Contributing to uruni-landing

The landing site for Uruni. A small, opinionated repo; a little orientation saves back-and-forth.

## Start here

- **Voice, the naming law, what the page may claim:** [`CONTEXT.md`](CONTEXT.md).
- **Why the repo is set up this way:** [`docs/adr/`](docs/adr/), one numbered decision per file.
- **Working with AI agents:** [`CLAUDE.md`](CLAUDE.md) (also `AGENTS.md`) and
  [`.claude/README.md`](.claude/README.md).
- **Domain questions** (what _cek kas_ or _amplop_ means): the app's
  [`CONTEXT.md`](https://github.com/kerti/uruni/blob/main/CONTEXT.md).

## Local setup

```sh
brew install gitleaks jq   # the secret guard and the Claude Code hooks are no-ops without them
npm install       # the "prepare" script also installs the git hooks
npm run dev       # http://localhost:4321
npm run check     # mirrors CI: lint, format:check, astro check, build
```

## How a change flows

1. **Branch, PR, squash-merge** (GitHub Flow). Never commit to `main`; it is protected.
2. **One concern per PR.** If one change depends on another, make one combined PR rather than a
   stack. Review fixes go on as extra commits on the open PR.
3. **PR titles are plain sentences** describing the change ("FAQ and closing CTA"). Label each PR
   `enhancement`, `bug`, `documentation` or `dependencies`.
4. **Decisions get an ADR** before code when they are hard to reverse: framework, host, visibility,
   any visitor-data capture, moving deploys into CI. Reversible copy and design calls go in
   `CONTEXT.md` with a date instead.
5. **Every PR gets a Cloudflare preview URL.** Wording and look are reviewed there.

The PR template carries the body structure: what changed, why, a checked list, and what is
deliberately not in the PR.

## Before you open a PR

- Copy follows `CONTEXT.md`: the naming law, the claims list, the anti-slop rules.
- New claims are checked against the app repo's own docs and listed in the PR.
- **Scrub the diff.** No secrets, no real personal data, no absolute local paths. This is a public
  repo.
- Static only holds (ADR-0001).

## Security

Vulnerabilities follow [`SECURITY.md`](SECURITY.md). Never open a public issue for one.

## Licence

By contributing you agree your contributions are licensed under [AGPL-3.0](LICENSE).
