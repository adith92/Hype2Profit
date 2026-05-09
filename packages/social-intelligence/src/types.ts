export type SocialPlatform = "x" | "facebook" | "instagram" | "threads" | "tiktok" | "youtube" | "google_trends" | "manual" | "mock";
export type SocialSource = "x" | "facebook" | "instagram" | "threads" | "combined_social" | "combined_all";
export type SocialProviderId = "mock" | "xai_grok" | "x_api" | "meta_instagram" | "meta_facebook" | "threads";
export type SocialProviderStatus = "mock" | "limited_mock" | "planned";
export type SocialTimeframe = "24h" | "7d" | "30d";
export type FinalSocialSignal = "EXPLORE" | "WATCH" | "IGNORE" | "RISKY";

export interface SocialSearchParams {
  category: string;
  keyword: string;
  locale?: string;
  timeframe?: SocialTimeframe;
  source?: SocialSource;
  platform?: SocialPlatform | "all";
}

export interface SocialMention {
  id: string;
  platform: SocialPlatform;
  authorName?: string;
  authorHandle?: string;
  text: string;
  url?: string;
  publishedAt: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  viewCount?: number;
  sentiment: "positive" | "neutral" | "negative";
  intent: "buying" | "reviewing" | "complaining" | "asking" | "trend" | "other";
  hashtags: string[];
  keywords: string[];
}

export interface SocialSummary {
  keyword: string;
  category: string;
  totalMentions: number;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  topHashtags: string[];
  relatedKeywords: string[];
  buyerIntentSignals: string[];
  riskSignals: string[];
  summary: string;
  sampledAt: string;
}

export interface SocialScore {
  socialHypeScore: number;
  buyerIntentScore: number;
  saturationRisk: number;
  controversyRisk: number;
  marketplaceFitScore: number;
  finalSocialSignal: FinalSocialSignal;
}

export interface SocialSearchResult {
  params: SocialSearchParams;
  mentions: SocialMention[];
  summary: SocialSummary;
  score: SocialScore;
  providerStatus?: SocialProviderStatus;
  marketplaceContext?: {
    matchingProducts: number;
    averagePrice: number;
    averageHypeScore: number;
    topPlatform: "shopee" | "tokopedia" | "tiktok_shop" | "mixed";
    topSignals: string[];
    note: string;
  };
}

export const SOCIAL_SOURCE_GROUPS = [
  {
    label: "Social",
    options: [
      { value: "x", label: "X" },
      { value: "facebook", label: "Facebook" },
      { value: "instagram", label: "Instagram" },
      { value: "threads", label: "Threads" }
    ]
  },
  {
    label: "Combined",
    options: [
      { value: "combined_social", label: "Gabungan Social" },
      { value: "combined_all", label: "Gabungan Semua" }
    ]
  }
] as const satisfies ReadonlyArray<{
  label: string;
  options: ReadonlyArray<{ value: SocialSource; label: string }>;
}>;
