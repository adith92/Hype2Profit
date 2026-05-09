# Changelog

## [Unreleased]
### Added
- Core persistence foundation migration and service layer scaffold for extension scans, watchlist, and export jobs.
- Extension ingest payload validation with persistence response (`persisted`, `sessionId`, `received`).
- Social Signal Engine scaffold (`packages/social-intelligence`) with deterministic mock data and scoring.
- Social adapters scaffold (`packages/social-adapters`) with mock provider default and xAI/Grok stub.
- Social search API (`POST /api/social/search`) and UI skeleton (`/social/search`).
- Social source selection foundation for scanner and social search: `X`, `Facebook`, `Instagram`, `Threads`, `Gabungan Social`, and `Gabungan Semua`.
- Mock social scenarios for `Fashion + Tas Padel`, `Beauty + Serum`, `Gadget + Case iPhone`, and `Home + Rak Dapur`.
- Core persistence compatibility migration for older Supabase projects that already had the initial `export_jobs` table.

### Changed
- Watchlist and export APIs now use persistence service with Supabase-or-mock fallback.
- Watchlist and export API responses now expose `source` and `warning` so fallback state is visible to the UI/client.
- Scanner now groups sources into `Marketplace`, `Social`, and `Combined`, while keeping marketplace filters and table flow alive.
- Social providers now expose `source`, `status`, and `search(params)` with mock-first behavior for all social channels.
- Social provider env wiring now reads `ENABLE_SOCIAL_SEARCH`, `SOCIAL_SEARCH_PROVIDER`, `XAI_API_KEY`, and `X_BEARER_TOKEN` safely with masked diagnostics only.
- X Recent Search provider now attempts live official API calls when `SOCIAL_SEARCH_PROVIDER=x_api` and falls back to controlled mock summaries on auth, tier, rate limit, or network failure.

### Fixed
- Dependency reinstall flow to recover from corrupted node_modules baseline issues.
- Hardened export job persistence for legacy Supabase schemas missing `metadata`, `file_url`, or `completed_at` columns.
- Extension ingest now reports item insert warnings instead of silently hiding partial persistence failures.

### Known Gaps
- Supabase env required for real persistence writes.
- Social metrics are sampled/estimated mock signals for now, and no real external social APIs are called yet.
- RLS/per-user access hardening is still planned before private beta.
- xAI/Grok provider is still a safe fallback stub until official integration is completed.
- Social metrics remain sampled/estimated, and live X access still depends on env availability plus account tier/permissions.

## [0.1.3] - 2026-05-09
### Added
- Added Vercel deployment config (`apps/web/vercel.json`).
- Added root Vercel CLI config for project `hype2profit`.
- Added deployment guide docs (`docs/DEPLOYMENT.md`).
- Added Node version hints (`.node-version`, `.nvmrc`, package `engines`).
- Added env docs for deployment and optional social provider vars.
- Added production host permission for Chrome extension: `https://hype2profit.vercel.app/*`.

### Changed
- README now includes cheap deployment recommendation and direct link ke panduan deploy.
- Added deployment notes for future contributor/Codex sessions in `docs/DEVELOPER_NOTES.md`.
- Updated Vercel target to Node `20.x`.
- Upgraded Next.js to `16.2.6` and forced webpack build mode to avoid Turbopack build issues in this environment.

### Notes
- Recommended hosting: Vercel Free + Supabase Free.
- Shared hosting/cPanel only if it supports Node.js/Next.js production.
- Production URL: https://hype2profit.vercel.app
- Old temporary Vercel project `web` can be ignored/deleted manually.

## [0.1.1] - 2026-05-09
### Added
- Project memory docs baseline in-repo for future Codex continuation.

## [0.1.0] - 2026-05-08
### Added
- Initial V1 prototype for Hype2Profit web dashboard and Chrome extension.
