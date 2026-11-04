---
name: copy-audit
description: Audit the page's Indonesian copy against CONTEXT.md - the naming law, the claims list, voice and address (kamu), loanwords, anti-slop rules and formatting - over the rendered text, metadata, alt text and aria-labels. Lists findings with IDs (C1, C2...) and waits for approval. Use on every PR that adds or changes visible copy, before a launch or hardening pass, and when asked to "audit the copy", "sweep the copy" or "check the wording".
---

# Copy audit

`CONTEXT.md` is the law; this skill is how to check a page against it. Half is mechanical (`npm run copy-audit`), half is reading. Both halves report; nothing is changed until the maintainer approves findings by number.

## 1. Run the script

```sh
npm run build
npm run copy-audit                                   # every page in dist/
npm run copy-audit -- --url https://<preview>.pages.dev/
```

`scripts/copy-audit.mjs` renders each page in Chrome with every `<details>` opened and reads the visible text, the title, meta and share tags, JSON-LD, alt text, aria-labels and SVG titles.

- **FAIL** breaks a written rule: em dashes, straight quotes or apostrophes (CONTEXT.md wants curly ones everywhere), the naming law, _Anda_, exclamation marks, the slop list, version numbers or stage badges, loanwords with an Indonesian word on the list, Uruni as the subject of checking or counting the money. Exits 1.
- **REVIEW** is a heuristic, or a word that is right in context: never-claim words (fine in an FAQ answer that says _Tidak_), lists of three without the comma before _dan_, a number and unit that may break apart, _bukan/tidak X, tetapi Y_ contrasts, and any four-word phrase said three times or more. The CTAs and caveat repeat word for word by design (CONTEXT.md section 8); everything else repeated is a finding.

A false positive in the script is fixed in the script (a tighter pattern or a skip), in the same PR, never by rewording approved copy around it.

## 2. Read the page

The script can't judge these. Read the rendered text (or `dist/index.html`) against CONTEXT.md:

- **Claims (section 6).** Every feature named is on the allowed list; nothing from _Not yet_ or _Never_ is implied; no roadmap promises. A new claim needs a source in the app repo: ask before sending the `researcher`, and the call on what the page may claim stays with the maintainer.
- **Who checks the money.** The treasurer counts and reads; Uruni compares and shows the _selisih_. Watch for softer forms the script misses (_Uruni memastikan uangnya_, _Uruni tahu_).
- **Voice (section 7).** Calm, warm, precise. No hype, urgency or testimonial theatre. _kamu_ only, _kalian_ for the group. _di_ as prefix versus preposition.
- **Anti-slop.** "X, not Y" contrasts: few, never in more than one heading. Three-item lists and three cards in a row. Stock closers. Prose that repeats a chip or list beside it. A two-tone heading highlights only the hook.
- **Formatting.** `Rp1.250.000`, _Rp1,2 juta_, `12,5%`, _28 Oktober 2026_, `14.30 WIB`; numbers from data go through `Intl` in `id-ID`.
- **Section 10.** Each section has an id, eyebrow, heading and lede, and still earns its place.
- **Screen-reader text.** `sr-only` prefixes and `lang="en"` where a term would be mispronounced (_login_, _server_).

## 3. Report, then wait

One list, IDs `C1`, `C2`..., each with where it is (section and element), the current text, the rule, and a proposed rewrite in Indonesian. Group script FAILs first, then REVIEW items you agree with, then reading findings. Say which REVIEW items you dismissed and why, in one line each.

Stop there. Copy changes only after the maintainer approves by number, and a change to approved copy in `CONTEXT.md` (section 5, 8, 10) updates that file in the same PR.
