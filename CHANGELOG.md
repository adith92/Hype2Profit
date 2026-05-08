# Changelog 📜🚀

Semua perubahan penting Hype2Profit dicatat di sini.

Format mengikuti versi bertahap supaya Codex, ChatGPT, dan developer lain bisa membaca progres proyek tanpa perlu konteks chat lama.

---

## [Unreleased]

### Planned 🔜

- Social Signal Engine / Internal Social Search untuk membaca percakapan publik sosial media berdasarkan kategori + keyword produk.
- Provider abstraction untuk social search: `mock`, `xai_grok`, `x_api`, dan `manual_import`.
- Supabase persistence untuk extension scan, watchlist, dan export jobs.
- Parser harga dan sold count Indonesia untuk Chrome Extension.
- Profit Intelligence melalui CSV supplier cost import dan margin calculator.

### Blocked / Needs Decision ⛔

- Keputusan API provider sosial media utama:
  - Grok / xAI sebagai optional provider.
  - X API sebagai provider langsung jika butuh kontrol query lebih detail.
  - Provider lain untuk TikTok, Instagram, YouTube, atau Google Trends perlu riset legal/API terpisah.

---

## [0.1.1] - 2026-05-08

### Added ✅

- Added `docs/FUTURE_DEVELOPMENT.md` sebagai single source of truth untuk roadmap, status development, dan future ideas.
- Added staged version roadmap dari `v0.1.0` sampai `v1.0.0`.
- Added Social Signal Engine plan untuk fitur internal social search.
- Added recommendation bahwa Grok/xAI dipakai sebagai optional provider, bukan hard dependency.
- Added Codex continuation prompt di future development docs.

### Changed 🛠️

- Roadmap sekarang dipisahkan lebih jelas menjadi:
  - `v0.2.0` Core Persistence
  - `v0.3.0` Extension Reliability
  - `v0.4.0` Social Signal Engine
  - `v0.5.0` Profit Intelligence
  - `v0.6.0` Alerts & Intelligence Brief
  - `v1.0.0` Private Beta / Paid MVP

---

## [0.1.0] - Prototype Core

### Added ✅

- Initial PNPM monorepo.
- Next.js web dashboard.
- Chrome Extension MV3 visible page scanner.
- Shared product and marketplace types.
- Mock marketplace data.
- Marketplace adapters for Shopee, Tokopedia, TikTok Shop placeholder, and extension payloads.
- Scoring engine:
  - Hype Score
  - Profit Score
  - Risk Score
  - Final Signal: `BUY_TEST`, `WATCH`, `AVOID`
- Dashboard pages:
  - Dashboard
  - Scanner
  - Trending
  - Competitors
  - Watchlist
  - Exports
  - Pricing
  - Settings
- API routes for product data and extension ingest prototype.
- Data policy and risk matrix docs.

### Known Gaps 🕳️

- Extension ingest belum persist ke Supabase.
- Watchlist masih prototype/in-memory.
- Export job belum real persisted export.
- Social search belum diimplementasikan.
- Auth/per-user data belum production-ready.
