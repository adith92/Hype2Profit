# Developer Notes

## Deployment Notes 🚀
- Deploy target utama: Vercel project (team/account owner).
- Root Directory wajib: `apps/web`.
- Install Command:
`cd ../.. && pnpm install --frozen-lockfile && cd apps/web`
- Build Command:
`pnpm build`
- Output Directory:
`.next`
- Framework: Next.js (set di Vercel dashboard kalau perlu).
- Env yang wajib untuk persistence real:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`, `EXTENSION_PAIRING_SECRET`.
- Env fallback aman:
`ENABLE_MOCK_DATA=true`.
- Social env opsional:
`ENABLE_SOCIAL_SEARCH`, `SOCIAL_SEARCH_PROVIDER`, `XAI_API_KEY`, `X_API_KEY`.
- Setelah domain production fix, update `apps/extension/manifest.json` bagian `host_permissions` biar extension bisa kirim ke URL production.
