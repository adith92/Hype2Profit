import { mockProductSnapshots, mockProducts, mockStores, mockStoreSnapshots, mockTrendScores } from "@hype2profit/shared";
import type {
  MarketplacePlatform,
  Product,
  SearchProductsParams,
  StoreAnalysis
} from "@hype2profit/shared";
import { calculateFinalSignal, calculateHypeScore, calculateProfitScore, calculateRiskScore } from "@hype2profit/scoring-engine";

export interface MarketplaceAdapter {
  platform: MarketplacePlatform;
  searchProducts(params: SearchProductsParams): Promise<Product[]>;
  getProductDetails(urlOrId: string): Promise<Product>;
  analyzeStore(urlOrId: string): Promise<StoreAnalysis>;
}

const normalize = (value: string) => value.toLowerCase();

const enrichTopProducts = (platform: MarketplacePlatform) =>
  mockProducts
    .filter((product) => product.platform === platform)
    .slice(0, 8)
    .map((product, index) => {
      const snapshots = mockProductSnapshots.filter((snapshot) => snapshot.productId === product.id);
      const hypeScore = calculateHypeScore(product, snapshots);
      const profitScore = calculateProfitScore(product, snapshots);
      const riskScore = calculateRiskScore(product, snapshots);
      return {
        ...product,
        estimatedRevenue: snapshots.at(-1)?.revenueEstimate ?? product.price * product.soldCount,
        rank: index + 1,
        score: Number((hypeScore * 0.45 + profitScore * 0.35 - riskScore * 0.15 + 18).toFixed(1)),
        signal: calculateFinalSignal({ hypeScore, profitScore, riskScore })
      };
    });

class MockMarketplaceAdapter implements MarketplaceAdapter {
  constructor(public platform: MarketplacePlatform) {}

  async searchProducts(params: SearchProductsParams): Promise<Product[]> {
    const keyword = normalize(params.keyword);
    return mockProducts.filter((product) => {
      if (product.platform !== this.platform) return false;
      const matchesKeyword = keyword ? normalize(product.title).includes(keyword) || normalize(product.category).includes(keyword) : true;
      return matchesKeyword;
    });
  }

  async getProductDetails(urlOrId: string): Promise<Product> {
    const product = mockProducts.find((item) => item.id === urlOrId || item.externalId === urlOrId || item.url === urlOrId);
    if (!product || product.platform !== this.platform) {
      throw new Error(`Product not found for ${this.platform}`);
    }
    return product;
  }

  async analyzeStore(urlOrId: string): Promise<StoreAnalysis> {
    const store =
      mockStores.find((item) => item.platform === this.platform && (item.id === urlOrId || item.externalId === urlOrId || item.url === urlOrId)) ??
      mockStores.find((item) => item.platform === this.platform);

    if (!store) {
      throw new Error(`Store not found for ${this.platform}`);
    }

    const snapshots = mockStoreSnapshots.filter((snapshot) => snapshot.storeId === store.id);
    const topProducts = enrichTopProducts(this.platform);
    return {
      store,
      snapshots,
      topProducts,
      metrics: {
        estimatedSales: snapshots.at(-1)?.estimatedSales ?? 0,
        estimatedRevenue: snapshots.at(-1)?.estimatedRevenue ?? 0,
        productCount: store.productCount,
        averageRating: store.rating,
        uploadFrequency: 3 + (store.productCount % 7),
        viewsEstimate: snapshots.at(-1)?.viewsEstimate ?? 0
      },
      categoryMix: topProducts.reduce<Array<{ name: string; value: number }>>((acc, product) => {
        const found = acc.find((entry) => entry.name === product.category);
        if (found) found.value += 1;
        else acc.push({ name: product.category, value: 1 });
        return acc;
      }, [])
    };
  }
}

export class MockShopeeAdapter extends MockMarketplaceAdapter {
  constructor() {
    super("shopee");
  }
}

export class MockTikTokShopAdapter extends MockMarketplaceAdapter {
  constructor() {
    super("tiktok_shop");
  }
}

export class MockTokopediaAdapter extends MockMarketplaceAdapter {
  constructor() {
    super("tokopedia");
  }
}

export class ExtensionAdapter implements MarketplaceAdapter {
  platform: MarketplacePlatform = "shopee";

  async searchProducts(params: SearchProductsParams): Promise<Product[]> {
    const selectedPlatform = params.platform === "all" || !params.platform ? null : params.platform;
    return mockProducts.filter((product) => (!selectedPlatform || product.platform === selectedPlatform) && product.title.toLowerCase().includes(params.keyword.toLowerCase()));
  }

  async getProductDetails(urlOrId: string): Promise<Product> {
    const product = mockProducts.find((item) => item.id === urlOrId || item.url === urlOrId);
    if (!product) throw new Error("Extension payload product not found");
    return product;
  }

  async analyzeStore(urlOrId: string): Promise<StoreAnalysis> {
    const adapter = new MockShopeeAdapter();
    return adapter.analyzeStore(urlOrId);
  }
}

export const adapters = {
  shopee: new MockShopeeAdapter(),
  tiktok_shop: new MockTikTokShopAdapter(),
  tokopedia: new MockTokopediaAdapter(),
  extension: new ExtensionAdapter()
};

export const getTrendingProducts = (platform?: MarketplacePlatform | "all") =>
  mockProducts
    .filter((product) => !platform || platform === "all" || product.platform === platform)
    .map((product) => ({
      ...product,
      trend: mockTrendScores.find((score) => score.productId === product.id)!
    }))
    .sort((a, b) => b.trend.finalScore - a.trend.finalScore);
