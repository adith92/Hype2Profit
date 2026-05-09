import { detectMarketplace } from "../shared/detect";
import type { ScanPayload, VisibleProductCard } from "../shared/types";
import {
  calculateExtractionConfidence,
  normalizeMarketplaceUrl,
  parseIndonesianPrice,
  parseSoldCount
} from "../shared/parsers";

function text(element: Element | null) {
  return element?.textContent?.trim() ?? undefined;
}

function visibleElements(selector: string) {
  return Array.from(document.querySelectorAll(selector)).filter((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 40 && rect.height > 40 && style.visibility !== "hidden" && style.display !== "none" && rect.bottom >= 0 && rect.top <= window.innerHeight;
  });
}

function findText(root: Element, selectors: string[]) {
  for (const selector of selectors) {
    const value = text(root.querySelector(selector));
    if (value) return value;
  }
  return undefined;
}

function extractCards(): VisibleProductCard[] {
  const selectors = [
    "[data-sqe='item']",
    "[data-testid='divProductWrapper']",
    "a[data-e2e='search-card-item']",
    "[data-testid='product-card']",
    "a[href*='/product/']",
    "div[data-testid*='product']",
    "div[class*='product-card']",
    "li:has(a[href*='shopee'])",
    "article:has(a[href*='tokopedia'])"
  ];
  const roots = selectors.flatMap((selector) => visibleElements(selector));
  const uniqueRoots = Array.from(new Set(roots)).slice(0, 24);

  return uniqueRoots
    .map((root, index) => {
      const title =
        (root.querySelector("img") as HTMLImageElement | null)?.alt ||
        root.querySelector("[title]")?.getAttribute("title") ||
        findText(root, [
          "h3",
          "h4",
          "[data-testid*='title']",
          "[class*='name']",
          "[class*='title']",
          "[aria-label*='produk']",
          "[data-e2e*='title']"
        ]);
      const price = findText(root, [
        "[class*='price']",
        "[data-testid*='price']",
        "[aria-label*='Rp']",
        "[data-e2e*='price']",
        "span"
      ]);
      const sold = findText(root, [
        "[class*='sold']",
        "[class*='terjual']",
        "[data-testid*='sold']",
        "[data-e2e*='sold']",
        "span"
      ]);
      const rating = findText(root, [
        "[class*='rating']",
        "[aria-label*='rating']",
        "[data-testid*='rating']",
        "[data-e2e*='rating']"
      ]);
      const image =
        (root.querySelector("img[src]") as HTMLImageElement | null)?.src ||
        (root.querySelector("img[data-src]") as HTMLImageElement | null)?.dataset.src;
      const shop = findText(root, [
        "[class*='shop']",
        "[class*='store']",
        "[data-testid*='shop']",
        "[data-e2e*='shop']",
        "[class*='merchant']"
      ]);
      const rawUrl = (root as HTMLAnchorElement).href || (root.querySelector("a[href]") as HTMLAnchorElement | null)?.href || undefined;
      const normalizedUrl = normalizeMarketplaceUrl(rawUrl);
      const priceValue = parseIndonesianPrice(price) ?? 0;
      const soldValue = parseSoldCount(sold) ?? 0;
      const ratingValue = Number((rating ?? "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;

      const card: VisibleProductCard = {
        id: `visible_${index + 1}`,
        title,
        price,
        priceValue,
        sold,
        soldValue,
        rating,
        ratingValue,
        image,
        shop,
        url: rawUrl,
        normalizedUrl
      };
      card.extractionConfidence = calculateExtractionConfidence(card);
      card.confidenceScore = card.extractionConfidence;
      return card;
    })
    .filter((card) => Boolean(card.title || card.price || card.url));
}

function buildScanPayload(): ScanPayload {
  return {
    marketplace: detectMarketplace(window.location.hostname),
    url: window.location.href,
    scannedAt: new Date().toISOString(),
    products: extractCards()
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "H2P_SCAN_PAGE") {
    sendResponse(buildScanPayload());
  }
});
