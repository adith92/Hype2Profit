import { formatDate } from "./utils";
import { analyzeStore, getProductRecords, getWatchlistRecords } from "./mock-service";

export async function buildProductCsv(kind: "products" | "trending" | "watchlist" | "competitors" = "products") {
  const rankedRecords = [...getProductRecords("all")].sort((a, b) => b.trend.finalScore - a.trend.finalScore);
  const records =
    kind === "trending"
      ? rankedRecords
      : kind === "watchlist"
        ? getWatchlistRecords()
        : kind === "competitors"
          ? (await analyzeStore("store_001", "shopee")).topProducts.map((item) => ({
              ...item,
              trend: {
                hypeScore: item.score,
                profitScore: item.score - 8,
                riskScore: 32,
                finalScore: item.score,
                signal: "WATCH" as const,
                reasons: [],
                id: `${item.id}_csv`,
                productId: item.id,
                calculatedAt: new Date().toISOString()
              },
              latestSnapshot: {
                id: `${item.id}_snapshot`,
                productId: item.id,
                searchKeyword: "competitor",
                price: item.price,
                rating: item.rating,
                reviewCount: item.reviewCount,
                soldCount: item.soldCount,
                stockCount: item.stockCount,
                viewsEstimate: 0,
                revenueEstimate: item.estimatedRevenue,
                rankPosition: item.rank,
                capturedAt: new Date().toISOString()
              }
            }))
          : getProductRecords("all");
  const rows = records.slice(0, 40).map((record) => ({
    platform: record.platform,
    title: record.title,
    url: record.url,
    category: record.category,
    price: record.price,
    sold_count: record.soldCount,
    revenue_estimate: record.latestSnapshot.revenueEstimate,
    rating: record.rating,
    review_count: record.reviewCount,
    shop_name: record.shopName,
    hype_score: record.trend.hypeScore,
    profit_score: record.trend.profitScore,
    risk_score: record.trend.riskScore,
    signal: record.trend.signal,
    captured_at: formatDate(record.latestSnapshot.capturedAt)
  }));

  const headers = Object.keys(rows[0] ?? {}).join(",");
  const body = rows
    .map((row) =>
      Object.values(row)
        .map((value) => `"${String(value).replaceAll("\"", "\"\"")}"`)
        .join(",")
    )
    .join("\n");

  return { fileName: `hype2profit-${kind}.csv`, csv: `${headers}\n${body}` };
}
