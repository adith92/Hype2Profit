# Hype2Profit Deployment Guide 🚀

## 1. Stack murah yang direkomendasi
- Vercel Free buat web app Next.js
- Supabase Free buat database/persistence
- Domain sendiri tinggal disambung ke Vercel nanti
- Shared hosting/cPanel dipakai kalau perlu DNS/email aja, bukan host utama Next.js

## 2. Setup Vercel via dashboard
1. Login ke Vercel, klik `Add New Project`.
2. Import repo `adith92/Hype2Profit`.
3. Project name: `hype2profit`.
4. Production URL target: `https://hype2profit.vercel.app`.
5. Untuk CLI root deploy, pakai root `vercel.json`:
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm --filter @hype2profit/web build`
- Output Directory: `apps/web/.next`
6. Kalau import dashboard pakai Root Directory `apps/web`, pakai config ini:
- Root Directory: `apps/web`
- Install Command: `cd ../.. && pnpm install --frozen-lockfile && cd apps/web`
- Build Command: `pnpm build`
- Output Directory: `.next`
7. Framework preset: Next.js.

Temporary old project:
- Project Vercel lama bernama `web` bisa diabaikan atau dihapus manual dari dashboard.

Legacy dashboard config:
4. Set config build:
- Install Command: `cd ../.. && pnpm install --frozen-lockfile && cd apps/web`
- Build Command: `pnpm build`
- Output Directory: `.next`
5. Framework preset: Next.js.
Catatan: kalau key `framework` di `vercel.json` ditolak, cukup set Framework Preset lewat dashboard Vercel.

## 3. Environment variables
Isi di Vercel Project Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (nanti ganti ke URL production)
- `EXTENSION_PAIRING_SECRET`
- `ENABLE_MOCK_DATA=true` (boleh true saat awal)
- `ENABLE_SOCIAL_SEARCH=false`
- `SOCIAL_SEARCH_PROVIDER=mock`
- `XAI_API_KEY` (opsional, belum wajib)
- `X_BEARER_TOKEN` (opsional, dipakai hanya kalau `SOCIAL_SEARCH_PROVIDER=x_api`)

Catatan social provider:
- `SOCIAL_SEARCH_PROVIDER=xai_grok` akan baca `XAI_API_KEY`, tapi saat ini tetap fallback aman ke mock summary kalau live synthesis belum aktif penuh.
- `SOCIAL_SEARCH_PROVIDER=x_api` akan coba panggil endpoint official X Recent Search (`GET /2/tweets/search/recent`) pakai `X_BEARER_TOKEN`.
- Kalau auth, tier, rate limit, atau network gagal, endpoint `/api/social/search` tetap balikin result aman dengan `providerStatus=limited_mock`.

## 4. Setup Supabase
1. Bikin project Supabase baru.
2. Jalankan migration SQL dari folder `supabase/migrations`.
3. Isi env Supabase ke Vercel.
4. Kalau belum siap, app tetap jalan pakai fallback `ENABLE_MOCK_DATA=true`.

## 5. Custom domain
1. Tambah domain di Project Settings Vercel.
2. Point DNS ke target Vercel.
3. Update `NEXT_PUBLIC_APP_URL` ke domain production kamu.

## 6. Chrome extension setelah deploy
1. Build ulang extension: `pnpm extension:build`.
2. Production host sudah ditambahkan:
- `"https://hype2profit.vercel.app/*"`
3. Kalau pakai custom domain nanti, tambahkan juga:
- `"https://YOUR-CUSTOM-DOMAIN/*"`
4. Di popup extension, pastikan App URL diarahkan ke domain production.

## 7. Deploy lewat CLI
```bash
pnpm i -g vercel
vercel login
vercel link
vercel deploy
vercel deploy --prod
```

## 8. Troubleshooting
- PNPM workspace error: pastikan command install/build sesuai root monorepo.
- Root directory salah: wajib `apps/web` di Vercel.
- Env belum diisi: API persistence bisa fallback mock tapi fitur DB real tidak aktif.
- Supabase belum ready: jalankan migration dan isi key dulu.
- Playwright test gagal saat CI build: fokus lint/typecheck/build dulu, test browser bisa dipisah job.
- Extension gagal kirim data: cek host permission + App URL extension.

## 9. Final checklist
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm extension:build`
- Deployment Vercel sukses
- URL production kebuka normal
- Extension berhasil kirim payload ke URL production
