# 0008: Light theme only until the app ships a dark palette

**Status:** accepted, 2026-10-28

## Decision

The site ships a light theme only: no dark tokens, no theme toggle, `color-scheme: light`. Tokens
are still custom properties, so dark mode later is a token re-copy plus a toggle.

## Why

The app owns the brand and its design system defers dark mode; it has no dark palette. Inventing one
here would break the rule that brand comes from the app, and the landing would show a look the app
does not have. The landing guidelines treat `light-dark()` tokens and a toggle as a must; this ADR
records the deviation.

## Alternatives rejected

- **A landing-only dark palette.** Drifts from the app by construction.
- **Following the OS with an automatic inversion.** Same problem, less control.

## Consequences

No `.light-only` / `.dark-only` asset pairs, no theme toggle script, one `theme-color` meta. Visual
checks run in the light theme only.

## Revisit when

The app ships dark mode. Then copy its tokens as `light-dark()` pairs and add the toggle.
