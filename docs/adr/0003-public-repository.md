# 0003: Public repository

**Status:** accepted, 2026-10-28

## Decision

This repository is public and licensed AGPL-3.0, matching the app (`kerti/uruni`).

## Why

Uruni's trust story is that the code is open and auditable. A hidden landing repo would be an odd
exception. Public also brings GitHub's native secret scanning and push protection, free branch
protection, and a meaningful private vulnerability reporting flow.

## Alternatives rejected

- **Private.** Nothing in a static brochure needs hiding, and it would lose the free protections
  above.

## Consequences

**Every diff is world-readable forever.** No secrets, no real personal data, no absolute local paths,
in code, commit messages or PR bodies. The gitleaks pre-commit hook and CI scan are backstops;
`CONTRIBUTING.md` states the scrub rule. The gitleaks setup keeps working if the repo ever goes
private.

## Revisit when

The app stops being open source.
