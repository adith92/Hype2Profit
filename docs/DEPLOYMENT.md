# Hype2Profit Deployment Guide 🚀

## 1. Stack murah yang direkomendasi
- Vercel Free buat web app Next.js
- Supabase Free buat database/persistence
- Domain sendiri tinggal disambung ke Vercel nanti
- Shared hosting/cPanel dipakai kalau perlu DNS/email aja, bukan host utama Next.js

## 2. Setup Vercel via dashboard
1. Login ke Vercel, klik `Add New Project`.
2. Import repo `adith92/Hype2Profit`.
3. Set `Root Directory` ke `apps/web`.
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
- `X_API_KEY` (opsional)

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
2. Karena domain production belum fix sekarang, nanti update `host_permissions` di manifest:
- `"https://YOUR-VERCEL-DOMAIN.vercel.app/*"`
- `"https://YOUR-CUSTOM-DOMAIN/*"`
3. Di popup extension, pastikan App URL diarahkan ke domain production.

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
