---
name: brand-sync
description: Re-copy Uruni's brand (palette tokens, lockup and logomark SVGs, favicon, apple-touch icon) from the app repo into this site byte-for-byte, and report any drift. Use when the app's brand or Design-System.md changed, when asked to "sync the brand" or check for drift, and before a launch or hardening pass.
---

# Sync the brand from the app

The app (`kerti/uruni`) owns the brand (`CONTEXT.md` section 4). This site copies it and never edits the copies. `scripts/brand-sync.sh` is the whole mechanism; this skill is how to run it safely.

## 1. Make sure the app checkout is current

The script copies whatever the checkout holds, so it must be on an up-to-date `main`:

```sh
git -C ../uruni switch main && git -C ../uruni pull --ff-only
```

If the app lives elsewhere, set `URUNI_DIR`. If its tree is dirty or on another branch, stop and tell the maintainer rather than switching it.

## 2. Check, then copy

```sh
sh scripts/brand-sync.sh --check   # lists drift, exits 1 if any
sh scripts/brand-sync.sh           # copies, then lists what it copied
```

The script copies these files byte-for-byte:

- the lockups and logomark: `docs/brand/` to `public/brand/`
- the favicon: `web/public/favicon.svg` to `public/favicon.svg`
- the apple-touch icon: `web/public/icons/apple-touch-icon-180.png` to `public/apple-touch-icon.png`

It also copies the app's palette block in `web/src/index.css` (from the _The palette is Design-System.md verbatim_ comment to the end of its `:root` rule). The block goes between the `BEGIN/END app tokens` markers in `src/styles/tokens.css`.

## 3. Review what moved

- `git diff` the result. A changed token **name** (not just a value) means a component may reference a token that no longer exists: grep `src/` for the old name and report it.
- A palette change can break contrast on landing-owned surfaces (tints, glows). List what to re-check rather than adjusting copied values.
- If the app added a dark palette, that is ADR-0008's revisit trigger: say so, don't build it.
- If the app moved or renamed a brand file, the script reports it missing. Update the file map in the script in the same PR.

## 4. Verify and hand off

- Run `npm run check`, then `sh scripts/brand-sync.sh --check` again: it must report in sync.
- Screenshot the page in the light theme at desktop and phone widths.
- The PR names the app commit the copy came from (the script prints it).
- Never edit inside the token markers or the copied files to "fix" something. A brand fix goes to the app first.
