import { describe, expect, it } from "vitest";
import { MockSocialSearchProvider, getSocialSearchProvider } from "./index";

describe("social adapters", () => {
  it("MockSocialSearchProvider returns deterministic result", async () => {
    const provider = new MockSocialSearchProvider("x");
    const result = await provider.search({ category: "Fashion", keyword: "Tas Padel", source: "x" });
    expect(result.summary.relatedKeywords).toContain("tas padel");
    expect(result.mentions.every((mention) => mention.platform === "x")).toBe(true);
  });

  it("getSocialSearchProvider defaults to mock", () => {
    const provider = getSocialSearchProvider();
    expect(provider.provider).toBe("mock");
  });

  it("combined social provider uses grouped mock sources", async () => {
    const provider = getSocialSearchProvider({ source: "combined_social" });
    const result = await provider.search({ category: "Fashion", keyword: "Tas Padel", source: "combined_social" });
    expect(result.mentions.some((mention) => mention.platform === "x")).toBe(true);
    expect(result.mentions.some((mention) => mention.platform === "instagram")).toBe(true);
  });

  it("combined all provider attaches marketplace context", async () => {
    const provider = getSocialSearchProvider({ source: "combined_all" });
    const result = await provider.search({ category: "Beauty", keyword: "Serum", source: "combined_all" });
    expect(result.marketplaceContext?.matchingProducts).toBeGreaterThanOrEqual(0);
    expect(result.marketplaceContext?.note).toContain("estimasi");
  });
});
