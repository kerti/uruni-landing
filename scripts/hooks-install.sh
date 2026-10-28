#!/bin/sh
# Enable the repo's git hooks and seed local Claude Code settings (once per
# clone; also run by the npm "prepare" script once the toolchain lands).
set -eu

cd "$(git rev-parse --show-toplevel)"
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit .claude/hooks/*.sh
echo "ok: git hooks installed (core.hooksPath=.githooks); pre-commit secret guard active"

if [ ! -f .claude/settings.local.json ]; then
  cp .claude/settings.local.json.example .claude/settings.local.json
  echo "ok: seeded .claude/settings.local.json from the example"
fi

if ! command -v gitleaks >/dev/null 2>&1; then
  echo "  note: gitleaks not installed - the local scan skips until you run: brew install gitleaks" >&2
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "  note: jq not installed - the Claude Code hooks do nothing without it: brew install jq" >&2
fi
