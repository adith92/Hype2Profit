# FUTURE DEVELOPMENT TRACKER

## Product Direction
Hype2Profit diarahkan sebagai **“TradingView for marketplace product research + social buzz intelligence”** untuk Indonesia, dengan pendekatan safe-data dan visible-DOM-first.

## Status Legend
- DONE
- IN_PROGRESS
- PLANNED
- BLOCKED
- DEFERRED

## Current Snapshot (2026-05-09)
- Marketplace cockpit V1 sudah aktif dengan mock fallback.
- Extension scanner visible-DOM sudah jalan (Shopee/Tokopedia/basic TikTok area).
- Core persistence sudah punya foundation + compatibility hardening untuk session/item ingest, watchlist, dan export job layer.
- Social Signal Engine masih mock-first (provider live belum aktif).
- Deployment readiness untuk Vercel sudah selesai dan production aktif di https://hype2profit.vercel.app.

## v0.1.3 - Deployment Readiness ✅ DONE
- Vercel config: DONE
- Deployment docs: DONE
- Env docs: DONE
- README deploy section: DONE
- Extension production host reminder: DONE
- Deploy production URL live: DONE (`hype2profit`, https://hype2profit.vercel.app)
- Old temporary Vercel project `web`: DEFERRED cleanup (hapus manual di Vercel dashboard kalau sudah tidak dipakai)

## Version Roadmap
- v0.1.0 Prototype Core: DONE
- v0.1.1 Project Memory Docs: DONE
- v0.2.0 Core Persistence: IN_PROGRESS
- v0.3.0 Extension Reliability: IN_PROGRESS
- v0.4.0 Social Signal Engine: IN_PROGRESS
- v0.5.0 Profit Intelligence: PLANNED
- v0.6.0 Alerts & Intelligence Brief: PLANNED
- v1.0.0 Private Beta / Paid MVP: PLANNED

## v0.2.0 Core Persistence Breakdown
- Extension ingest session/item persistence: IN_PROGRESS
- Watchlist persistent storage: IN_PROGRESS
- Export jobs persistence: IN_PROGRESS
- Legacy Supabase schema compatibility migration: DONE
- API fallback visibility (`source`, `warning`): DONE
- Partial persistence warning handling: DONE
- RLS hardening and per-user access model: PLANNED

## v0.4.0 Social Signal Engine Plan
- Social types, scoring, deterministic mock: DONE
- Provider abstraction and provider resolver: DONE
- Mock provider implementation: DONE
- xAI/Grok live integration: PLANNED
- Multi-provider public integrations (X API/manual import): PLANNED
- Social signals UI integration into cockpit widgets: IN_PROGRESS

## Grok/xAI Provider Recommendation
- Keep Grok/xAI optional, never mandatory.
- Only implement after checking official xAI docs and policy constraints.
- Require `XAI_API_KEY` + explicit provider opt-in.
- Maintain mock provider as default for local dev and demos.

## v0.7.0 - Blended Opportunity Score (PLANNED)
Konsep gabungan sinyal marketplace + social:
- 40% marketplace hype score
- 25% profit score
- 20% social hype score
- 10% buyer intent score
- minus risk adjustments (marketplace risk + social controversy/saturation)

## Codex Continuation Prompt
“Continue from docs/FUTURE_DEVELOPMENT.md. Finish v0.2.0 Core Persistence by validating Supabase writes, then plan RLS/per-user access before private beta. Continue v0.4.0 Social Signal Engine only after checking official provider docs. Keep mock provider as default and update CHANGELOG.md.”
