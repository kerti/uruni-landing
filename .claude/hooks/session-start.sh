#!/bin/sh
# SessionStart hook - orient the agent, and sync main when (and only when) that
# is safe: fast-forward only, only on a clean main. On any other branch, or a
# dirty tree, it reports where you are and touches nothing.
#
# Emits JSON: additionalContext goes to the agent, systemMessage to the human.
# Never fails the session; worst case it prints nothing.
set -eu

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
command -v jq >/dev/null 2>&1 || exit 0

emit() { # emit <additionalContext> [systemMessage]
  if [ $# -ge 2 ] && [ -n "$2" ]; then
    jq -n --arg ac "$1" --arg sm "$2" \
      '{hookSpecificOutput:{hookEventName:"SessionStart",additionalContext:$ac},systemMessage:$sm}'
  else
    jq -n --arg ac "$1" \
      '{hookSpecificOutput:{hookEventName:"SessionStart",additionalContext:$ac}}'
  fi
  exit 0
}

branch=$(git branch --show-current 2>/dev/null || echo "")
[ -n "$branch" ] || exit 0
dirty=$(git status --porcelain 2>/dev/null | grep -c . || true)

if [ "$dirty" -gt 0 ]; then
  emit "On branch '$branch', working tree dirty ($dirty change(s)) - sync skipped." \
    "! Working tree dirty ($dirty change(s)) on '$branch' - commit, stash, or clean before syncing."
fi

if [ "$branch" != "main" ]; then
  emit "On feature branch '$branch', clean tree @ $(git rev-parse --short HEAD). Left alone - main is only synced when you are on it."
fi

if output=$(git pull --ff-only --quiet 2>&1); then
  emit "On main, synced @ $(git rev-parse --short HEAD). Branch before changing anything: never commit to main."
else
  emit "Sync of main FAILED: $output" "! git pull --ff-only on main failed: $output"
fi
