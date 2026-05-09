# 🤖 ChatGPT / Codex Handoff Notes

Baca dokumen ini sebelum lanjut development **Hype2Profit**. Tujuannya supaya AI agent berikutnya paham konteks owner, gaya kerja, dan arah produk. 🧭✨

## 👤 Owner Preference

Owner repo: **Adithya**.

Gaya komunikasi yang disukai:

- 🇮🇩 Bahasa Indonesia santai, jelas, dan langsung ke inti.
- ⚡ Action-first. Kalau instruksi sudah jelas, lanjut beberapa step tanpa terlalu banyak tanya.
- 🧩 Step kecil, aman, dan ada validasi setelah perubahan penting.
- ✨ Emoji boleh banyak selama tetap rapi dan informatif.
- 🚀 Owner suka hasil yang terasa final, bukan demo setengah matang.
- 🧯 Kalau ada bug production, prioritaskan recovery dulu sebelum fitur baru.

## 🦾 OpenClaw Working Rule

Untuk setup/debugging lokal, user ingin **OpenClaw** yang menjalankan pekerjaan teknis.

Jika perlu command shell:

- Tulis sebagai instruksi untuk OpenClaw.
- Jangan menyuruh user menjalankan command manual sendiri.
- Minta OpenClaw baca file, backup file, ubah file, lalu validasi.
- Setelah instruksi, minta user kirim balik output OpenClaw.

## 🔐 Safety Rule

Jangan commit credential atau nilai env asli ke repo. Pakai nama variabel saja dan arahkan konfigurasi ke dashboard Vercel/Supabase. 🔒

## 🎯 Product Direction

Hype2Profit diarahkan sebagai:

> **TradingView for marketplace product research + social buzz intelligence untuk seller Indonesia.** 📈🛒🧠

Nilai utama:

- Temukan hype sebelum viral 🔥
- Hitung profit sebelum stok 💸
- Hindari rugi sebelum checkout 🧯
- Baca kompetitor seperti radar 🛰️
- Pakai extension visible-DOM-first agar aman 🛡️

## 🟢 Runtime Mode

App punya runtime status eksplisit:

- 🟢 **Live mode**: production persistence siap dan mock data dimatikan.
- 🟡 **Demo mode**: mock fallback aktif.
- 🔴 **Setup required**: final mode diminta tapi konfigurasi production belum lengkap.

File terkait:

- `apps/web/lib/runtime-status.ts`
- `apps/web/components/layout/extension-status-badge.tsx`

Jangan tampilkan seolah final kalau backend production belum benar-benar siap.

## 🗄️ Persistence Status

Core persistence sudah punya foundation:

- Extension scan session/item persistence
- Watchlist persistence
- Export job persistence
- Supabase-or-mock fallback
- Legacy schema compatibility migration
- API response dengan `source` dan `warning`

Migration penting:

- `supabase/migrations/20260507_init.sql`
- `supabase/migrations/20260509_core_persistence.sql`
- `supabase/migrations/20260509_core_persistence_compat.sql`

Sisa penting sebelum private beta:

- Validasi live write/read di production
- RLS/per-user access model
- Auth model
- UI diagnostics ketika fallback aktif

## 🧠 Social Signal Engine

Social Signal Engine masih mock-first. Jangan implement provider live tanpa cek dokumentasi resmi terbaru. Default aman tetap mock provider.

## ☁️ Vercel Notes

Production target:

- Project: `hype2profit`
- URL: `https://hype2profit.vercel.app`
- Branch production: `main`

Kalau muncul `DEPLOYMENT_NOT_FOUND`, cek dulu apakah user membuka URL deployment preview lama.

## 📚 Read Before Coding

1. `README.md`
2. `CHANGELOG.md`
3. `docs/FUTURE_DEVELOPMENT.md`
4. `docs/DEVELOPER_NOTES.md`
5. `docs/DEPLOYMENT.md`
6. `docs/DATA_POLICY.md`
7. `docs/RISK_MATRIX.md`

## ✅ Suggested Next Steps

1. Pastikan env production di Vercel lengkap.
2. Jalankan Supabase migration di project production.
3. Matikan mock data untuk final mode.
4. Validasi API production.
5. Tambah UI diagnostics untuk runtime status.
6. Plan RLS/auth sebelum private beta.

Bantu Adithya seperti operator teknis yang gesit: jelas, hangat, step-by-step, dan langsung kerja. 🛠️🚀
