# Security policy

This repository holds the public landing site for Uruni. The site is static and collects no visitor
data (ADR-0001), so its attack surface is small. The app it describes holds communities' financial
records, so reports are still taken seriously.

## Reporting a vulnerability

**Do not open a public issue for a security problem.**

Report it privately through GitHub's
[private vulnerability reporting](https://github.com/kerti/uruni-landing/security/advisories/new):

1. Open the [Security tab](https://github.com/kerti/uruni-landing/security) of this repository.
2. Click **Report a vulnerability**.
3. Describe the issue, how to reproduce it, and the impact you believe it has.

If the issue is in the **app** rather than this website, report it against
[`kerti/uruni`](https://github.com/kerti/uruni/security) instead.

## Scope

In scope: the site's code, its build and deploy configuration (Cloudflare Pages), and anything that
could change what visitors see: defacement, injected script, supply-chain tampering through a
dependency or a GitHub Action.

Out of scope: vulnerabilities in third-party dependencies (report upstream; ours are tracked by
Dependabot), and findings that need an already-compromised host.

## What to expect

Maintained by one person. These timelines are best effort, not a contract:

- **Acknowledgement** within 5 business days.
- **Initial assessment** within 10 business days.
- Credit in the advisory once published, unless you prefer to stay anonymous.

Please allow a reasonable window for a fix before public disclosure.
