import type { SocialMention, SocialSearchParams, SocialSearchResult } from "./types";
import { withComputedSocialScore } from "./scoring";

const baseMentions: SocialMention[] = [
  {
    id: "sm_1",
    platform: "mock",
    text: "Tas padel model clean + muat raket, masuk juga buat gym bag aesthetic.",
    publishedAt: "2026-05-08T09:00:00.000Z",
    likeCount: 210,
    commentCount: 34,
    shareCount: 16,
    sentiment: "positive",
    intent: "trend",
    hashtags: ["#taspadel", "#gymbagaesthetic", "#athleisure"],
    keywords: ["tas padel", "gym bag aesthetic", "athleisure"]
  },
  {
    id: "sm_2",
    platform: "mock",
    text: "Cari padel bag affordable tapi tetap stylish buat daily commute.",
    publishedAt: "2026-05-08T12:00:00.000Z",
    likeCount: 142,
    commentCount: 29,
    shareCount: 8,
    sentiment: "positive",
    intent: "buying",
    hashtags: ["#padelbag", "#sportyfashion"],
    keywords: ["padel bag", "sporty bag", "affordable"]
  }
];

export function buildMockSocialResult(params: SocialSearchParams): SocialSearchResult {
  const mentions = params.keyword.toLowerCase().includes("tas padel") ? baseMentions : [];
  return withComputedSocialScore({
    params,
    mentions,
    summary: {
      keyword: params.keyword,
      category: params.category,
      totalMentions: mentions.length,
      sentimentBreakdown: { positive: 2, neutral: 0, negative: 0 },
      topHashtags: ["#taspadel", "#padelbag", "#athleisure"],
      relatedKeywords: ["tas padel", "padel bag", "racket bag", "sporty bag", "gym bag aesthetic", "athleisure"],
      buyerIntentSignals: ["Fashion + sports crossover makin naik", "Padel trend dorong demand tas fungsional dan estetik"],
      riskSignals: ["Trend saturation bisa cepat", "Kompetisi produk impor makin ketat", "Hype bisa pendek umur"],
      summary:
        "Sinyal mock menunjukkan crossover fashion-sports untuk tas padel sedang naik. Peluang utama ada di produk affordable stylish untuk padel/gym lifestyle.",
      sampledAt: "2026-05-09T00:00:00.000Z"
    }
  });
}
