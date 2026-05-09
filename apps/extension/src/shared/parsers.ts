import type { VisibleProductCard } from "./types";

const SOLD_MULTIPLIER: Record<string, number> = {
  rb: 1_000,
  ribu: 1_000,
  jt: 1_000_000,
  juta: 1_000_000
};

export function parseIndonesianPrice(text?: string): number | null {
  if (!text) return null;
  const source = text.toLowerCase();
  const priceMultiplier = source.includes("jt") || source.includes("juta") ? 1_000_000 : source.includes("rb") || source.includes("ribu") ? 1_000 : 1;
  const normalized = text
    .toLowerCase()
    .replace(/rp/gi, "")
    .replace(/\s+/g, "")
    .replace(/[^\d.,]/g, "");
  if (!normalized) return null;
  if (priceMultiplier > 1) {
    const compact = normalized.replace(",", ".").replace(/[^0-9.]/g, "");
    const scaled = Number(compact);
    return Number.isFinite(scaled) ? Math.round(scaled * priceMultiplier) : null;
  }

  const hasComma = normalized.includes(",");
  const hasDot = normalized.includes(".");
  let numeric = normalized;
  if (hasComma && hasDot) numeric = normalized.replace(/\./g, "").replace(",", ".");
  else if (hasComma) numeric = normalized.replace(",", ".");
  else numeric = normalized.replace(/\./g, "");

  const parsed = Number(numeric);
  if (!Number.isFinite(parsed)) return null;
  return parsed < 1000 && (hasComma || hasDot) ? Math.round(parsed * 1000) : Math.round(parsed);
}

export function parseSoldCount(text?: string): number | null {
  if (!text) return null;
  const source = text.toLowerCase().replace(/\+/g, "").trim();
  const matched = source.match(/(\d+(?:[.,]\d+)?)\s*(rb|ribu|jt|juta|k|m)?/i);
  if (!matched) return null;
  const base = Number(matched[1].replace(",", "."));
  if (!Number.isFinite(base)) return null;
  const unit = matched[2]?.toLowerCase() ?? "";
  const multiplier = unit === "k" ? 1_000 : unit === "m" ? 1_000_000 : SOLD_MULTIPLIER[unit] ?? 1;
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
  if (card.title && card.title.length > 8) score += 22;
  if (card.price && (card.priceValue ?? 0) > 0) score += 20;
  if (card.url || card.normalizedUrl) score += 18;
  if (card.image && /^https?:\/\//i.test(card.image)) score += 15;
  if (card.sold && (card.soldValue ?? 0) >= 0) score += 13;
  if (card.rating && (card.ratingValue ?? 0) > 0) score += 12;
  return Math.min(100, Math.max(0, Math.round(score)));
}
