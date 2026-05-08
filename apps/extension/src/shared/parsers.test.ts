import { describe, expect, it } from "vitest";
import { calculateExtractionConfidence, normalizeMarketplaceUrl, parseIndonesianPrice, parseSoldCount } from "./parsers";

describe("extension parser helpers", () => {
  it("parseIndonesianPrice handles common price formats", () => {
    expect(parseIndonesianPrice("Rp12.345")).toBe(12345);
    expect(parseIndonesianPrice("Rp 1,2 jt")).toBe(1200000);
    expect(parseIndonesianPrice("89.900")).toBe(89900);
    expect(parseIndonesianPrice(undefined)).toBe(0);
  });

  it("parseSoldCount handles rb/jt and plain values", () => {
    expect(parseSoldCount("1,2rb terjual")).toBe(1200);
    expect(parseSoldCount("3 jt")).toBe(3000000);
    expect(parseSoldCount("57")).toBe(57);
    expect(parseSoldCount("")).toBe(0);
  });

  it("normalizeMarketplaceUrl removes tracking params and hash", () => {
    const normalized = normalizeMarketplaceUrl("https://shopee.co.id/produk-a?utm_source=abc&sp_atk=xyz&keep=1#details");
    expect(normalized).toContain("https://shopee.co.id/produk-a?keep=1");
    expect(normalized).not.toContain("utm_source");
    expect(normalized).not.toContain("#details");
  });

  it("calculateExtractionConfidence gives higher score for richer cards", () => {
    const rich = calculateExtractionConfidence({
      id: "a",
      title: "Serum Wajah Niacinamide 10%",
      price: "Rp89.000",
      priceValue: 89000,
      sold: "1,5rb terjual",
      soldValue: 1500,
      rating: "4.9",
      ratingValue: 4.9,
      image: "https://img.example.com/a.jpg",
      shop: "Glow Shop",
      normalizedUrl: "https://shopee.co.id/product/1"
    });
    const poor = calculateExtractionConfidence({ id: "b", title: "Item" });
    expect(rich).toBeGreaterThan(poor);
    expect(rich).toBeLessThanOrEqual(1);
  });
});
