#!/bin/sh
# PostToolUse(Edit|Write) hook - format the file that was just written, so
# formatting never shows up as review noise or as an `npm run check` failure.
#
# Best-effort and silent: no Prettier yet (before Phase B) or an unsupported
# file is a no-op, never a failed edit. Calls the installed binary directly:
# `npx prettier` falls through to a registry install on a miss.
set -eu

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
command -v jq >/dev/null 2>&1 || exit 0

f=$(jq -r '.tool_input.file_path // ""' 2>/dev/null) || exit 0
[ -n "$f" ] && [ -f "$f" ] || exit 0

case "$f" in
  */.claude/*) exit 0 ;;
esac

case "$f" in
  *.astro|*.ts|*.js|*.mjs|*.css|*.json|*.md|*.yml|*.yaml)
    [ -x node_modules/.bin/prettier ] &&
      node_modules/.bin/prettier --write --ignore-unknown "$f" >/dev/null 2>&1 || true
    ;;
esac
exit 0
