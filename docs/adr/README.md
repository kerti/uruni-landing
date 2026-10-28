# Architecture decision records

One decision per file, numbered. Each states the decision, why, the alternatives rejected, the
consequences, and what would make us revisit it.

- Write the ADR **before** the code for anything hard to reverse.
- Follow existing ADRs without writing a new one. Changing an accepted ADR takes a new ADR that
  supersedes it.
- Reversible copy and design calls do not get ADRs; they go in `CONTEXT.md` with a date.

| # | Decision | Status |
|---|---|---|
| [0001](0001-pure-static-site.md) | Pure static site, no visitor-data capture | accepted |
| [0002](0002-cloudflare-pages-hosting.md) | Cloudflare Pages through its Git integration | accepted |
| [0003](0003-public-repository.md) | Public repository | accepted |
| [0004](0004-npm-scripts-as-task-runner.md) | npm scripts as the task runner | accepted |
| [0005](0005-astro-as-framework.md) | Astro as the framework | accepted |
| [0006](0006-deploy-config-and-domain.md) | Deploy config and production domain | proposed |
| [0007](0007-agent-operating-model.md) | Agent operating model | accepted |
| [0008](0008-light-theme-only.md) | Light theme only until the app ships a dark palette | accepted |
| [0009](0009-indonesian-only.md) | Indonesian only, one locale | accepted |
