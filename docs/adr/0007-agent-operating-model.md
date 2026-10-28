# 0007: Agent operating model

**Status:** accepted, 2026-10-28

## Decision

Adopt the app's agent operating model ([ADR-023 in `kerti/uruni`](https://github.com/kerti/uruni/blob/main/docs/ADR/023-agent-operating-model.md)),
slimmed for a static site:

- `CLAUDE.md` is the agent entry point, with `AGENTS.md` as a symlink so other tools read the same
  rules. It stays short, because it loads into every subagent.
- `.claude/settings.json` pins the orchestrator (`opus`, effort `medium`), turns off forked
  subagents, allows only safe read and check commands, and wires four hooks: session start
  (fast-forward `main` only when already on it), a pre-push gate (`npm run check` must pass), a
  format-on-edit hook (Prettier), and an agent gate (every subagent launch asks the maintainer).
- Three role agents: `researcher`, `builder`, `reviewer`.
- Project skills arrive with the phase they serve: `brand-sync` (brand), `copy-audit` (copy spine),
  `visual-check` (first content slice), `launch-check` (hardening).

## Why

The same maintainer drives both repos with the same tools; one model across them means one set of
habits. The app's model was tuned on a long project and its reasoning (delegate for context, never
trust a report, the maintainer signs off) holds here.

## Alternatives rejected

- **Only `CLAUDE.md`, as on Balances' landing.** Worked, but left the recurring jobs (re-copying
  brand assets, copy sweeps, responsive checks) to be re-explained each time.
- **The app's full set of six agents.** `planner`, `grill` and `builder-deep` exist for a ledger.
  Planning here is light, the global `grill-with-docs` skill covers stress tests, and nothing here is
  a money core.

## Consequences

Hooks need `jq`; without it they do nothing. The pre-push gate does nothing until `package.json`
exists. Skills are added in the PRs that first need them, so none is written ahead of use.

## Revisit when

The app's ADR-023 changes in a way that matters here, or a role is wanted often enough to earn a
file.
