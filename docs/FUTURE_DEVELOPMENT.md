# Hype2Profit Future Development 🧭🚀

> Baca file ini sebelum lanjut coding. Ini papan kendali roadmap supaya Codex, ChatGPT, dan developer berikutnya tahu posisi terakhir proyek.

Last updated: **2026-05-09**

---

## 🎯 Product Direction

Hype2Profit adalah **marketplace + social commerce intelligence cockpit** untuk Indonesia.

Tujuan utamanya:

- 📈 cari produk yang mulai naik di marketplace
- 🔥 baca topik yang mulai ramai di sosial media
- 💬 gabungkan sinyal marketplace + social buzz
- 💰 bantu user menilai peluang profit
- 🛡️ beri risk signal sebelum user ikut tren

---

## ✅ Status Legend

| Status | Arti |
|---|---|
| ✅ DONE | Sudah ada di repo |
| 🟡 IN_PROGRESS | Sudah ada sebagian, butuh finishing |
| 🔜 PLANNED | Masuk roadmap, belum dikerjakan |
| ⛔ BLOCKED | Menunggu API, akun, env, legal review, atau keputusan produk |
| 🧊 DEFERRED | Ditunda supaya scope tetap sehat |

---

## 📍 Current Project Snapshot

| Area | Status | Notes |
|---|---:|---|
| PNPM monorepo | ✅ DONE | Root workspace sudah ada |
| Next.js dashboard | ✅ DONE | Dashboard, scanner, trending, competitors, watchlist, exports |
| Chrome Extension MV3 | ✅ DONE | Scanner halaman aktif, popup, side panel, background worker |
| Mock marketplace data | ✅ DONE | Fallback aman untuk demo/dev |
| Scoring engine | ✅ DONE | Hype score, profit score, risk score, final signal |
| Marketplace adapters | ✅ DONE | Mock Shopee, Tokopedia, TikTok Shop placeholder, extension adapter |
| Core persistence | 🟡 IN_PROGRESS | Supabase fallback sedang dikembangkan |
| Watchlist | 🟡 IN_PROGRESS | Perlu per-user persistence lebih matang |
| CSV export | 🟡 IN_PROGRESS | Prototype export job, perlu downloadable file |
| Auth + per-user data | 🔜 PLANNED | Untuk v0.2.x / v0.3.x |
| Social media internal search | 🔜 PLANNED | Untuk v0.4.x |
| Billing / paid MVP | 🧊 DEFERRED | Setelah core validated |

---

## 🧱 Version Roadmap

### v0.1.0 - Prototype Core ✅ DONE

Fondasi awal produk.

- ✅ Web dashboard
- ✅ Chrome Extension MV3
- ✅ Mock data marketplace
- ✅ Scoring engine
- ✅ Product scanner
- ✅ Competitor radar
- ✅ Trending page
- ✅ Watchlist prototype
- ✅ Export prototype
- ✅ Safety / data policy docs

---

### v0.1.1 - Project Memory Docs ✅ DONE

Tujuan: repo punya catatan arah development yang bisa dibaca AI/dev berikutnya.

- ✅ Add `docs/FUTURE_DEVELOPMENT.md`
- ✅ Add `CHANGELOG.md`
- ✅ Add `docs/DEVELOPER_NOTES.md`
- ✅ Link future development docs dari README
- ✅ Set rule: setiap feature besar wajib update changelog + future development tracker

---

### v0.1.2 - README Personality Pass ✅ DONE 🎨

Tujuan: bikin repo lebih hidup, lebih gampang dipahami, dan lebih enak dibaca.

- ✅ README dibuat lebih gaul dan lebih visual
- ✅ Added badges
- ✅ Added GitHub About suggestion
- ✅ Added product positioning yang lebih tajam
- ✅ Added safety summary
- ✅ Added Social Signal Engine teaser

---

### v0.2.0 - Core Persistence 🟡 IN_PROGRESS

Tujuan: data app tidak hilang setelah server restart.

Tasks:

- 🟡 Persist extension scan session ke Supabase
- 🟡 Persist extension scan items ke Supabase
- 🟡 Persist watchlist items
- 🟡 Persist export jobs
- 🔜 Validate payload `/api/extension/ingest` lebih ketat
- ✅ Keep mock fallback kalau env belum tersedia

Suggested tables:

- `extension_scan_sessions`
- `extension_scan_items`
- `watchlist_items`
- `export_jobs`

---

### v0.3.0 - Extension Reliability 🔜 PLANNED

Tujuan: hasil scan dari halaman marketplace lebih rapi dan bisa dipercaya.

Tasks:

- 🔜 Parser harga Indonesia
- 🔜 Parser sold count Indonesia/English
- 🔜 Confidence score per product card
- 🔜 Debug panel di extension side panel
- 🔜 Selector fallback per marketplace
- 🔜 Unit test parser helpers

---

### v0.4.0 - Social Signal Engine 🔜 PLANNED 🔥📡

Tujuan: user bisa mencari percakapan publik sosial media berdasarkan kategori dan keyword produk.

Example flow:

```txt
Category: Fashion
Keyword: Tas Padel
Question: Sekarang di sosmed apa yang lagi dibicarakan tentang Tas Padel?
```

Expected output:

- 💬 Ringkasan percakapan publik
- 📈 Mention trend
- 🧠 Sentiment / buyer intent signal
- 🏷️ Hashtag dan keyword terkait
- 👥 Creator / akun publik yang relevan
- 🛒 Marketplace fit
- 🔥 SocialHypeScore
- ⚠️ Risk signal: spam, kontroversi, saturasi, atau hype palsu

Recommended architecture:

```ts
interface SocialSearchProvider {
  provider: "mock" | "xai_grok" | "x_api" | "manual_import";
  searchPublicConversation(params: SocialSearchParams): Promise<SocialSearchResult>;
}
```

Provider strategy:

- `mock`: default development provider
- `xai_grok`: optional provider untuk X / real-time search
- `x_api`: optional direct X API provider
- `manual_import`: CSV/JSON dari riset user sendiri

Env suggestion:

```txt
ENABLE_SOCIAL_SEARCH=false
SOCIAL_SEARCH_PROVIDER=mock
XAI_API_KEY=
X_API_KEY=
```

Suggested packages:

- `packages/social-intelligence`
- `packages/social-adapters`

Suggested routes/pages:

- `/social`
- `/social/search`
- `/social/trends`
- `/api/social/search`

Acceptance criteria:

- App tetap jalan dengan provider `mock` tanpa API key.
- Kalau `XAI_API_KEY` tersedia, app bisa pakai provider Grok/xAI.
- User bisa cari kategori + keyword, misalnya `Fashion` + `Tas Padel`.
- Output diberi label estimasi / sample-based, bukan angka absolut.

---

### v0.5.0 - Profit Intelligence 🔜 PLANNED 💰

Tujuan: dari hype menjadi keputusan jualan.

Tasks:

- 🔜 CSV import supplier cost
- 🔜 Margin calculator
- 🔜 Marketplace fee simulation
- 🔜 Shipping / packaging assumption
- 🔜 Product opportunity ranking
- 🔜 Watchlist priority berdasarkan expected profit

---

### v0.6.0 - Alerts & Intelligence Brief 🔜 PLANNED 🛰️

Tujuan: user tidak perlu cek dashboard terus.

Tasks:

- 🔜 Saved scans
- 🔜 Watchlist movement alert
- 🔜 Category watch alert
- 🔜 Social keyword alert
- 🔜 Weekly intelligence brief

---

### v1.0.0 - Private Beta / Paid MVP 🧊 DEFERRED

Candidate features:

- Auth production-ready
- Workspace/team
- Billing
- Usage limits
- Export history
- Social + marketplace blended scoring
- Onboarding flow

---

## 🤖 Codex Continuation Prompt

```txt
You are working on Hype2Profit.

Before coding, read:
1. README.md
2. CHANGELOG.md
3. docs/FUTURE_DEVELOPMENT.md
4. docs/DEVELOPER_NOTES.md
5. docs/DATA_POLICY.md
6. docs/RISK_MATRIX.md

Rules:
- Update docs/FUTURE_DEVELOPMENT.md when adding, finishing, blocking, or deferring roadmap items.
- Update CHANGELOG.md for every meaningful product or architecture change.
- Keep mock fallback available.
- Prefer provider interfaces instead of hardcoding one vendor.
- Respect platform Terms of Service and the project data policy.

When done:
- Mark completed tasks as DONE.
- Move new ideas to PLANNED, BLOCKED, or DEFERRED.
- Add acceptance criteria for new roadmap items.
```
