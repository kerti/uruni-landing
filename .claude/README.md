# `.claude/`: operator notes

For the maintainer, not the agents. Claude Code loads `settings.json`, `agents/*.md`, `hooks/*.sh`
and `skills/`; it does not load this file. The rules agents follow are in
[`CLAUDE.md`](../CLAUDE.md); the reasoning is [ADR-0007](../docs/adr/0007-agent-operating-model.md),
which adapts the app's ADR-023.

## What's here

| Path                     | Loaded when             | Purpose                                                                                                           |
| ------------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `settings.json`          | Session start           | Pins the orchestrator (`opus`, `medium`), wires the hooks, allows safe commands. `gh issue` writes always prompt. |
| `settings.local.json`    | Session start           | Yours, gitignored. Approvals and commit attribution. Seeded by `scripts/hooks-install.sh`.                        |
| `agents/*.md`            | On delegation           | `researcher`, `builder`, `reviewer`. Frontmatter `model` and `effort` are what binds.                             |
| `hooks/session-start.sh` | Session start           | Orients; fast-forwards `main` only when already on a clean `main`.                                                |
| `hooks/pre-push-gate.sh` | Before every Bash call  | Denies `git push` when `npm run check` fails. No-op before Phase B.                                               |
| `hooks/agent-gate.sh`    | Before every Agent call | Every subagent launch becomes a permission prompt.                                                                |
| `hooks/format-file.sh`   | After Edit/Write        | Prettier on the file just written. No-op before Phase B.                                                          |
| `skills/`                | When the task matches   | Added with the phase they serve: `brand-sync`, `copy-audit`, `visual-check`, `launch-check`.                      |

The hooks need `jq` (`brew install jq`); without it they do nothing. `scripts/hooks-install.sh`
re-arms their executable bits.

## Overriding the defaults

| You want                        | Do this                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| Deeper reasoning for one turn   | Put `ultrathink` in the prompt                                |
| Deeper for this session         | `/effort max` (never persists)                                |
| A different level going forward | `/effort high`; undo with `/effort auto`                      |
| No delegation                   | Answer _no_ at the agent-gate prompt, or say "do this inline" |

`/effort low|medium|high|xhigh` persists across sessions, and `CLAUDE_CODE_EFFORT_LEVEL` beats
everything. If effort isn't behaving, check `env | grep CLAUDE_CODE_EFFORT` first.

## Cost notes

See the app's `.claude/README.md` for the full model. In short: effort is the biggest lever;
delegation saves context, not tokens; under about three files, inline wins. `CLAUDE.md` loads into
every subagent, so its length is a running cost.
