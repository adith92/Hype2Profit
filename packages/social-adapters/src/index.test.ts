import { afterEach, describe, expect, it, vi } from "vitest";
import { MockSocialSearchProvider, XApiSocialSearchProvider, XaiGrokSocialSearchProvider, getSocialProviderDiagnostics, getSocialSearchProvider, maskToken } from "./index";

const originalEnv = {
  ENABLE_SOCIAL_SEARCH: process.env.ENABLE_SOCIAL_SEARCH,
  SOCIAL_SEARCH_PROVIDER: process.env.SOCIAL_SEARCH_PROVIDER,
  XAI_API_KEY: process.env.XAI_API_KEY,
  X_BEARER_TOKEN: process.env.X_BEARER_TOKEN
};

afterEach(() => {
  process.env.ENABLE_SOCIAL_SEARCH = originalEnv.ENABLE_SOCIAL_SEARCH;
  process.env.SOCIAL_SEARCH_PROVIDER = originalEnv.SOCIAL_SEARCH_PROVIDER;
  process.env.XAI_API_KEY = originalEnv.XAI_API_KEY;
  process.env.X_BEARER_TOKEN = originalEnv.X_BEARER_TOKEN;
  vi.restoreAllMocks();
});

describe("social adapters", () => {
  it("MockSocialSearchProvider returns deterministic result", async () => {
    const provider = new MockSocialSearchProvider("x");
    const result = await provider.search({ category: "Fashion", keyword: "Tas Padel", source: "x" });
    expect(result.summary.relatedKeywords).toContain("tas padel");
    expect(result.mentions.every((mention) => mention.platform === "x")).toBe(true);
  });

  it("getSocialSearchProvider defaults to mock", () => {
    const provider = getSocialSearchProvider();
    expect(provider.provider).toBe("mock");
  });

  it("combined social provider uses grouped mock sources", async () => {
    const provider = getSocialSearchProvider({ source: "combined_social" });
    const result = await provider.search({ category: "Fashion", keyword: "Tas Padel", source: "combined_social" });
    expect(result.mentions.some((mention) => mention.platform === "x")).toBe(true);
    expect(result.mentions.some((mention) => mention.platform === "instagram")).toBe(true);
  });

  it("combined all provider attaches marketplace context", async () => {
    const provider = getSocialSearchProvider({ source: "combined_all" });
    const result = await provider.search({ category: "Beauty", keyword: "Serum", source: "combined_all" });
    expect(result.marketplaceContext?.matchingProducts).toBeGreaterThanOrEqual(0);
    expect(result.marketplaceContext?.note).toContain("estimasi");
  });

  it("masks tokens in diagnostics", () => {
    expect(maskToken("abcdef1234567890")).toBe("abcdef...7890");
    expect(maskToken(undefined)).toBeNull();
  });

  it("uses xai env provider when configured and falls back to mock-shaped result", async () => {
    process.env.ENABLE_SOCIAL_SEARCH = "true";
    process.env.SOCIAL_SEARCH_PROVIDER = "xai_grok";
    process.env.XAI_API_KEY = "abcdef1234567890";
    process.env.X_BEARER_TOKEN = "zyxwvu9876543210";

    const provider = getSocialSearchProvider({ source: "x" });
    expect(provider.provider).toBe("xai_grok");

    const result = await provider.search({ category: "Fashion", keyword: "Tas Padel", source: "x" });
    expect(result.summary.summary).toContain("Env provider siap");
    expect(result.mentions.every((mention) => mention.platform === "x")).toBe(true);
  });

  it("exposes masked diagnostics only", () => {
    process.env.XAI_API_KEY = "abcdef1234567890";
    process.env.X_BEARER_TOKEN = "zyxwvu9876543210";
    const diagnostics = getSocialProviderDiagnostics();
    expect(diagnostics.maskedXaiApiKey).toBe("abcdef...7890");
    expect(diagnostics.maskedXBearerToken).toBe("zyxwvu...3210");
  });

  it("falls back to mock provider when env is missing", () => {
    delete process.env.XAI_API_KEY;
    delete process.env.X_BEARER_TOKEN;
    process.env.ENABLE_SOCIAL_SEARCH = "true";
    process.env.SOCIAL_SEARCH_PROVIDER = "xai_grok";

    const provider = getSocialSearchProvider({ source: "combined_social" });
    expect(provider.provider).toBe("mock");
  });

  it("xai provider never exposes raw token through public result", async () => {
    const provider = new XaiGrokSocialSearchProvider("x", {
      enabled: true,
      configuredProvider: "xai_grok",
      xaiApiKey: "abcdef1234567890",
      xBearerToken: "zyxwvu9876543210"
    });

    const result = await provider.search({ category: "Fashion", keyword: "Tas Padel", source: "x" });
    expect(result.summary.summary).not.toContain("abcdef1234567890");
    expect(result.summary.summary).not.toContain("zyxwvu9876543210");
  });

  it("x api provider falls back safely on permission failure", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 403
    });
    vi.stubGlobal("fetch", fetchMock);

    const provider = new XApiSocialSearchProvider("x", {
      enabled: true,
      configuredProvider: "x_api",
      xaiApiKey: undefined,
      xBearerToken: "zyxwvu9876543210"
    });

    const result = await provider.search({ category: "Fashion", keyword: "Tas Padel", source: "x" });
    expect(result.providerStatus).toBe("limited_mock");
    expect(result.summary.summary).toContain("Tier atau permission X API belum cukup");
  });

  it("x api provider can combine live x posts with fallback social mix", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "tweet-1",
            text: "Tas padel lagi naik banget minggu ini",
            author_id: "user-1",
            created_at: "2026-05-09T02:00:00.000Z",
            public_metrics: { like_count: 10, reply_count: 2, retweet_count: 1, quote_count: 0, impression_count: 120 }
          }
        ],
        includes: {
          users: [{ id: "user-1", username: "marketwatchid", name: "Market Watch ID" }]
        }
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const provider = new XApiSocialSearchProvider("combined_social", {
      enabled: true,
      configuredProvider: "x_api",
      xaiApiKey: undefined,
      xBearerToken: "zyxwvu9876543210"
    });

    const result = await provider.search({ category: "Fashion", keyword: "Tas Padel", source: "combined_social" });
    expect(result.mentions.some((mention) => mention.authorHandle === "@marketwatchid")).toBe(true);
    expect(result.summary.summary).toContain("X Recent Search aktif");
  });
});
