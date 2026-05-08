# 🚀 Hype2Profit

> **TradingView buat riset produk marketplace Indonesia** 🇮🇩📈  
> Cari produk yang lagi naik, baca momentum pasar, pantau kompetitor, masukin watchlist, lalu ubah hype jadi peluang profit. 🔥💰

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111)
![PNPM](https://img.shields.io/badge/PNPM-Monorepo-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-MV3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)

---

## 🧨 Ini Apaan Sih?

**Hype2Profit** itu cockpit buat seller, dropshipper, product researcher, dan trend hunter yang pengen tahu:

- 🔥 produk apa yang mulai rame
- 📊 kategori mana yang momentum-nya naik
- 🧲 kompetitor mana yang patut dipantau
- 💰 mana yang kelihatan cuan
- ⚠️ mana yang hype doang tapi risk-nya tinggi
- 📡 nanti: apa yang lagi dibahas di sosial media

Bayangin vibe-nya: **marketplace research + trading dashboard + social trend radar**.  
Bukan cuma “lihat produk laku”, tapi **nangkep sinyal sebelum pasar keburu penuh**. 🕵️‍♂️⚡

---

## 🧠 GitHub About / Description

Kalau mau isi bagian **About** repo GitHub, pakai ini:

```txt
Marketplace + social commerce intelligence cockpit for Indonesia. Track product hype, competitor moves, watchlists, extension scans, and future social trend signals. 🚀📈💰
```

Suggested topics:

```txt
marketplace-research, ecommerce, shopee, tokopedia, tiktok-shop, social-commerce, product-research, trend-analysis, nextjs, chrome-extension, supabase, typescript
```

---

## 🗂️ Isi Repo

```txt
apps/web                    🌐 Dashboard + API routes
apps/extension              🧩 Chrome Extension MV3
packages/shared             📦 Types + mock data
packages/scoring-engine     🧠 Hype / Profit / Risk scoring
packages/marketplace-adapters 🛒 Adapter marketplace + extension payload
supabase                    🗄️ Migration + seed
scripts                     🛠️ Helper scripts
docs                        📚 PRD, policy, roadmap, developer notes
```

---

## 🚦 Baca Dulu Sebelum Lanjut Development

Kalau kamu **Codex**, **ChatGPT**, atau dev baru yang masuk repo ini, jangan langsung ngoding membabi buta ya 😄  
Baca ini dulu biar nggak nyasar:

- [`CHANGELOG.md`](./CHANGELOG.md) 📜 catatan versi bertahap
- [`docs/FUTURE_DEVELOPMENT.md`](./docs/FUTURE_DEVELOPMENT.md) 🧭 roadmap hidup + status fitur
- [`docs/DEVELOPER_NOTES.md`](./docs/DEVELOPER_NOTES.md) 🧑‍💻 catatan teknis buat lanjut development
- [`docs/DATA_POLICY.md`](./docs/DATA_POLICY.md) 🛡️ batasan data + safety
- [`docs/RISK_MATRIX.md`](./docs/RISK_MATRIX.md) ⚠️ risiko produk + mitigasi

Rule simpelnya:

> **Setiap future development wajib masuk Git. Jangan cuma tinggal di chat.** 🧷

---

## ✨ Fitur yang Udah Ada

| Area | Status | Keterangan |
|---|---:|---|
| Dashboard marketplace | ✅ | KPI, chart, trending products |
| Product scanner | ✅ | Scan produk dari mock/adapter |
| Competitor radar | ✅ | Pantau toko/kompetitor |
| Watchlist | 🟡 | Prototype, perlu persistence |
| Export | 🟡 | Prototype export job |
| Chrome Extension | ✅ | Visible page scanner |
| Scoring engine | ✅ | HypeScore, ProfitScore, RiskScore |
| Supabase | 🟡 | Migration ada, persistence lanjut dikembangin |
| Social Signal Engine | 🔜 | Planned, provider mock + optional Grok/xAI |

---

## 🧪 Scoring Signal

Hype2Profit pakai beberapa sinyal:

- 🔥 **Hype Score**: momentum views/sales/rating/freshness
- 💰 **Profit Score**: spread harga, margin estimasi, konsistensi sales
- ⚠️ **Risk Score**: rating rendah, kompetisi padat, price war, spike aneh
- 🚦 **Final Signal**:
  - `BUY_TEST` 🚀
  - `WATCH` 👀
  - `AVOID` 🧊

Semua angka V1 masih **estimasi / research signal**, bukan kitab suci profit. 📜✨

---

## 🧩 Cara Kerja Chrome Extension

Extension ini **bukan bot checkout** dan **bukan scraper brutal**.  
Flow-nya santai tapi berguna:

```txt
User buka marketplace
        ↓
Extension baca kartu produk yang terlihat di halaman
        ↓
Popup / side panel nampilin hasil scan
        ↓
Payload dikirim ke /api/extension/ingest
        ↓
Dashboard bisa olah jadi insight
```

Safety boundary:

- ✅ visible page data only
- ✅ user-triggered scan
- ✅ mock fallback aman
- ❌ no auto checkout
- ❌ no private API abuse
- ❌ no buyer personal data collection

---

## 🔥 Future Direction

Roadmap besarnya:

```txt
v0.2.x  Core Persistence 🗄️
v0.3.x  Extension Reliability 🧩
v0.4.x  Social Signal Engine 📡
v0.5.x  Profit Intelligence 💰
v0.6.x  Alerts & Intelligence Brief 🛰️
v1.0.0  Private Beta / Paid MVP 👑
```

Yang paling seksi berikutnya: **Social Media Internal Search** 📡🔥

Contoh:

```txt
Kategori: Fashion
Keyword: Tas Padel
Pertanyaan: Sekarang di sosmed lagi ngomongin apa soal Tas Padel?
```

Output yang dituju:

- 💬 ringkasan percakapan publik
- 📈 mention trend
- 🧠 sentiment / buyer intent
- 🏷️ hashtag terkait
- 👥 creator/akun publik relevan
- 🛒 marketplace fit
- 🔥 SocialHypeScore
- ⚠️ risk signal

Grok/xAI boleh dipakai, tapi **optional provider**, bukan pondasi tunggal. Core app harus tetap punya provider layer. 🧠🔌

---

## ⚡ Quick Start

```bash
pnpm install
pnpm dev
```

Build semua package:

```bash
pnpm build
```

Typecheck:

```bash
pnpm typecheck
```

Test:

```bash
pnpm test
```

Extension dev mode:

```bash
pnpm extension:dev
```

Build extension:

```bash
pnpm extension:build
```

---

## 🗄️ Setup Supabase

Kalau Supabase belum aktif, app tetap bisa jalan pakai mock data. Jadi aman buat demo/dev. 🧃

Env yang umum dipakai:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Run migration dari folder:

```txt
supabase/migrations
```

---

## 🛣️ Route V1

```txt
/              🏠 Landing
/dashboard     📊 Main cockpit
/scanner       🔎 Product scanner
/competitors   🥷 Competitor radar
/trending      🔥 Trending products
/watchlist     👀 Watchlist
/exports       📤 Export jobs
/pricing       💳 Pricing placeholder
/settings      ⚙️ Settings
```

---

## 🧑‍💻 Developer Flow

Sebelum bikin PR:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm extension:build
```

Kalau nambah fitur besar:

```txt
1. Update CHANGELOG.md
2. Update docs/FUTURE_DEVELOPMENT.md
3. Update docs/DEVELOPER_NOTES.md kalau ada catatan teknis baru
4. Pastikan mock fallback tetap jalan
5. Jangan keluar dari DATA_POLICY.md
```

---

## 🛡️ Data Policy Singkat

Hype2Profit adalah **research cockpit**, bukan mesin abuse marketplace.

Prinsipnya:

- ✅ pakai official/public API kalau tersedia dan diizinkan
- ✅ extension baca data yang terlihat oleh user
- ✅ CSV/manual import untuk data milik user
- ✅ semua angka diberi label estimasi
- ❌ jangan ambil data personal pembeli
- ❌ jangan bypass login/captcha/rate limit
- ❌ jangan auto checkout/purchase

---

## 🧃 Status Singkat

```txt
Prototype core     ✅ jalan
Docs memory        ✅ wajib dijaga
Persistence        🟡 lanjutkan
Extension parser   🔜 planned
Social search      🔜 planned
Profit engine      🔜 planned
```

---

## 🦾 Motto

> **Cari hype-nya, hitung cuan-nya, cek risk-nya, baru gas.** 🚀💰⚠️
