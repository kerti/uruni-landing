# 0001: Pure static site, no visitor-data capture

**Status:** accepted, 2026-10-28

## Decision

The site ships as pure static HTML: no forms, no waitlist or email capture, no analytics, no
cookies, no backend or serverless functions, no signup on this domain.

## Why

The app's own promise is that the project holds nothing: each community runs its own server and no
Uruni-run service sees anyone's data. A landing page that collected visitor data would contradict
that on its first screen. It would also pull in a privacy policy in Indonesian (UU PDP applies), a
consent banner, a processor and a PII guard. With no data, the security posture is only "protect the
secrets in the build path".

Per-visitor preferences kept in the visitor's own `localStorage` (no cookie, no request) are
compatible with this ADR.

## Alternatives rejected

- **A waitlist.** There is no hosted signup to wait for; Uruni is self-hosted.
- **Privacy-friendly analytics.** Still a processor and still a claim to defend, for numbers a
  landing page this size does not need.

## Consequences

Any interactive or data feature is blocked until a new ADR. Hosts that inject analytics on their own
(Cloudflare Web Analytics) must be switched off and checked with a browser user agent.

## Revisit when

The project needs to hear from visitors in a way GitHub issues and discussions cannot serve.
