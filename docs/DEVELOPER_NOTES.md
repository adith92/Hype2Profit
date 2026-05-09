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
- `apps/extension/manifest.json` sudah include `https://hype2profit.vercel.app/*` di `host_permissions`.

## Social Search Notes
- Source dropdown sekarang dibagi jadi 3 grup:
`Marketplace` = Shopee, Tokopedia, TikTok Shop
`Social` = X, Instagram, Facebook, Threads
`Combined` = Gabungan Social, Gabungan Semua
- Source social masih mock-first. Jangan tambahin real API call dulu kalau belum ada keputusan resmi soal provider, quota, dan ToS.
- Provider contract sekarang: `source`, `status`, `search(params)`.
- Status awal:
`X = mock`
`Instagram = limited/mock`
`Facebook = limited/mock`
`Threads = limited/mock`
`Gabungan Social = all mock social providers`
`Gabungan Semua = mock social summary + mock marketplace context`
- Skenario mock yang harus tetap hidup:
`Fashion + Tas Padel`
`Beauty + Serum`
`Gadget + Case iPhone`
`Home + Rak Dapur`
