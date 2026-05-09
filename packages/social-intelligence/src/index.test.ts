import { describe, expect, it } from "vitest";
import { buildMockSocialResult, calculateFinalSocialSignal, calculateSocialHypeScore } from "./index";

describe("social intelligence", () => {
  it("calculateSocialHypeScore returns 0-100", () => {
    const result = buildMockSocialResult({ category: "Fashion", keyword: "Tas Padel", platform: "mock" });
    const score = calculateSocialHypeScore(result.mentions);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("calculateFinalSocialSignal returns EXPLORE for strong trend", () => {
    expect(
      calculateFinalSocialSignal({
        socialHypeScore: 80,
        buyerIntentScore: 70,
        saturationRisk: 40,
        controversyRisk: 20,
        marketplaceFitScore: 75
      })
    ).toBe("EXPLORE");
  });

  it("returns RISKY for high risk", () => {
    expect(
      calculateFinalSocialSignal({
        socialHypeScore: 90,
        buyerIntentScore: 80,
        saturationRisk: 90,
        controversyRisk: 20,
        marketplaceFitScore: 80
      })
    ).toBe("RISKY");
  });

  it("mock data Fashion + Tas Padel contains hashtags and related keywords", () => {
    const result = buildMockSocialResult({ category: "Fashion", keyword: "Tas Padel", timeframe: "7d", source: "combined_social" });
    expect(result.summary.topHashtags.length).toBeGreaterThan(0);
    expect(result.summary.relatedKeywords).toContain("tas padel");
    expect(Number.isNaN(result.score.socialHypeScore)).toBe(false);
  });

  it("supports Beauty + Serum mock result", () => {
    const result = buildMockSocialResult({ category: "Beauty", keyword: "Serum", source: "instagram" });
    expect(result.summary.relatedKeywords).toContain("serum");
    expect(result.mentions.every((mention) => mention.platform === "instagram")).toBe(true);
  });

  it("supports Gadget + Case iPhone mock result", () => {
    const result = buildMockSocialResult({ category: "Gadget", keyword: "Case iPhone", source: "x" });
    expect(result.summary.topHashtags).toContain("#caseiphone");
    expect(result.score.buyerIntentScore).toBeGreaterThanOrEqual(0);
  });

  it("supports Home + Rak Dapur mock result", () => {
    const result = buildMockSocialResult({ category: "Home", keyword: "Rak Dapur", source: "facebook" });
    expect(result.summary.relatedKeywords).toContain("rak dapur");
    expect(result.summary.riskSignals.length).toBeGreaterThan(0);
  });
});
