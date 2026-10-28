# Agent guide: uruni-landing

The landing site for **Uruni**, written in Bahasa Indonesia. The app lives in
[`kerti/uruni`](https://github.com/kerti/uruni) (often checked out next to this repo as `../uruni`);
this repo is only the website. `AGENTS.md` is a symlink to this file.

Read before writing code or copy:

- **`CONTEXT.md`**: voice, the naming law, the claims list, the CTA policy. The source of truth for
  every word on the page. Copy that breaks it is wrong even if it reads well.
- **`CONTRIBUTING.md`**: how a change flows (branch, PR, squash-merge).
- **`docs/adr/`**: the decisions that shape this repo. Follow them; changing one needs a new ADR.

## Ground rules

- **Static only** (ADR-0001). No forms, analytics, cookies, backend or visitor-data capture without
  a new ADR.
- **Secrets.** The pre-commit hook runs gitleaks on staged changes; CI scans full history. Never
  commit tokens or keys. Never bypass with `--no-verify`.
- **Astro, zero JS by default** (ADR-0005). A client script needs a stated reason in its PR.
- **The app owns the domain and the brand.** Domain questions are answered by the app's
  `CONTEXT.md`, not invented here. Tokens, wordmark and favicon are copied verbatim from the app,
  never edited here.
- **Claims discipline.** The page names only what `CONTEXT.md`'s claims list allows. Never imply a
  feature the app lacks.
- **Public repo** (ADR-0003). No secrets, real personal data or absolute local paths in any diff,
  PR body or commit message.
- **Prose in English** (docs, ADRs, PRs, comments); visitor-facing copy in Indonesian (ADR-0009).
- **Light theme only** until the app ships a dark palette (ADR-0008).

## How agents work here (ADR-0007)

The main session is the orchestrator. Role agents live in `.claude/agents/`: `researcher`
(read-only lookups, mainly claim checks against the app repo), `builder` (slices whose shape is
decided), `reviewer` (a finished diff, before the PR). Their frontmatter pins model and effort.

- **Delegation needs a yes, every time** (`.claude/hooks/agent-gate.sh`). Under about three files
  or two tool calls, work inline.
- **Every brief carries its own context**: branch, paths, ADRs in play, definition of done, and
  "do not commit, push or open a PR". Run agents in the foreground.
- **Never trust the report.** Confirm with `git diff` and `npm run check`.
- **Never delegated:** commits, pushes, opening, labelling or merging PRs, ADR status changes, and
  any call on what the page may claim.
- **Audits list first, then wait** (copy, layout, accessibility, performance): findings get IDs
  (C1, L2, A3, P1), the maintainer approves by number.
- **Visual choices are previewed** before they are committed. Verify in light theme, desktop and
  phone, before calling a visual change done.

Tools without subagents (Codex, Cursor, anything reading `AGENTS.md`): same rules, one agent.
