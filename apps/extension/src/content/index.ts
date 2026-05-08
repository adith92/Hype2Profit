import { detectMarketplace } from "../shared/detect";
import type { ScanPayload, VisibleProductCard } from "../shared/types";

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
  const selectors = ["[data-sqe='item']", "[data-testid='divProductWrapper']", "a[data-e2e='search-card-item']", "[data-testid='product-card']", "a[href*='/product/']"];
  const roots = selectors.flatMap((selector) => visibleElements(selector));
  const uniqueRoots = Array.from(new Set(roots)).slice(0, 24);

  return uniqueRoots
    .map((root, index) => ({
      id: `visible_${index + 1}`,
      title:
        (root.querySelector("img") as HTMLImageElement | null)?.alt ||
        root.querySelector("[title]")?.getAttribute("title") ||
        findText(root, ["h3", "h4", "[data-testid*='title']", "[class*='name']", "[class*='title']"]),
      price: findText(root, ["[class*='price']", "[data-testid*='price']", "[aria-label*='Rp']", "span"]),
      sold: findText(root, ["[class*='sold']", "[class*='terjual']", "[data-testid*='sold']"]),
      rating: findText(root, ["[class*='rating']", "[aria-label*='rating']", "[data-testid*='rating']"]),
      image: (root.querySelector("img") as HTMLImageElement | null)?.src,
      shop: findText(root, ["[class*='shop']", "[class*='store']", "[data-testid*='shop']"]),
      url: (root as HTMLAnchorElement).href || (root.querySelector("a") as HTMLAnchorElement | null)?.href || undefined
    }))
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
