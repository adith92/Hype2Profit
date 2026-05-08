import type { VisibleProductCard } from "./types";

const SOLD_MULTIPLIER: Record<string, number> = {
  rb: 1_000,
  ribu: 1_000,
  jt: 1_000_000,
  juta: 1_000_000
};

export function parseIndonesianPrice(text?: string): number {
  if (!text) return 0;
  const source = text.toLowerCase();
  const priceMultiplier = source.includes("jt") || source.includes("juta") ? 1_000_000 : source.includes("rb") || source.includes("ribu") ? 1_000 : 1;
  const normalized = text
    .toLowerCase()
    .replace(/rp/gi, "")
    .replace(/\s+/g, "")
    .replace(/[^\d.,]/g, "");
  if (!normalized) return 0;

  const hasComma = normalized.includes(",");
  const hasDot = normalized.includes(".");
  let numeric = normalized;
  if (hasComma && hasDot) numeric = normalized.replace(/\./g, "").replace(",", ".");
  else if (hasComma) numeric = normalized.replace(",", ".");
  else numeric = normalized.replace(/\./g, "");

  const parsed = Number(numeric);
  if (!Number.isFinite(parsed)) return 0;
  if (priceMultiplier > 1) return Math.round(parsed * priceMultiplier);
  return parsed < 1000 && (hasComma || hasDot) ? Math.round(parsed * 1000) : Math.round(parsed);
}

export function parseSoldCount(text?: string): number {
  if (!text) return 0;
  const source = text.toLowerCase().replace(/\+/g, "").trim();
  const matched = source.match(/(\d+(?:[.,]\d+)?)\s*(rb|ribu|jt|juta)?/i);
  if (!matched) return 0;
  const base = Number(matched[1].replace(",", "."));
  if (!Number.isFinite(base)) return 0;
  const multiplier = SOLD_MULTIPLIER[matched[2]?.toLowerCase() ?? ""] ?? 1;
  return Math.round(base * multiplier);
}

export function normalizeMarketplaceUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const base =
      typeof globalThis.location !== "undefined" && globalThis.location?.origin
        ? globalThis.location.origin
        : "https://example.com";
    const parsed = new URL(url, base);
    parsed.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "sp_atk", "affiliate", "af_siteid", "af_click_lookback"].forEach((key) =>
      parsed.searchParams.delete(key)
    );
    return parsed.toString();
  } catch {
    return undefined;
  }
}

export function calculateExtractionConfidence(card: VisibleProductCard): number {
  let score = 0;
  if (card.title && card.title.length > 8) score += 0.28;
  if (card.price && (card.priceValue ?? 0) > 0) score += 0.22;
  if (card.sold && (card.soldValue ?? 0) >= 0) score += 0.15;
  if (card.rating && (card.ratingValue ?? 0) > 0) score += 0.1;
  if (card.image && /^https?:\/\//i.test(card.image)) score += 0.1;
  if (card.shop) score += 0.05;
  if (card.url || card.normalizedUrl) score += 0.1;
  return Math.min(1, Number(score.toFixed(2)));
}
