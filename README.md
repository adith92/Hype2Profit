# 🚀 Hype2Profit

**Hype2Profit** adalah **TradingView buat riset produk marketplace Indonesia**.  
Fokusnya: baca momentum produk, peluang profit, risiko, kompetitor, dan sinyal social buzz sebelum seller lain ramai-ramai masuk. 📈🛒⚡

> Temukan hype sebelum viral. Hitung profit sebelum stok. Hindari rugi sebelum checkout. 🧠💸

## 🧭 Status Production

- 🌐 Web production: https://hype2profit.vercel.app
- ☁️ Hosting utama: Vercel
- 🗄️ Persistence: Supabase
- 🧩 Extension: Chrome Extension Manifest V3
- 🧪 Demo fallback: tersedia untuk development
- 🎯 Final target: Supabase env lengkap + mock data dimatikan

## 🟢 Runtime Badge

Sidebar badge sekarang punya 3 status:

| Badge | Arti |
|---|---|
| 🟢 Live mode | Supabase siap dan mock data mati |
| 🟡 Demo mode | App jalan pakai data demo/mock |
| 🔴 Setup required | Final mode diminta, tapi konfigurasi production belum lengkap |

Kalau masih tampil **Demo mode** atau **Setup required**, itu bukan error deploy. Artinya konfigurasi final production belum lengkap. 🧯

## 🧰 Isi Repo

- 🖥️ `apps/web` = dashboard + API Next.js
- 🧩 `apps/extension` = Chrome Extension Manifest V3
- 🧬 `packages/shared` = types + mock data
- 📊 `packages/scoring-engine` = scoring + candle momentum
- 🛍️ `packages/marketplace-adapters` = adapter marketplace
- 🧠 `packages/social-intelligence` = social scoring mock-first
- 🔌 `packages/social-adapters` = provider social mock + stub live provider
- 🗄️ `supabase` = migration + seed
- 📚 `docs` = deployment, policy, roadmap, handoff notes

## ⚡ Quick Start Dev

```bash
pnpm install
pnpm dev
pnpm extension:build
```

Kalau Supabase belum aktif, app tetap bisa jalan pakai data demo. Cocok buat UI work, tapi belum final live-data. 🧪

## 🟢 Final Mode Checklist

Untuk versi final production:

1. Buat project Supabase.
2. Jalankan semua migration di [`supabase/migrations`](./supabase/migrations).
3. Isi environment variables production di Vercel.
4. Matikan mock data di production.
5. Redeploy Vercel.
6. Pastikan badge berubah ke **Live mode**. ✅

Detail deploy lengkap ada di [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md). 📘

## 🛣️ Route V1

- 🏠 `/`
- 📊 `/dashboard`
- 🔎 `/scanner`
- 🛰️ `/competitors`
- 🔥 `/trending`
- ⭐ `/watchlist`
- 📤 `/exports`
- 💳 `/pricing`
- ⚙️ `/settings`
- 🧠 `/social/search`

## 🧩 Cara Kerja Extension

- Popup baca marketplace yang sedang dibuka user.
- Content script mengambil kartu produk yang terlihat di layar user.
- Background mengirim payload ke `/api/extension/ingest`.
- Tidak bypass login/captcha/private API.
- Tidak ambil data personal buyer.

Detail extension: [`apps/extension/README.md`](./apps/extension/README.md). 🧩

## 🎯 Scope V1

- 🛍️ Shopee utama
- 🛒 Tokopedia secondary
- 🎥 TikTok Shop placeholder/basic area
- 📊 Dashboard product momentum
- 🛰️ Competitor radar
- ⭐ Watchlist
- 📤 CSV export
- 🧠 Social Signal Engine masih mock-first

## 🛡️ Safety First

- ✅ Visible-DOM-first
- ✅ Tidak ambil data personal buyer
- ✅ Tidak auto checkout
- ✅ Tidak spam request
- ✅ Semua angka sales/revenue/views/signal di V1 adalah estimasi riset
- ✅ Mock provider tetap default sampai provider live dicek resmi

## 🚀 Deploy Murah

- ☁️ Vercel Free untuk web app
- 🗄️ Supabase Free untuk DB/persistence
- 🌐 Custom domain bisa disambung nanti
- 🧯 Project Vercel lama bernama `web` boleh diabaikan atau dihapus manual

Panduan lengkap: [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md). 📘

## 🤖 Catatan Untuk ChatGPT/Codex Berikutnya

Baca ini sebelum lanjut development:

- 🧭 [`docs/CHATGPT_HANDOFF.md`](./docs/CHATGPT_HANDOFF.md)
- 🧾 [`docs/DEVELOPER_NOTES.md`](./docs/DEVELOPER_NOTES.md)
- 🗺️ [`docs/FUTURE_DEVELOPMENT.md`](./docs/FUTURE_DEVELOPMENT.md)
- 📝 [`CHANGELOG.md`](./CHANGELOG.md)

Ringkasnya: owner repo suka Bahasa Indonesia santai, action-first, step kecil, banyak emoji yang tetap rapi, dan hasil yang terasa final bukan demo setengah matang. ✨

## 🧪 Command yang Sering Kepake

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm seed
pnpm extension:dev
pnpm extension:build
```
