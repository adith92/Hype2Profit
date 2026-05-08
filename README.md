# Hype2Profit

Hype2Profit adalah prototype V1 untuk "TradingView for Marketplace Product Research Indonesia". Fokus Phase 1 sengaja sempit: Shopee dulu, Tokopedia kedua, visible DOM Chrome Extension, dashboard premium, competitor radar, watchlist, dan CSV export.

## Structure
- `apps/web`: web dashboard dan API routes
- `apps/extension`: unpacked Chrome extension
- `packages/shared`: types dan mock dataset
- `packages/scoring-engine`: formula scoring dan candle builder
- `packages/marketplace-adapters`: mock adapters + extension adapter
- `supabase`: migration SQL dan seed
- `docs`: PRD, roadmap, API contract, data policy

## Setup
1. Install dependencies:
   `pnpm install`
2. Copy `.env.example` menjadi `.env.local` di `apps/web` atau root, lalu isi env Supabase bila tersedia.
3. Jalankan web:
   `pnpm dev`
4. Jalankan extension watcher:
   `pnpm extension:dev`
5. Build extension unpacked:
   `pnpm extension:build`

## Supabase
1. Buat project Supabase.
2. Jalankan SQL dari [20260507_init.sql](/Users/adith92/Documents/Codex/hype2profit/supabase/migrations/20260507_init.sql:1).
3. Jalankan SQL dari [seed.sql](/Users/adith92/Documents/Codex/hype2profit/supabase/seed.sql:1) bila ingin seed manual awal.
4. Isi:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

Jika env belum ada, app akan tetap hidup dengan mock data.

## Commands
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm seed`
- `pnpm extension:dev`
- `pnpm extension:build`

## Routes
- `/`
- `/dashboard`
- `/scanner`
- `/competitors`
- `/trending`
- `/watchlist`
- `/exports`
- `/pricing`
- `/settings`

## Extension Flow
- Popup mendeteksi marketplace aktif.
- Content script membaca kartu produk yang terlihat di DOM user.
- Background worker mengirim payload ke `/api/extension/ingest`.
- Tidak ada bypass login, captcha, atau endpoint privat.
- Panduan load unpacked detail ada di [apps/extension/README.md](/Users/adith92/Documents/Codex/hype2profit/apps/extension/README.md:1).

## Phase 1 Strategy
- Shopee = primary platform
- Tokopedia = secondary platform
- TikTok Shop = placeholder only, not deep analytics
- No backend scraper farm
- No payment
- No social radar
- No creator matching

## Safety
- Visible DOM scanner only
- No private API
- No personal buyer data
- No checkout automation
- Semua angka sales, revenue, views, dan risk signal pada V1 adalah estimasi

## Deploy
- Web app siap dibuild ke Vercel.
- Extension dipasang sebagai unpacked extension dari folder `apps/extension` setelah `pnpm extension:build`.
