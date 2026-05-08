export type MarketplacePlatform = "shopee" | "tiktok_shop" | "tokopedia";
export type ProductSignal = "BUY_TEST" | "WATCH" | "AVOID";

export interface Product {
  id: string;
  platform: MarketplacePlatform;
  externalId: string;
  title: string;
  url: string;
  imageUrl: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stockCount: number;
  shopName: string;
  shopUrl: string;
  uploadedAt: string;
  scrapedAt: string;
}

export interface ProductSnapshot {
  id: string;
  productId: string;
  searchKeyword: string;
  price: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stockCount: number;
  viewsEstimate: number;
  revenueEstimate: number;
  rankPosition: number;
  capturedAt: string;
}

export interface Store {
  id: string;
  platform: MarketplacePlatform;
  externalId: string;
  name: string;
  url: string;
  rating: number;
  followerCount: number;
  productCount: number;
}

export interface StoreSnapshot {
  id: string;
  storeId: string;
  estimatedSales: number;
  estimatedRevenue: number;
  viewsEstimate: number;
  productCount: number;
  rating: number;
  capturedAt: string;
}

export interface TrendScore {
  id: string;
  productId: string;
  hypeScore: number;
  profitScore: number;
  riskScore: number;
  finalScore: number;
  signal: ProductSignal;
  reasons: string[];
  calculatedAt: string;
}

export interface StoreAnalysis {
  store: Store;
  snapshots: StoreSnapshot[];
  topProducts: Array<Product & { estimatedRevenue: number; rank: number; score: number }>;
  metrics: {
    estimatedSales: number;
    estimatedRevenue: number;
    productCount: number;
    averageRating: number;
    uploadFrequency: number;
    viewsEstimate: number;
  };
  categoryMix: Array<{ name: string; value: number }>;
}

export interface SearchProductsParams {
  keyword: string;
  platform?: MarketplacePlatform | "all";
  category?: string;
}

export interface ScoreBundle {
  hypeScore: number;
  profitScore: number;
  riskScore: number;
  finalScore: number;
}

export interface TrendCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  movingAverage: number;
}
