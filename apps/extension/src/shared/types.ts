export type DetectedMarketplace = "shopee" | "tokopedia" | "tiktok_shop" | "unknown";

export interface VisibleProductCard {
  id: string;
  title?: string;
  price?: string;
  priceValue?: number;
  sold?: string;
  soldValue?: number;
  rating?: string;
  ratingValue?: number;
  image?: string;
  shop?: string;
  url?: string;
  normalizedUrl?: string;
  extractionConfidence?: number;
  confidenceScore?: number;
}

export interface ScanPayload {
  marketplace: DetectedMarketplace;
  url: string;
  scannedAt: string;
  products: VisibleProductCard[];
}

export interface ProductPreview extends VisibleProductCard {
  numericPrice: number;
  numericSold: number;
  numericRating: number;
  estimatedScore: number;
}

export interface ExtensionStorageState {
  appUrl: string;
  lastScan: ScanPayload | null;
  lastSendStatus: "idle" | "sending" | "success" | "error";
  lastSendMessage?: string;
}

export type ExtensionMessage =
  | { type: "H2P_SCAN_PAGE" }
  | { type: "H2P_SCAN_RESULT"; payload: ScanPayload }
  | { type: "H2P_GET_LAST_SCAN" }
  | { type: "H2P_SEND_LAST_SCAN" }
  | { type: "H2P_OPEN_DASHBOARD" }
  | { type: "H2P_UPDATE_APP_URL"; payload: { appUrl: string } };
