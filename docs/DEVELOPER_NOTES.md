# Developer Notes

## Deployment Notes 🚀
- Deploy target utama: Vercel project (team/account owner).
- Production URL: `https://hype2profit.vercel.app`.
- Vercel project name: `hype2profit`.
- Temporary old project `web` can be ignored/deleted manually from Vercel dashboard.
- CLI deploy target from repo root uses root `vercel.json`.
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm --filter @hype2profit/web build`
- Output Directory: `apps/web/.next`
- Node target: `20.x`.
- Framework: Next.js (set di Vercel dashboard kalau perlu).
- Env yang wajib untuk persistence real:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`, `EXTENSION_PAIRING_SECRET`.
- Env fallback aman:
`ENABLE_MOCK_DATA=true`.
- Social env opsional:
`ENABLE_SOCIAL_SEARCH`, `SOCIAL_SEARCH_PROVIDER`, `XAI_API_KEY`, `X_API_KEY`.
- Social provider env untuk wiring live/fallback:
`ENABLE_SOCIAL_SEARCH`, `SOCIAL_SEARCH_PROVIDER`, `XAI_API_KEY`, `X_BEARER_TOKEN`.
- `apps/extension/manifest.json` sudah include `https://hype2profit.vercel.app/*` di `host_permissions`.

## Social Search Notes
- Source dropdown sekarang dibagi jadi 3 grup:
`Marketplace` = Shopee, Tokopedia, TikTok Shop
`Social` = X, Instagram, Facebook, Threads
`Combined` = Gabungan Social, Gabungan Semua
- Source social masih mock-first. Jangan tambahin real API call dulu kalau belum ada keputusan resmi soal provider, quota, dan ToS.
- Provider contract sekarang: `source`, `status`, `search(params)`.
- Jangan pernah kirim raw token ke response, docs, tests, atau console. Kalau butuh debug, mask token pakai format `abcdef...1234`.
- Status awal:
`X = mock`
`Instagram = limited/mock`
`Facebook = limited/mock`
`Threads = limited/mock`
`Gabungan Social = all mock social providers`
`Gabungan Semua = mock social summary + mock marketplace context`
- Status wiring live saat ini:
`SOCIAL_SEARCH_PROVIDER=xai_grok` => baca `XAI_API_KEY`, lalu fallback aman ke mock summary kalau provider live belum aktif penuh
`SOCIAL_SEARCH_PROVIDER=x_api` => pakai `X_BEARER_TOKEN` ke endpoint official `GET /2/tweets/search/recent`, lalu fallback aman kalau auth/tier/rate limit/network gagal
- Skenario mock yang harus tetap hidup:
`Fashion + Tas Padel`
`Beauty + Serum`
`Gadget + Case iPhone`
`Home + Rak Dapur`
