# API Contract

## `GET /api/products`
Mengembalikan seluruh product records dengan trend score dan snapshot terakhir.

## `GET /api/products/trending`
Query optional: `kind=risingFast|highRevenue|lowCompetition|newUploads|watchlistWorthy`

## `GET /api/products/search`
Query:
- `keyword`
- `platform`
- `minPrice`
- `maxPrice`
- `minSales`
- `maxSales`
- `minRating`
- `minStock`
- `maxStock`
- `signal`

## `GET /api/products/:id`
Mengembalikan detail produk tunggal.

## `POST /api/watchlist`
Body JSON:
```json
{ "productId": "prod_001", "notes": "uji kecil di niche Ramadan" }
```

## `DELETE /api/watchlist/:id`
Menghapus produk dari watchlist in-memory prototype.

## `GET /api/stores/analyze`
Query:
- `query`
- `platform`

## `POST /api/exports/csv`
Query optional: `kind=products|trending|competitors|watchlist`

## `POST /api/extension/ingest`
Menerima visible DOM payload dari extension.
