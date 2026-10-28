# CONTEXT: Uruni landing copy

The brand voice and the copy rules for this site. Every word on the page answers to this file.

Sections marked _Pending: copy spine_ are drafted for the maintainer's approval in the copy-spine PR,
before any page section is built.

## 1. Scope

This file is narrower than the app's [`CONTEXT.md`](https://github.com/kerti/uruni/blob/main/CONTEXT.md),
which owns the domain vocabulary. Copy here stays at value-proposition altitude. When a precise
domain term is needed, borrow the app's word (*kas*, *cek kas*, *cocok*, *selisih*, *amplop*,
*titipan*, *talangan*, *golongan*, *laporan publik*) and never coin a synonym.

## 2. What Uruni is

Uruni is a small, calm app for the accidental treasurer: the person who was asked to look after a
small group's shared money and now keeps its dues, collections and spending. It records a
transaction from a phone in seconds, keeps cash and bank apart, and checks that the records match
the money actually held. A community runs Uruni on its own server; the project runs no service and
holds no one's data. It is free and open source (AGPL-3.0).

Deliberate non-features, stated as positioning: Uruni is not an operating system for an RT or an
organisation, not a payment-chasing or reminder machine, not accounting software, and does not
connect to banks or QRIS. It is not a tap-to-install consumer app: a technical helper sets up the
server.

## 3. The naming law

- In running text the product is **Uruni**: capital U, the rest lowercase.
- The wordmark is deliberately lowercase (**uruni**). That spelling appears only as the logo, never
  in text, headings, titles or metadata.
- The name is never inflected. No affix or particle attaches to it: *di Uruni* (preposition, a
  separate word), never *Uruni-mu*, *meng-Uruni-kan*, *Uruninya*.
- **Uruni** is the product; **urunan** and *urun* are the common words for pooling money. The law
  sentence: *"Setiap bulan anggota urunan; Uruni mencatat semuanya."*
- Forbidden: `URUNI`, `uruni` in running text, `UruNi`, using Uruni as a verb.

## 4. Brand assets and source of truth

- **Copied verbatim from the app** (byte-identical; re-copy when the app changes, never edit here):
  favicon, logomark and lockup SVGs (`docs/brand/` in the app), design tokens (`web/src/index.css`
  and `docs/Design-System.md`), and the font (Plus Jakarta Sans via `@fontsource-variable`).
- **Owned by the landing:** the share image, and compositional tokens built from the app's
  (header height, section padding, tints), kept in a separate block of the token file.
- 2026-10-28: light theme only, because the app has no dark palette yet (ADR-0008).

## 5. Value proposition

_Pending: copy spine._ Hero headline, subhead and 3 to 5 bullets.

## 6. Claims discipline

_Pending: copy spine._ The dated list of features the page may name. Everything else stays off the
page. No version numbers, no "alpha" or "beta" badge, no roadmap promises.

## 7. Audience and voice

- **Audience:** the accidental treasurer of a group of roughly 5 to 20 people (office units, RT,
  churches, choirs, alumni, family clans, hobby groups), and the technical helper who will set up
  the server.
- **Voice:** calm, warm, precise, a little opinionated; the app's *tenang*. No hype, no urgency, no
  fake scarcity, no testimonial theatre.
- **Address:** impersonal where possible, as in the app; **kamu** where a pronoun is needed. Never
  *Anda*, never mixed.
- **Language:** Indonesian only (ADR-0009), following EYD V and KBBI. Mind *di* as prefix versus
  preposition (*disimpan*, *di rumah*).
- **Loanwords:** _Pending: copy spine._ Per-term list (for example *sumber terbuka* or *open
  source*, *unduh* or *download*).

### Anti-slop rules

- No em dashes in visible copy or metadata.
- Few "X, not Y" contrasts, never in more than one heading.
- Be wary of three-item lists and three cards in a row.
- No stock closers. No *Tak hanya X, tetapi juga Y*; no *solusi terbaik / terlengkap / nomor satu*;
  no *Yuk, ...!* openers or exclamation marks; no *Mudah, cepat, dan aman* triplets; no repeated
  *Dengan Uruni, kamu bisa ...* frames; no English marketing calques (*level up*, *game changer*);
  no *Buruan!* or *Terbatas!*.
- Don't repeat in prose what a chip or list beside it already says.
- Curly quotes and apostrophes everywhere.
- A two-tone heading highlights only the hook.

### Formatting

`Rp1.250.000`, *Rp1,2 juta*; `12,5%`; *28 Oktober 2026*; `14.30 WIB`. Numbers and dates from data
are formatted with `Intl` in `id-ID` at build time. Non-breaking space between a number and its unit
where a break reads badly.

## 8. Calls to action

_Pending: copy spine._ Proposed: primary is the live demo (`demo.uruni.kerti.dev`), with its caveat
under the button; secondary is the self-hosting guide. The closing CTA repeats both buttons and the
caveat word for word. GitHub and the licence live in the header and footer, never as a competing
button.

## 9. Out of scope until an ADR says otherwise

Forms, a waitlist, email capture, analytics, cookies, a contact form, an English version, a dark
theme, a blog, pricing (there is none), and any hosted signup.
