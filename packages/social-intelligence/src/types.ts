export type SocialPlatform = "x" | "tiktok" | "instagram" | "youtube" | "google_trends" | "manual" | "mock";
export type SocialTimeframe = "24h" | "7d" | "30d";
export type FinalSocialSignal = "EXPLORE" | "WATCH" | "IGNORE" | "RISKY";

export interface SocialSearchParams {
  category: string;
  keyword: string;
  locale?: string;
  timeframe?: SocialTimeframe;
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
}
