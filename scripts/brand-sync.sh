#!/bin/sh
# Copy the brand from the app repo, which owns it (CONTEXT.md section 4).
#
#   sh scripts/brand-sync.sh          copy, then show what changed
#   sh scripts/brand-sync.sh --check  report drift only; exit 1 if any
#
# The app checkout defaults to ../uruni; set URUNI_DIR to point elsewhere. It
# should be on an up-to-date main: whatever it holds is what gets copied.
#
# Files are copied byte-for-byte. The tokens are the app's palette block in
# web/src/index.css: from the comment that opens it to the closing brace of
# its :root rule, copied verbatim into src/styles/tokens.css between the
# BEGIN/END markers. Nothing outside the markers is touched.
set -eu

cd "$(git rev-parse --show-toplevel)"
app=${URUNI_DIR:-../uruni}
check=0
[ "${1:-}" = "--check" ] && check=1

[ -f "$app/web/src/index.css" ] || {
  echo "brand-sync: no app checkout at $app (set URUNI_DIR)" >&2
  exit 2
}

# app path -> landing path
files="
docs/brand/uruni-lockup-horizontal.svg public/brand/uruni-lockup-horizontal.svg
docs/brand/uruni-lockup-stacked.svg public/brand/uruni-lockup-stacked.svg
docs/brand/uruni-logomark.svg public/brand/uruni-logomark.svg
web/public/favicon.svg public/favicon.svg
web/public/icons/apple-touch-icon-180.png public/apple-touch-icon.png
"

drift=0
log=$(mktemp)
echo "$files" | while read -r src dst; do
  [ -n "$src" ] || continue
  if ! cmp -s "$app/$src" "$dst" 2>/dev/null; then
    echo "drift: $dst (from $src)"
    [ "$check" = 1 ] || cp "$app/$src" "$dst"
  fi
done > "$log"
[ -s "$log" ] && drift=1
cat "$log"
rm -f "$log"

# Token block: from the palette comment to the end of the :root rule.
block=$(awk '
  /^\/\* The palette is Design-System.md verbatim/ { on = 1 }
  on { print }
  on && /^}/ { exit }
' "$app/web/src/index.css")
[ -n "$block" ] || {
  echo "brand-sync: palette block not found in $app/web/src/index.css" >&2
  exit 2
}

current=$(awk '/BEGIN app tokens/ { on = 1; next } /END app tokens/ { on = 0 } on' src/styles/tokens.css)
if [ "$block" != "$current" ]; then
  echo "drift: src/styles/tokens.css (from web/src/index.css palette block)"
  drift=1
  if [ "$check" = 0 ]; then
    tmp=$(mktemp)
    printf '%s\n' "$block" > "$tmp.block"
    awk -v f="$tmp.block" '
      /BEGIN app tokens/ { print; while ((getline line < f) > 0) print line; skip = 1; next }
      /END app tokens/ { skip = 0 }
      !skip { print }
    ' src/styles/tokens.css > "$tmp"
    mv "$tmp" src/styles/tokens.css
    rm -f "$tmp.block"
  fi
fi

if [ "$drift" = 0 ]; then
  echo "brand-sync: in sync with $app ($(git -C "$app" rev-parse --short HEAD))"
elif [ "$check" = 1 ]; then
  echo "brand-sync: drift found; run without --check to copy" >&2
  exit 1
else
  echo "brand-sync: copied from $app ($(git -C "$app" rev-parse --short HEAD)); review with git diff"
fi
