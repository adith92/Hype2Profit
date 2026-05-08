import type { FinalSocialSignal, SocialMention, SocialSearchResult } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function calculateSocialHypeScore(mentions: SocialMention[]) {
  const engagement = mentions.reduce((sum, m) => sum + (m.likeCount ?? 0) + (m.commentCount ?? 0) * 2 + (m.shareCount ?? 0) * 3, 0);
  return clamp(Math.round(mentions.length * 8 + engagement / 60));
}

export function calculateBuyerIntentScore(mentions: SocialMention[]) {
  const intentHits = mentions.filter((m) => m.intent === "buying" || m.intent === "asking" || m.intent === "reviewing").length;
  return clamp(Math.round((intentHits / Math.max(mentions.length, 1)) * 100));
}

export function calculateSaturationRisk(mentions: SocialMention[]) {
  const trendMentions = mentions.filter((m) => m.intent === "trend").length;
  return clamp(Math.round((trendMentions / Math.max(mentions.length, 1)) * 100));
}

export function calculateControversyRisk(mentions: SocialMention[]) {
  const negative = mentions.filter((m) => m.sentiment === "negative").length;
  return clamp(Math.round((negative / Math.max(mentions.length, 1)) * 100));
}

export function calculateMarketplaceFitScore(mentions: SocialMention[]) {
  const positive = mentions.filter((m) => m.sentiment === "positive").length;
  return clamp(Math.round((positive / Math.max(mentions.length, 1)) * 100));
}

export function calculateFinalSocialSignal(scores: {
  socialHypeScore: number;
  buyerIntentScore: number;
  saturationRisk: number;
  controversyRisk: number;
  marketplaceFitScore: number;
}): FinalSocialSignal {
  if (scores.controversyRisk >= 65 || scores.saturationRisk >= 85) return "RISKY";
  if (scores.socialHypeScore >= 70 && scores.buyerIntentScore >= 55 && scores.marketplaceFitScore >= 60) return "EXPLORE";
  if (scores.socialHypeScore >= 45) return "WATCH";
  return "IGNORE";
}

export function withComputedSocialScore(result: Omit<SocialSearchResult, "score">): SocialSearchResult {
  const socialHypeScore = calculateSocialHypeScore(result.mentions);
  const buyerIntentScore = calculateBuyerIntentScore(result.mentions);
  const saturationRisk = calculateSaturationRisk(result.mentions);
  const controversyRisk = calculateControversyRisk(result.mentions);
  const marketplaceFitScore = calculateMarketplaceFitScore(result.mentions);
  return {
    ...result,
    score: {
      socialHypeScore,
      buyerIntentScore,
      saturationRisk,
      controversyRisk,
      marketplaceFitScore,
      finalSocialSignal: calculateFinalSocialSignal({ socialHypeScore, buyerIntentScore, saturationRisk, controversyRisk, marketplaceFitScore })
    }
  };
}
