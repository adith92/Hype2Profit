import type { Product, ProductSignal, ProductSnapshot, ScoreBundle, TrendCandle } from "@hype2profit/shared";

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const velocity = (values: number[]) => {
  if (values.length < 2) return 0;
  const first = values[0];
  const last = values[values.length - 1];
  if (first <= 0) return last > 0 ? 100 : 0;
  return clamp(((last - first) / first) * 100 + 50);
};

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);

export function calculateHypeScore(product: Product, snapshots: ProductSnapshot[]): number {
  const searchVelocity = velocity(snapshots.map((snapshot) => snapshot.viewsEstimate));
  const salesVelocity = velocity(snapshots.map((snapshot) => snapshot.soldCount));
  const ratingQuality = clamp(product.rating * 20);
  const revenueEstimate = clamp(average(snapshots.map((snapshot) => snapshot.revenueEstimate)) / 100000);
  const freshnessDays = (Date.now() - new Date(product.uploadedAt).getTime()) / 86400000;
  const freshness = clamp(100 - freshnessDays * 2.5);
  const inverseCompetitorDensity = clamp(100 - snapshots.length * 3);

  return Number(
    clamp(
      searchVelocity * 0.3 +
        salesVelocity * 0.2 +
        ratingQuality * 0.15 +
        revenueEstimate * 0.15 +
        freshness * 0.1 +
        inverseCompetitorDensity * 0.1
    ).toFixed(1)
  );
}

export function calculateProfitScore(product: Product, snapshots: ProductSnapshot[]): number {
  const priceSpread = clamp((((product.originalPrice ?? product.price * 1.12) - product.price) / product.price) * 100 * 2);
  const estimatedMargin = clamp(38 + (product.price % 17));
  const salesDelta = average(snapshots.map((snapshot, index, all) => (index === 0 ? 0 : Math.abs(snapshot.soldCount - all[index - 1].soldCount))));
  const salesConsistency = clamp(100 - salesDelta / 4);
  const lowReturnRisk = clamp(product.rating * 18);
  const supplierAvailability = clamp(product.stockCount / 4);
  return Number(
    clamp(
      priceSpread * 0.35 +
        estimatedMargin * 0.25 +
        salesConsistency * 0.2 +
        lowReturnRisk * 0.1 +
        supplierAvailability * 0.1
    ).toFixed(1)
  );
}

export function calculateRiskScore(product: Product, snapshots: ProductSnapshot[]): number {
  const lowRating = clamp((5 - product.rating) * 22);
  const highCompetition = clamp(snapshots.length * 4.5);
  const ageDays = (Date.now() - new Date(product.uploadedAt).getTime()) / 86400000;
  const oldUpload = clamp(ageDays * 1.5);
  const priceWar = clamp(((product.originalPrice ?? product.price) - product.price) / product.price * 100);
  const stockInstability = clamp(average(snapshots.map((snapshot, index, all) => index === 0 ? 0 : Math.abs(snapshot.stockCount - all[index - 1].stockCount))) / 2);
  const suspiciousRevenueSpike = clamp(velocity(snapshots.map((snapshot) => snapshot.revenueEstimate)) - 45);

  return Number(
    clamp(
      lowRating * 0.25 +
        highCompetition * 0.2 +
        oldUpload * 0.2 +
        priceWar * 0.15 +
        stockInstability * 0.1 +
        suspiciousRevenueSpike * 0.1
    ).toFixed(1)
  );
}

export function calculateFinalSignal(scores: Pick<ScoreBundle, "hypeScore" | "profitScore" | "riskScore">): ProductSignal {
  if (scores.hypeScore > 75 && scores.profitScore > 60 && scores.riskScore < 45) return "BUY_TEST";
  if (scores.riskScore >= 65 || scores.profitScore < 35) return "AVOID";
  if (scores.hypeScore > 60 && scores.riskScore < 65) return "WATCH";
  return "WATCH";
}

export function calculateTrendCandles(snapshots: ProductSnapshot[], interval = 3): TrendCandle[] {
  const sorted = [...snapshots].sort((a, b) => new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime());
  const candles: TrendCandle[] = [];

  for (let index = 0; index < sorted.length; index += interval) {
    const bucket = sorted.slice(index, index + interval);
    if (!bucket.length) continue;
    const counts = bucket.map((snapshot) => snapshot.viewsEstimate);
    const maSource = sorted.slice(Math.max(0, index - interval * 2), index + interval).map((snapshot) => snapshot.viewsEstimate);
    candles.push({
      time: bucket[bucket.length - 1].capturedAt,
      open: counts[0],
      high: Math.max(...counts),
      low: Math.min(...counts),
      close: counts[counts.length - 1],
      volume: bucket.reduce((sum, snapshot) => sum + snapshot.viewsEstimate + snapshot.soldCount * 4, 0),
      movingAverage: Number(average(maSource).toFixed(1))
    });
  }

  return candles;
}
