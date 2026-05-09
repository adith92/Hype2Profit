# Changelog

## [Unreleased]
### Added
- Core persistence foundation migration and service layer scaffold for extension scans, watchlist, and export jobs.
- Extension ingest payload validation with persistence response (`persisted`, `sessionId`, `received`).
- Social Signal Engine scaffold (`packages/social-intelligence`) with deterministic mock data and scoring.
- Social adapters scaffold (`packages/social-adapters`) with mock provider default and xAI/Grok stub.
- Social search API (`POST /api/social/search`) and UI skeleton (`/social/search`).

### Changed
- Watchlist and export APIs now use persistence service with Supabase-or-mock fallback.

### Fixed
- Dependency reinstall flow to recover from corrupted node_modules baseline issues.

### Known Gaps
- Supabase env required for real persistence writes.
- xAI/Grok provider is stub-only until official integration is implemented.
- Social metrics are sampled/estimated mock signals for now.

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
