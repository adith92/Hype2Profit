import { describe, expect, it } from "vitest";
import { MockShopeeAdapter, MockTikTokShopAdapter, MockTokopediaAdapter, adapters, getTrendingProducts } from "./index";

describe("mock marketplace adapters", () => {
  it("MockShopeeAdapter.searchProducts filters by keyword", async () => {
    const adapter = new MockShopeeAdapter();
    const results = await adapter.searchProducts({ keyword: "serum", platform: "shopee" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((product) => product.platform === "shopee")).toBe(true);
    expect(results.every((product) => product.title.toLowerCase().includes("serum") || product.category.toLowerCase().includes("serum"))).toBe(true);
  });

  it("MockTokopediaAdapter only returns tokopedia products", async () => {
    const adapter = new MockTokopediaAdapter();
    const results = await adapter.searchProducts({ keyword: "", platform: "tokopedia" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((product) => product.platform === "tokopedia")).toBe(true);
  });

  it("MockTikTokShopAdapter behaves as safe placeholder", async () => {
    const adapter = new MockTikTokShopAdapter();
    const results = await adapter.searchProducts({ keyword: "", platform: "tiktok_shop" });
    expect(results.every((product) => product.platform === "tiktok_shop")).toBe(true);
  });

  it("getTrendingProducts sorts by finalScore descending", () => {
    const leaderboard = getTrendingProducts("all");
    expect(leaderboard.length).toBeGreaterThan(1);
    expect(leaderboard[0].trend.finalScore).toBeGreaterThanOrEqual(leaderboard[1].trend.finalScore);
    for (let index = 1; index < leaderboard.length; index += 1) {
      expect(leaderboard[index - 1].trend.finalScore).toBeGreaterThanOrEqual(leaderboard[index].trend.finalScore);
    }
  });

  it("analyzeStore returns metrics, snapshots, categoryMix, and topProducts", async () => {
    const analysis = await adapters.tokopedia.analyzeStore("missing");
    expect(analysis.metrics).toBeTruthy();
    expect(Array.isArray(analysis.snapshots)).toBe(true);
    expect(Array.isArray(analysis.categoryMix)).toBe(true);
    expect(Array.isArray(analysis.topProducts)).toBe(true);
    expect(analysis.topProducts.length).toBeGreaterThan(0);
    expect(analysis.metrics.estimatedRevenue).toBeGreaterThan(0);
  });
});
