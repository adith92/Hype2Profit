import type { DetectedMarketplace } from "./types";

export function detectMarketplace(hostname: string): DetectedMarketplace {
  if (hostname.includes("shopee")) return "shopee";
  if (hostname.includes("tokopedia")) return "tokopedia";
  if (hostname.includes("tiktok")) return "tiktok_shop";
  return "unknown";
}
