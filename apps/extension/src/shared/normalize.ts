import type { ProductPreview, VisibleProductCard } from "./types";

export const DEFAULT_APP_URL = "http://localhost:3000";

const toNumber = (value?: string) => {
  if (!value) return 0;
  const compact = value
    .replace(/\./g, "")
    .replace(/,/g, ".")
    .replace(/[^\d.]/g, "")
    .trim();
  const parsed = Number(compact);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function normalizeProductCard(card: VisibleProductCard): ProductPreview {
  const numericPrice = toNumber(card.price);
  const numericSold = toNumber(card.sold);
  const numericRating = toNumber(card.rating);
  const estimatedScore = Math.round(numericSold * 0.015 + numericRating * 14 + Math.max(0, 100 - numericPrice / 5000));

  return {
    ...card,
    numericPrice,
    numericSold,
    numericRating,
    estimatedScore
  };
}
