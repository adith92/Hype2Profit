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

## [0.1.1] - 2026-05-09
### Added
- Project memory docs baseline in-repo for future Codex continuation.

## [0.1.0] - 2026-05-08
### Added
- Initial V1 prototype for Hype2Profit web dashboard and Chrome extension.
