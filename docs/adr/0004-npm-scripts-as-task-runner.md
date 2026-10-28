# 0004: npm scripts as the task runner, no Makefile

**Status:** accepted, 2026-10-28

## Decision

Task automation lives in `package.json` scripts. The canonical verbs are `npm run
dev|build|preview|lint|format|format:check|astro:check|check`. `npm run check` is the local mirror of
CI. A `prepare` script installs the git hooks on `npm install`.

## Why

The app earns its Makefile by being polyglot (Go, Node, SQLite, Docker, Playwright). This repo is one
toolchain; a Makefile would be indirection over npm with nothing to unify.

## Alternatives rejected

- **A Makefile matching the app.** Keeps `make` muscle memory, at the cost of a second place to keep
  in sync.

## Consequences

Contributors coming from the app type `npm run check` instead of `make check`. Hook scripts that call
the build use npm.

## Revisit when

A second toolchain arrives.
