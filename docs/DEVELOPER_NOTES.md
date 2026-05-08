# Hype2Profit Developer Notes 🧑‍💻🧭

> Catatan praktis buat developer, Codex, dan ChatGPT yang lanjut ngerjain repo ini.  
> Untuk roadmap panjang, baca `docs/FUTURE_DEVELOPMENT.md`. Untuk riwayat versi, baca `CHANGELOG.md`.

Last updated: **2026-05-09**

---

## 1. Baca Ini Dulu Sebelum Coding 🚦

Wajib baca:

1. `README.md`
2. `CHANGELOG.md`
3. `docs/FUTURE_DEVELOPMENT.md`
4. `docs/DATA_POLICY.md`
5. `docs/RISK_MATRIX.md`
6. `docs/API_CONTRACT.md`

Tujuannya supaya development tidak keluar jalur dan semua future work tetap tercatat di Git.

---

## 2. Posisi Proyek Saat Ini 📍

Hype2Profit saat ini adalah prototype V1 yang mulai bergerak ke product intelligence cockpit.

Yang sudah ada:

- ✅ PNPM monorepo
- ✅ Next.js web dashboard
- ✅ Chrome Extension MV3
- ✅ Mock marketplace data
- ✅ Marketplace adapters
- ✅ Hype / Profit / Risk scoring engine
- ✅ Product scanner UI
- ✅ Competitor radar UI
- ✅ Trending page
- ✅ Watchlist prototype
- ✅ Export prototype
- ✅ Data policy dan risk docs
- ✅ README lebih rame dan lebih product-friendly

Yang belum matang:

- 🟡 Persistence perlu dites dan diperkuat
- 🟡 Watchlist perlu per-user persistence yang lebih matang
- 🟡 Export job perlu file beneran yang bisa didownload
- 🔜 Social media internal search belum diimplementasikan penuh
- 🔜 Auth / per-user data belum production-ready

---

## 3. Development Rule 🧷

Setiap perubahan besar wajib update:

- `CHANGELOG.md`
- `docs/FUTURE_DEVELOPMENT.md`
- `docs/DEVELOPER_NOTES.md` jika ada catatan teknis baru

Jangan cuma taruh rencana di chat. Semua future development harus masuk Git.

---

## 4. Safety Boundary 🛡️

Hype2Profit harus tetap menjadi research cockpit yang aman.

Jangan tambahkan:

- auto checkout
- auto purchase
- spam request
- buyer personal data collection
- akses private marketplace/social endpoint
- scraping yang melanggar Terms of Service
- dependency wajib ke satu provider social search

Boleh tambahkan:

- official/public API integration jika diizinkan
- visible page scan dari browser extension
- user-owned CSV/manual import
- mock provider untuk development
- provider abstraction untuk Grok/xAI, X API, atau provider lain

---

## 5. Recommended Next Work 🧩

### Step 1 - v0.2.0 Core Persistence

Prioritas berikutnya:

- Pastikan Supabase migration sudah clean
- Pastikan extension scan sessions tersimpan
- Pastikan extension scan items tersimpan
- Pastikan watchlist items tersimpan
- Pastikan export jobs tersimpan
- Update `/api/extension/ingest` agar validasi payload makin rapi
- Keep mock fallback jika Supabase belum aktif

### Step 2 - v0.3.0 Extension Reliability

- Parser harga Indonesia
- Parser sold count
- Confidence score per product card
- Debug panel di extension side panel
- Unit tests untuk parser helper

### Step 3 - v0.4.0 Social Signal Engine

- `packages/social-intelligence`
- `packages/social-adapters`
- mock provider dulu
- optional Grok/xAI provider belakangan
- `/api/social/search`
- `/social/search`

---

## 6. Grok / xAI Notes 🤖📡

Grok/xAI bagus untuk social trend discovery, terutama X/Twitter-style real-time conversation.

Tapi desain produk harus tetap begini:

```txt
Core app -> SocialSearchProvider interface -> provider implementation
```

Jangan bikin core app langsung tergantung Grok.

Provider yang disarankan:

- `mock` sebagai default development
- `xai_grok` sebagai optional provider
- `x_api` sebagai optional direct provider
- `manual_import` untuk CSV/JSON dari riset user sendiri

Env yang disarankan:

```txt
ENABLE_SOCIAL_SEARCH=false
SOCIAL_SEARCH_PROVIDER=mock
XAI_API_KEY=
X_API_KEY=
```

---

## 7. Commands 🧪

Run sebelum PR:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm extension:build
```

Kalau ada command gagal:

1. catat command yang gagal
2. cari root cause
3. fix minimal
4. run ulang command terkait
5. update `CHANGELOG.md` jika meaningful

---

## 8. Codex Prompt Mini 🧠

```txt
Read README.md, CHANGELOG.md, docs/FUTURE_DEVELOPMENT.md, docs/DEVELOPER_NOTES.md, docs/DATA_POLICY.md, and docs/RISK_MATRIX.md.

Continue Hype2Profit development safely.

Priorities:
1. Finish/stabilize v0.2.0 Core Persistence.
2. Add tests for scoring-engine, marketplace-adapters, and extension parsers.
3. Scaffold v0.4.0 Social Signal Engine with mock provider first.
4. Keep Grok/xAI optional, not hard dependency.
5. Update CHANGELOG.md and docs/FUTURE_DEVELOPMENT.md before finishing.
```
