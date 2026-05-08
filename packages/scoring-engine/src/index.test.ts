import { describe, expect, it } from "vitest";
import { mockProductSnapshots, mockProducts } from "@hype2profit/shared";
import { calculateFinalSignal, calculateHypeScore, calculateProfitScore, calculateRiskScore, calculateTrendCandles } from "./index";

describe("scoring engine", () => {
  const product = mockProducts[0];
  const snapshots = mockProductSnapshots.filter((snapshot) => snapshot.productId === product.id);

  it("calculates bounded scores", () => {
    const hype = calculateHypeScore(product, snapshots);
    const profit = calculateProfitScore(product, snapshots);
    const risk = calculateRiskScore(product, snapshots);

    expect(hype).toBeGreaterThanOrEqual(0);
    expect(hype).toBeLessThanOrEqual(100);
    expect(profit).toBeGreaterThanOrEqual(0);
    expect(profit).toBeLessThanOrEqual(100);
    expect(risk).toBeGreaterThanOrEqual(0);
    expect(risk).toBeLessThanOrEqual(100);
  });

  it("returns a valid final signal", () => {
    const signal = calculateFinalSignal({
      hypeScore: 82,
      profitScore: 66,
      riskScore: 30
    });

    expect(signal).toBe("BUY_TEST");
  });

  it("builds candles from snapshots", () => {
    const candles = calculateTrendCandles(snapshots, 3);

    expect(candles.length).toBeGreaterThan(0);
    expect(candles[0]).toHaveProperty("open");
    expect(candles[0]).toHaveProperty("volume");
  });
});
