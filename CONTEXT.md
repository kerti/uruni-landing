# CONTEXT: Uruni landing copy

The brand voice and the copy rules for this site. Every word on the page answers to this file.

The copy spine (sections 5, 6, 8 and 10, the loanword list, and the canonical Indonesian paragraph)
was approved by the maintainer on 2026-10-28. Changing it is a dated edit to this file, in its own
PR.

## 1. Scope

This file is narrower than the app's [`CONTEXT.md`](https://github.com/kerti/uruni/blob/main/CONTEXT.md),
which owns the domain vocabulary. Copy here stays at value-proposition altitude. When a precise
domain term is needed, borrow the app's word (_kas_, _cek kas_, _cocok_, _selisih_, _amplop_,
_titipan_, _talangan_, _golongan_, _laporan publik_) and never coin a synonym.

## 2. What Uruni is

Uruni is a small, calm app for the accidental treasurer: the person who was asked to look after a
small group's shared money and now keeps its dues, collections and spending. It records a
transaction from a phone in seconds, keeps cash and bank apart, and checks that the records match
the money actually held. A community runs Uruni on its own server; the project runs no service and
holds no one's data. It is free and open source (AGPL-3.0).

**Canonical paragraph in Indonesian** (meta description source, JSON-LD, the footer):

> Uruni adalah aplikasi sumber terbuka untuk bendahara kas kelompok kecil. Setiap transaksi dicatat
> dari ponsel, uang tunai dan rekening bank dipisahkan, dan cek kas menunjukkan apakah catatan cocok
> dengan uang yang ada. Uruni berjalan di server milik kelompok itu sendiri; proyek Uruni tidak
> menyimpan data siapa pun. Gratis, selamanya.

**Meta description** (under 160 characters):

> Aplikasi kas untuk bendahara kelompok kecil: catat dari ponsel, cek kas tunai dan bank, bagikan
> laporan. Di server sendiri, gratis, sumber terbuka.

Deliberate non-features, stated as positioning: Uruni is not an operating system for an RT or an
organisation, not a payment-chasing or reminder machine, not accounting software, and does not
connect to banks or QRIS. It is not a tap-to-install consumer app: a technical helper sets up the
server.

## 3. The naming law

- In running text the product is **Uruni**: capital U, the rest lowercase.
- The wordmark is deliberately lowercase (**uruni**). That spelling appears only as the logo, never
  in text, headings, titles or metadata.
- The name is never inflected. No affix or particle attaches to it: _di Uruni_ (preposition, a
  separate word), never _Uruni-mu_, _meng-Uruni-kan_, _Uruninya_.
- **Uruni** is the product; **urunan** and _urun_ are the common words for pooling money. The law
  sentence: _"Setiap bulan anggota urunan; Uruni mencatat semuanya."_
- Forbidden: `URUNI`, `uruni` in running text, `UruNi`, using Uruni as a verb.

## 4. Brand assets and source of truth

- **Copied verbatim from the app** by `scripts/brand-sync.sh` (the `brand-sync` skill; byte-identical,
  re-copied when the app changes, never edited here):
  favicon, logomark and lockup SVGs (`docs/brand/` in the app), design tokens (`web/src/index.css`
  and `docs/Design-System.md`), and the font (Plus Jakarta Sans via `@fontsource-variable`).
- **Owned by the landing:** the share image, and compositional tokens built from the app's
  (header height, section padding, tints), kept in a separate block of the token file.
- 2026-10-28: light theme only, because the app has no dark palette yet (ADR-0008).

## 5. Value proposition

- **Eyebrow:** Untuk bendahara kas kelompok kecil
- **Headline (H1):** Catatan kas yang **selalu cocok** dengan uang yang ada.
  The accent is on _selalu cocok_. It is the app's emotional core (_Tenang, karena catatan selalu
  cocok dengan uang yang ada_) without the _tenang_, which the page should earn rather than claim.
- **Subhead:** Catat uang masuk dan keluar dari ponsel. Uruni lalu memeriksa apakah catatan itu sama
  dengan uang tunai di dompet dan saldo di rekening, dan menunjukkan selisihnya kalau ada.

**Value bullets:**

1. **Catat dari ponsel.** Uang masuk atau keluar tercatat dalam beberapa ketukan, di warung atau di
   kantor.
2. **Cek kas kapan saja.** Masukkan uang tunai yang dihitung dan saldo yang tertera di bank. Uruni
   menjawab cocok, atau menunjukkan selisihnya.
3. **Satu saldo, pos yang jelas.** Kas Utama, amplop, dan titipan tetap terpisah di catatan, meski
   uangnya satu.
4. **Laporan untuk semua anggota.** Satu tautan, tanpa login, untuk siapa pun yang ingin tahu ke mana
   uangnya pergi.
5. **Data tetap milik kelompok.** Uruni berjalan di server kalian sendiri. Proyek Uruni tidak
   menyimpan data apa pun.

## 6. Claims discipline

The page may name only what is on this list. Everything else stays off the page. No version numbers,
no "alpha" or "beta" badge, no roadmap promises. Each entry cites where the app repo says it.

**Allowed (2026-10-28):**

| Claim                                                                                                              | Source in `kerti/uruni`           |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| Record a transaction from a phone in a few taps                                                                    | PRD §4 goal 1, §7.2               |
| Cash and bank kept apart, several accounts of either kind                                                          | `CONTEXT.md` Account / Location   |
| _Cek kas_: counted cash and bank balance against the records, _cocok_ or _selisih_ per location, every check saved | PRD §7.8                          |
| One pooled balance with purpose tags: Kas Utama, amplop, titipan                                                   | `CONTEXT.md` Purpose tag          |
| Dues that vary by member tier (_golongan_), and a "who hasn't paid" view                                           | PRD §7.3                          |
| _Talangan_, receipt optional                                                                                       | PRD §7.4                          |
| _Amplop_ for an occasion; the leftover rolls into Kas Utama                                                        | PRD §7.5                          |
| Public report: one link, no login, read-only                                                                       | PRD §7.9                          |
| Posted transactions are never edited or deleted; a fix is a new entry                                              | `CONTEXT.md` Transaction          |
| Automatic daily backups, downloadable and restorable in the app                                                    | PRD §7.10                         |
| Runs on the community's own server; the project holds no data                                                      | PRD §5, `README.md`               |
| Free forever, no paid tier; open source, AGPL-3.0                                                                  | `README.md` principles 7, licence |
| Needs a technical helper to set up; needs a connection to use                                                      | PRD §3, §7.2; `README.md`         |

**Not yet (young or detail; revisit when durable):** the monthly PDF of the report (added
2026-10-02), the Excel export, the twelve-month dues grid, waiving a _talangan_, per-envelope
participation, the fund's time zone.

**Never** (non-goals, or false): reminders or payment chasing, member accounts or logins, bank sync,
QRIS, accounting journals, analytics dashboards, offline use, several treasurers, a hosted version,
an app-store install, multi-currency.

## 7. Audience and voice

- **Audience:** the accidental treasurer of a group of roughly 5 to 20 people (office units, RT,
  churches, choirs, alumni, family clans, hobby groups), and the technical helper who will set up
  the server.
- **Voice:** calm, warm, precise, a little opinionated; the app's _tenang_. No hype, no urgency, no
  fake scarcity, no testimonial theatre.
- **Address:** impersonal where possible, as in the app; **kamu** where a pronoun is needed. Never
  _Anda_, never mixed.
- **Language:** Indonesian only (ADR-0009), following EYD V and KBBI. Mind _di_ as prefix versus
  preposition (_disimpan_, _di rumah_).
- **Plural address:** _kalian_ for the group as a whole (_server kalian sendiri_), which stays in the
  _kamu_ register.
- **Loanwords** (Indonesian where it is in common use; the app's own words win):

  | Use                                   | Not               |
  | ------------------------------------- | ----------------- |
  | _sumber terbuka_                      | _open source_     |
  | _unduh_                               | _download_        |
  | _tautan_                              | _link_            |
  | _cadangan_                            | _backup_          |
  | _masuk_ (verb)                        | _login_ as a verb |
  | _login_ (noun, as in _tanpa login_)   | _log masuk_       |
  | _server_                              | _peladen_         |
  | _demo_                                | _uji coba_        |
  | _aplikasi_                            | _app_             |
  | _pasang sendiri_, _di server sendiri_ | _self-host_       |

  Terms that stay English carry `lang="en"` in the markup only where a screen reader would
  mispronounce them (_login_, _server_).

### Anti-slop rules

- No em dashes in visible copy or metadata.
- Few "X, not Y" contrasts, never in more than one heading.
- Be wary of three-item lists and three cards in a row.
- No stock closers. No _Tak hanya X, tetapi juga Y_; no _solusi terbaik / terlengkap / nomor satu_;
  no _Yuk, ...!_ openers or exclamation marks; no _Mudah, cepat, dan aman_ triplets; no repeated
  _Dengan Uruni, kamu bisa ..._ frames; no English marketing calques (_level up_, _game changer_);
  no _Buruan!_ or _Terbatas!_.
- Don't repeat in prose what a chip or list beside it already says.
- Curly quotes and apostrophes everywhere.
- A two-tone heading highlights only the hook.

### Formatting

`Rp1.250.000`, _Rp1,2 juta_; `12,5%`; _28 Oktober 2026_; `14.30 WIB`. Numbers and dates from data
are formatted with `Intl` in `id-ID` at build time. A list of three or more takes a comma
before _dan_ (EYD V): _Kas Utama, amplop, dan titipan_. Non-breaking space between a number and its unit
where a break reads badly.

## 8. Calls to action

- **Primary:** **Coba demo**, linking to `demo.uruni.kerti.dev`.
- **Secondary:** **Panduan pemasangan**, linking to the app's `SELF-HOSTING.md`, with _(bahasa
  Inggris)_ beside it because the guide is in English.
- **Caveat under the buttons** (it matches the notice on the demo's own login screen):
  _Tanpa daftar. Datanya rekaan dan siapa pun bisa mengubahnya; demo kembali bersih paling lama
  setiap jam._
- **Fact chips** (text, not links), two by two: _Gratis selamanya_ · _Sumber terbuka_ · _Di server
  sendiri_ · _Berbahasa Indonesia_.
- The closing CTA repeats both buttons and the caveat word for word.
- GitHub and the licence live in the header and footer, never as a competing button.

## 9. Out of scope until an ADR says otherwise

Forms, a waitlist, email capture, analytics, cookies, a contact form, an English version, a dark
theme, a blog, pricing (there is none), and any hosted signup.

## 10. Page structure

Every section has an id, an eyebrow, a heading and a lede. Headings below are working titles; their
wording is drafted with each slice.

1. **Header:** wordmark (scrolls to top), anchors _Cara kerja_ · _Cek kas_ · _Laporan_ · _Server
   sendiri_, GitHub icon. No theme toggle (ADR-0008).
2. **Hero:** eyebrow, H1, subhead, both CTAs, caveat, fact chips, and an illustration that sells
   _cocok_: the counted cash and the bank balance adding up to the recorded balance, with the
   _Cocok_ state from the app. Not a screenshot. 2026-10-28: the illustration opens as the brand's
   vessel (the two account cards, one after the other, each drawing its stream into it); then the
   cards' icon, name and amount travel into the tally's first two rows. Once, about 3.3 s, when it
   scrolls into view; reduced motion shows the tally straight away.
3. **Cara kerja** (`#cara-kerja`): three steps, alternating with demo screenshots: _Catat_, _Cek
   kas_, _Bagikan laporan_.
4. **Kenapa** (`#cek-kas`): the insight from the validated treasurer. The hard part is not chasing
   late payers; it is making the records match the money, which sits in two places.
5. **Yang bukan Uruni:** one ticked chip (_Kas bersama kelompok kecil_) and five struck-through
   non-features (_Pengingat tagihan_, _Akun untuk anggota_, _Sinkron bank dan QRIS_, _Jurnal
   akuntansi_, _Sistem RT_), pairing evenly.
6. **Yang dicatat:** four icon cards: dues by _golongan_, _amplop_, _talangan_, _titipan_.
7. **Bukti** (`#laporan`): the public report, shown from the demo.
8. **Catatan pendiri:** placeholder until the maintainer writes it.
9. **Server sendiri** (`#server-sendiri`): four cards (the community's own server, open source,
   daily backups, nothing deleted) and the honest caveat: setting Uruni up takes someone used to
   running a server.
10. **Tanya jawab:** plain `<details>`. Questions: _Berapa biayanya?_ · _Ada versi yang tinggal
    pakai?_ · _Apa yang dibutuhkan untuk memasangnya?_ · _Siapa yang bisa melihat datanya?_ ·
    _Apakah anggota perlu akun?_ · _Bisa dipakai tanpa internet?_ · _Kalau salah catat?_ · _Kalau
    ponsel hilang?_ · _Cocok untuk RT yang besar?_ · _Bagaimana cara ikut membantu?_
11. **Penutup:** both CTAs and the caveat, word for word.
12. **Footer:** wordmark, the canonical paragraph, links (GitHub, licence, app repo), icon credits.

**Illustrative data** lives in one hand-written module and is set in the demo's world (the
_CS Shift Sore_ office fund), so the hero drawing and the demo screenshots tell one story.
