import { getLatestScan, type ScanItemRecord } from "./persistence";
import { formatDate } from "./utils";
import { analyzeStore, getProductRecords, getWatchlistRecords } from "./mock-service";

function toCsv(rows: Array<Record<string, string | number>>) {
  const headers = Object.keys(rows[0] ?? {}).join(",");
  const body = rows
    .map((row) =>
      Object.values(row)
        .map((value) => `"${String(value).replaceAll("\"", "\"\"")}"`)
        .join(",")
    )
    .join("\n");

  return `${headers}\n${body}`;
}

function mapLatestScanItemToRow(item: ScanItemRecord, marketplace: string, scannedAt: string) {
  return {
    marketplace,
    title: item.title ?? "",
    price_text: item.price_text ?? "",
    sold_text: item.sold_text ?? "",
    rating_text: item.rating_text ?? "",
    shop_name: item.shop_name ?? "",
    confidence_score: item.confidence_score ?? "",
    product_url: item.product_url ?? "",
    scanned_at: formatDate(scannedAt)
  };
}

export async function buildProductCsv(kind: "products" | "trending" | "watchlist" | "competitors" | "latest_scan" = "products") {
  if (kind === "latest_scan") {
    const latestScan = await getLatestScan();
    const session = latestScan.data.session;
    const rows = latestScan.data.items.map((item) => mapLatestScanItemToRow(item, session?.marketplace ?? "unknown", session?.scanned_at ?? item.created_at));
    const safeRows = rows.length
      ? rows
      : [
          {
            marketplace: session?.marketplace ?? "unknown",
            title: "",
            price_text: "",
            sold_text: "",
            rating_text: "",
            shop_name: "",
            confidence_score: "",
            product_url: "",
            scanned_at: formatDate(session?.scanned_at ?? new Date().toISOString())
          }
        ];

    return { fileName: "hype2profit-latest-scan.csv", csv: toCsv(safeRows) };
  }

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

  return { fileName: `hype2profit-${kind}.csv`, csv: toCsv(rows) };
}
