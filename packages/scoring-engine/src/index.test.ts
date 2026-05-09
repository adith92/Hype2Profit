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

  it("returns BUY_TEST when thresholds are met", () => {
    expect(
      calculateFinalSignal({
        hypeScore: 82,
        profitScore: 66,
        riskScore: 30
      })
    ).toBe("BUY_TEST");
  });

  it("returns AVOID when riskScore is high", () => {
    expect(
      calculateFinalSignal({
        hypeScore: 90,
        profitScore: 80,
        riskScore: 65
      })
    ).toBe("AVOID");
  });

  it("returns AVOID when profitScore is too low", () => {
    expect(
      calculateFinalSignal({
        hypeScore: 90,
        profitScore: 34.9,
        riskScore: 40
      })
    ).toBe("AVOID");
  });

  it("returns WATCH for middle case", () => {
    expect(calculateFinalSignal({ hypeScore: 63, profitScore: 50, riskScore: 50 })).toBe("WATCH");
  });

  it("builds candles from snapshots sorted by capturedAt", () => {
    const unsorted = [...snapshots].reverse();
    const candles = calculateTrendCandles(unsorted, 3);

    expect(candles.length).toBeGreaterThan(0);
    const candleTimes = candles.map((item) => new Date(item.time).getTime());
    expect(candleTimes).toEqual([...candleTimes].sort((a, b) => a - b));
  });

  it("returns complete candle fields including movingAverage", () => {
    const candles = calculateTrendCandles(snapshots, 3);
    const first = candles[0];

    expect(first).toHaveProperty("open");
    expect(first).toHaveProperty("high");
    expect(first).toHaveProperty("low");
    expect(first).toHaveProperty("close");
    expect(first).toHaveProperty("volume");
    expect(first).toHaveProperty("movingAverage");
    expect(first.high).toBeGreaterThanOrEqual(first.low);
  });

  it("handles empty snapshots and interval buckets", () => {
    expect(calculateTrendCandles([], 3)).toEqual([]);
    const bucketed = calculateTrendCandles(snapshots.slice(0, 5), 2);
    expect(bucketed.length).toBe(3);
  });

  it("keeps legacy valid-signal scenario", () => {
    const signal = calculateFinalSignal({
      hypeScore: 82,
      profitScore: 66,
      riskScore: 30
    });

    expect(signal).toBe("BUY_TEST");
  });

});
