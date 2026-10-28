# uruni-landing

The landing site for **Uruni**, a calm app for keeping a small community's shared money honest.
The app lives in [`kerti/uruni`](https://github.com/kerti/uruni); this repo is only the website,
written in Bahasa Indonesia.

**New here?**

- [`CONTEXT.md`](CONTEXT.md): voice, the naming law, what the page may claim.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): how a change flows.
- [`docs/adr/`](docs/adr/): why the repo is set up the way it is.
- [`CLAUDE.md`](CLAUDE.md): rules for AI agents (and humans).

## Status

Pre-launch: Astro toolchain and a placeholder page. No content yet. It will live at `https://uruni.kerti.dev`.

## Local development

Prerequisites: Node 24 (pinned in `.nvmrc`), and `brew install gitleaks jq` for the local hooks.

```sh
npm install        # the "prepare" script also installs the git hooks
npm run dev        # http://localhost:4321
npm run build      # static build to dist/ (what Cloudflare Pages serves)
npm run check      # the local mirror of CI: lint, format:check, astro check, build
```

## Hosting

Cloudflare Pages through its Git integration (ADR-0002); the concrete config goes in ADR-0006.
CI holds no deploy secrets.

Licensed under [AGPL-3.0](LICENSE).
