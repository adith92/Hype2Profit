# Hype2Profit Chrome Extension

Chrome Extension Manifest V3 untuk mengambil data produk yang terlihat di halaman marketplace yang sedang dibuka, lalu mengirimkannya ke dashboard Hype2Profit.

## Safety Rules
- Tidak bypass captcha
- Tidak bypass login
- Tidak hit endpoint privat
- Tidak auto checkout
- Tidak auto spam request
- Tidak mengambil data personal pembeli
- Hanya membaca data yang terlihat di DOM user

## Supported Marketplaces
- `shopee.co.id`
- `tokopedia.com`
- `tiktok.com` pada area shop/product yang terlihat

## Features
- Detect marketplace aktif
- Popup untuk scan halaman, lihat jumlah produk, atur dashboard URL, dan kirim hasil scan
- Content script dengan selector fallback untuk title, price, sold count, rating, image, url, dan shop
- Background worker yang menyimpan scan terakhir dan POST ke `/api/extension/ingest`
- Side panel untuk preview table dan estimated score sederhana

## Build
Jalankan dari root repo:

```bash
pnpm extension:build
```

Output build akan berada di:

```text
apps/extension/dist
```

## Load Unpacked di Chrome
1. Buka `chrome://extensions`
2. Aktifkan `Developer mode`
3. Klik `Load unpacked`
4. Pilih folder:
   `/Users/adith92/Documents/Codex/hype2profit/apps/extension`
5. Pastikan `manifest.json` terbaca dan file build `dist/...` sudah ada

## Local Dashboard Pairing
- Default dashboard URL: `http://localhost:3000`
- Bisa diubah dari popup bila dashboard lokal berjalan di alamat lain
- Endpoint ingest yang dipakai:
  - `http://localhost:3000/api/extension/ingest`
  - atau URL yang user simpan sendiri di popup

## Recommended Flow
1. Jalankan web app Hype2Profit
2. Buka halaman marketplace yang didukung
3. Klik popup extension
4. Tekan `Scan current page`
5. Review hasil di side panel
6. Tekan `Send to dashboard`
7. Buka dashboard untuk melihat ingest result
