# 0009: Indonesian only, one locale

**Status:** accepted, 2026-10-28

## Decision

The site is written in Bahasa Indonesia only and served at `/` with `<html lang="id">`. No i18n
routing, no `/en/`, no language switch. Strings live in the components. Repo prose (docs, ADRs, code
comments, PRs) stays in English.

## Why

The app is Indonesian-first (its ADR-014) and its audience, the accidental treasurer of a small
Indonesian group, reads Indonesian. A second locale doubles every copy decision before the first one
is settled.

## Alternatives rejected

- **Indonesian plus English.** Reaches technical helpers and contributors abroad, but they already
  have the app repo's English README and docs.

## Consequences

Every visitor-facing string is Indonesian, including alt text, `aria-label`s, the skip link and
metadata. English terms kept in copy carry `lang="en"`. Adding English later means moving strings
into per-locale content files.

## Revisit when

There is a real English-reading audience the app repo does not serve.
