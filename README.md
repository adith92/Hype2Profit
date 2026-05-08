# Hype2Profit

Hype2Profit itu **TradingView buat riset produk marketplace Indonesia**.  
Fokus V1 kita sengaja tajam: Shopee dulu, Tokopedia nyusul, extension scanner dari DOM yang kelihatan, dashboard visual premium, watchlist, competitor radar, dan export CSV.

## Isi Repo
- `apps/web` = dashboard + API
- `apps/extension` = Chrome Extension (Manifest V3)
- `packages/shared` = types + mock data
- `packages/scoring-engine` = logic score + candle momentum
- `packages/marketplace-adapters` = adapter mock + adapter extension
- `supabase` = migration + seed
- `docs` = PRD, phase, contract API, policy, risk

## Quick Start
1. Install dependency:
   `pnpm install`
2. Copy `.env.example` jadi `.env.local` (root atau `apps/web`).
3. Nyalain web:
   `pnpm dev`
4. Nyalain extension mode dev:
   `pnpm extension:dev`
5. Build extension unpacked:
   `pnpm extension:build`

Kalau Supabase belum aktif, tenang, app tetap jalan pakai mock data.

## Setup Supabase (Opsional buat awal)
1. Bikin project Supabase.
2. Run SQL ini dulu: [20260507_init.sql](/Users/adith92/Documents/Codex/hype2profit/supabase/migrations/20260507_init.sql:1)
3. Lalu seed awal: [seed.sql](/Users/adith92/Documents/Codex/hype2profit/supabase/seed.sql:1)
4. Isi env:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Command yang Kepake
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm seed`
- `pnpm extension:dev`
- `pnpm extension:build`

## Route V1
- `/`
- `/dashboard`
- `/scanner`
- `/competitors`
- `/trending`
- `/watchlist`
- `/exports`
- `/pricing`
- `/settings`

## Cara Kerja Extension
- Popup baca marketplace yang lagi kebuka.
- Content script ambil kartu produk yang **kelihatan di layar user**.
- Background kirim payload ke `/api/extension/ingest`.
- Tidak bypass login/captcha/private API.
- Detail load unpacked ada di [apps/extension/README.md](/Users/adith92/Documents/Codex/hype2profit/apps/extension/README.md:1).

## Scope V1
- Shopee = utama
- Tokopedia = secondary
- TikTok Shop = placeholder (belum analytics penuh)
- Belum ada payment, social radar, atau crawler backend agresif

## Safety First
- Scanner hanya dari visible DOM
- Tidak ambil data personal buyer
- Tidak auto checkout
- Tidak spam request
- Semua angka sales/revenue/views/signal di V1 = estimasi

## Deploy
- Web siap deploy ke Vercel
- Extension install sebagai unpacked dari `apps/extension` setelah `pnpm extension:build`

## Baca Sebelum Lanjut Development
- [CHANGELOG.md](/Users/adith92/Documents/Codex/hype2profit/CHANGELOG.md)
- [docs/FUTURE_DEVELOPMENT.md](/Users/adith92/Documents/Codex/hype2profit/docs/FUTURE_DEVELOPMENT.md)
- [docs/DATA_POLICY.md](/Users/adith92/Documents/Codex/hype2profit/docs/DATA_POLICY.md)
- [docs/RISK_MATRIX.md](/Users/adith92/Documents/Codex/hype2profit/docs/RISK_MATRIX.md)
