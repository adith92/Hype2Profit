import { describe, expect, it } from "vitest";
import { MockShopeeAdapter, adapters, getTrendingProducts } from "./index";

describe("mock marketplace adapters", () => {
  it("searches mock products", async () => {
    const adapter = new MockShopeeAdapter();
    const results = await adapter.searchProducts({ keyword: "serum", platform: "shopee" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((product) => product.platform === "shopee")).toBe(true);
  });

  it("returns store analysis", async () => {
    const analysis = await adapters.tokopedia.analyzeStore("missing");
    expect(analysis.topProducts.length).toBeGreaterThan(0);
    expect(analysis.metrics.estimatedRevenue).toBeGreaterThan(0);
  });

  it("builds trending lists", () => {
    const leaderboard = getTrendingProducts("all");
    expect(leaderboard[0].trend.finalScore).toBeGreaterThanOrEqual(leaderboard[1].trend.finalScore);
  });
});
