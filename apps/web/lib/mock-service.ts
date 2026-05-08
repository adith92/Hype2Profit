import { adapters, getTrendingProducts } from "@hype2profit/marketplace-adapters";
import { mockProductSnapshots, mockProducts, mockStores, mockStoreSnapshots, mockTrendScores } from "@hype2profit/shared";
import type {
  MarketplacePlatform,
  Product,
  ProductSignal,
  ProductSnapshot,
  StoreAnalysis,
  TrendScore
} from "@hype2profit/shared";
import { calculateTrendCandles } from "@hype2profit/scoring-engine";

export type ProductRecord = Product & { trend: TrendScore; latestSnapshot: ProductSnapshot };
export type WatchlistRecord = ProductRecord & { notes?: string; watchedAt: string };

const watchlist = new Map<string, { productId: string; notes?: string; createdAt: string }>();
const exportJobs = new Map<string, { id: string; kind: string; status: "pending" | "completed" | "failed"; createdAt: string }>();
let watchlistSeeded = false;

export function getProductRecords(platform: MarketplacePlatform | "all" = "all"): ProductRecord[] {
  return mockProducts
    .filter((product) => platform === "all" || product.platform === platform)
    .map((product) => ({
      ...product,
      trend: mockTrendScores.find((trend) => trend.productId === product.id)!,
      latestSnapshot: mockProductSnapshots.filter((snapshot) => snapshot.productId === product.id).at(-1)!
    }));
}

export function getDashboardPayload(platform: MarketplacePlatform | "all" = "all") {
  const preferredPlatform = platform === "all" ? "shopee" : platform;
  const records = getProductRecords(preferredPlatform);
  const candles = calculateTrendCandles(
    mockProductSnapshots.filter((snapshot) => records.some((record) => record.id === snapshot.productId)),
    18
  );
  return {
    records,
    candles,
    kpis: {
      totalProductsScanned: records.length,
      hotProducts: records.filter((record) => record.trend.signal === "BUY_TEST").length,
      averageHypeScore: Math.round(records.reduce((sum, record) => sum + record.trend.hypeScore, 0) / records.length),
      estimatedRevenueOpportunity: records.reduce((sum, record) => sum + record.latestSnapshot.revenueEstimate, 0),
      riskAlerts: records.filter((record) => record.trend.riskScore >= 65).length
    },
    categoryHeatmap: Array.from(
      records.reduce((map, record) => {
        map.set(record.category, (map.get(record.category) ?? 0) + record.trend.finalScore);
        return map;
      }, new Map<string, number>())
    ).map(([category, score]) => ({ category, score: Number(score.toFixed(1)) })),
    breakoutAlerts: records
      .filter((record) => record.trend.hypeScore > 76)
      .slice(0, 6)
      .map((record) => `${record.title} sedang breakout di ${record.platform}`),
    topTrending: getTrendingProducts(platform).slice(0, 7)
  };
}

export function searchRecords(filters: {
  keyword?: string;
  platform?: MarketplacePlatform | "all";
  minPrice?: number;
  maxPrice?: number;
  minSales?: number;
  maxSales?: number;
  minRating?: number;
  minStock?: number;
  maxStock?: number;
  signal?: ProductSignal | "ALL";
}) {
  return getProductRecords(filters.platform ?? "all").filter((record) => {
    if (filters.keyword && !record.title.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
    if (filters.minPrice && record.price < filters.minPrice) return false;
    if (filters.maxPrice && record.price > filters.maxPrice) return false;
    if (filters.minSales && record.soldCount < filters.minSales) return false;
    if (filters.maxSales && record.soldCount > filters.maxSales) return false;
    if (filters.minRating && record.rating < filters.minRating) return false;
    if (filters.minStock && record.stockCount < filters.minStock) return false;
    if (filters.maxStock && record.stockCount > filters.maxStock) return false;
    if (filters.signal && filters.signal !== "ALL" && record.trend.signal !== filters.signal) return false;
    return true;
  });
}

export function getTrendingPayload() {
  const leaderboard = getTrendingProducts("shopee");
  return {
    leaderboard,
    tabs: {
      risingFast: leaderboard.filter((item) => item.trend.hypeScore > 75).slice(0, 8),
      highRevenue: [...leaderboard].sort((a, b) => b.soldCount * b.price - a.soldCount * a.price).slice(0, 8),
      lowCompetition: leaderboard.filter((item) => item.trend.riskScore < 45).slice(0, 8),
      newUploads: [...leaderboard].sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)).slice(0, 8),
      watchlistWorthy: leaderboard.filter((item) => item.trend.signal !== "AVOID").slice(0, 8)
    }
  };
}

export async function analyzeStore(urlOrId: string, platform: MarketplacePlatform | "all" = "shopee"): Promise<StoreAnalysis> {
  if (platform === "all") {
    return adapters.shopee.analyzeStore(urlOrId);
  }
  return adapters[platform].analyzeStore(urlOrId);
}

export function getWatchlistRecords() {
  return Array.from(watchlist.values()).map((entry) => {
    const record = getProductRecords("all").find((item) => item.id === entry.productId)!;
    return { ...record, notes: entry.notes, watchedAt: entry.createdAt };
  });
}

export function ensureDemoWatchlistSeeded() {
  if (watchlistSeeded || watchlist.size > 0) return getWatchlistRecords();
  getProductRecords("all")
    .slice(0, 3)
    .forEach((item) => watchlist.set(item.id, { productId: item.id, notes: "Seeded for prototype demo", createdAt: new Date().toISOString() }));
  watchlistSeeded = true;
  return getWatchlistRecords();
}

export function addToWatchlist(productId: string, notes?: string) {
  watchlist.set(productId, { productId, notes, createdAt: new Date().toISOString() });
  return getWatchlistRecords();
}

export function removeFromWatchlist(productId: string) {
  watchlist.delete(productId);
  return getWatchlistRecords();
}

export function createExportJob(kind: string) {
  const id = `export_${exportJobs.size + 1}`;
  const job = { id, kind, status: "completed" as const, createdAt: new Date().toISOString() };
  exportJobs.set(id, job);
  return job;
}

export function getExportJobs() {
  return Array.from(exportJobs.values());
}

export function getExtensionStatus() {
  return {
    connected: Boolean(process.env.EXTENSION_PAIRING_SECRET),
    mockData: process.env.ENABLE_MOCK_DATA !== "false"
  };
}

export { mockStores, mockStoreSnapshots };
