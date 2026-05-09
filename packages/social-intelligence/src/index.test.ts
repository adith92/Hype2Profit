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
    const result = buildMockSocialResult({ category: "Fashion", keyword: "Tas Padel", timeframe: "7d" });
    expect(result.summary.topHashtags.length).toBeGreaterThan(0);
    expect(result.summary.relatedKeywords).toContain("tas padel");
    expect(Number.isNaN(result.score.socialHypeScore)).toBe(false);
  });
});
