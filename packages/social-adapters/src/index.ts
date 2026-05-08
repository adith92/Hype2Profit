import { buildMockSocialResult, type SocialSearchParams, type SocialSearchResult } from "@hype2profit/social-intelligence";

export interface SocialSearchProvider {
  provider: "mock" | "xai_grok" | "x_api" | "manual_import";
  searchPublicConversation(params: SocialSearchParams): Promise<SocialSearchResult>;
}

export class MockSocialSearchProvider implements SocialSearchProvider {
  provider: "mock" = "mock";
  async searchPublicConversation(params: SocialSearchParams): Promise<SocialSearchResult> {
    return buildMockSocialResult(params);
  }
}

export class XaiGrokSocialSearchProvider implements SocialSearchProvider {
  provider: "xai_grok" = "xai_grok";
  async searchPublicConversation(_params: SocialSearchParams): Promise<SocialSearchResult> {
    throw new Error(
      "xAI/Grok provider is configured but not implemented yet. Use mock provider or implement official API integration."
    );
  }
}

export function getSocialSearchProvider(): SocialSearchProvider {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const configured = env.SOCIAL_SEARCH_PROVIDER?.toLowerCase();
  const enabled = env.ENABLE_SOCIAL_SEARCH;
  if (configured === "xai_grok" && enabled !== "false" && env.XAI_API_KEY) {
    return new XaiGrokSocialSearchProvider();
  }
  return new MockSocialSearchProvider();
}
