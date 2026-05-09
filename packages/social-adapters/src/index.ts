import { buildMockSocialResult, type SocialProviderId, type SocialProviderStatus, type SocialSearchParams, type SocialSearchResult, type SocialSource } from "@hype2profit/social-intelligence";
import { mockProducts, mockTrendScores } from "@hype2profit/shared";

export interface SocialSearchProvider {
  provider: SocialProviderId;
  source: SocialSource;
  status: SocialProviderStatus;
  search(params: SocialSearchParams): Promise<SocialSearchResult>;
}

type ProviderEnv = {
  enabled: boolean;
  configuredProvider: string | undefined;
  xaiApiKey: string | undefined;
  xBearerToken: string | undefined;
};

type ProviderDiagnostics = {
  hasXaiApiKey: boolean;
  hasXBearerToken: boolean;
  maskedXaiApiKey: string | null;
  maskedXBearerToken: string | null;
};

type XRecentSearchResponse = {
  data?: Array<{
    id: string;
    text: string;
    author_id?: string;
    created_at?: string;
    public_metrics?: {
      like_count?: number;
      reply_count?: number;
      retweet_count?: number;
      quote_count?: number;
      impression_count?: number;
    };
  }>;
  includes?: {
    users?: Array<{
      id: string;
      name?: string;
      username?: string;
    }>;
  };
  errors?: Array<{
    title?: string;
    detail?: string;
    status?: number;
  }>;
  meta?: {
    result_count?: number;
  };
};

export function maskToken(token: string | undefined): string | null {
  if (!token) return null;
  if (token.length <= 10) return `${token.slice(0, 3)}...${token.slice(-2)}`;
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

function readProviderEnv(): ProviderEnv {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  return {
    enabled: env.ENABLE_SOCIAL_SEARCH !== "false",
    configuredProvider: env.SOCIAL_SEARCH_PROVIDER?.toLowerCase(),
    xaiApiKey: env.XAI_API_KEY,
    xBearerToken: env.X_BEARER_TOKEN
  };
}

export function getSocialProviderDiagnostics(): ProviderDiagnostics {
  const env = readProviderEnv();
  return {
    hasXaiApiKey: Boolean(env.xaiApiKey),
    hasXBearerToken: Boolean(env.xBearerToken),
    maskedXaiApiKey: maskToken(env.xaiApiKey),
    maskedXBearerToken: maskToken(env.xBearerToken)
  };
}

function buildFallbackSummary(result: SocialSearchResult, providerLabel: string, reason: string, status: SocialProviderStatus): SocialSearchResult {
  return {
    ...result,
    providerStatus: status,
    summary: {
      ...result.summary,
      summary: `${providerLabel} fallback aktif. ${reason} Social result tetap pakai sampled mock signal supaya riset tetap jalan tanpa bikin flow crash.`
    }
  };
}

class SourceMockProvider implements SocialSearchProvider {
  provider: SocialProviderId;
  source: SocialSource;
  status: SocialProviderStatus;

  constructor(input: { provider: SocialProviderId; source: SocialSource; status: SocialProviderStatus }) {
    this.provider = input.provider;
    this.source = input.source;
    this.status = input.status;
  }

  async search(params: SocialSearchParams): Promise<SocialSearchResult> {
    return buildMockSocialResult({ ...params, source: this.source });
  }
}

export class MockSocialSearchProvider extends SourceMockProvider {
  constructor(source: SocialSource = "combined_social") {
    super({ provider: "mock", source, status: source === "x" ? "mock" : "limited_mock" });
  }
}

export class XaiGrokSocialSearchProvider implements SocialSearchProvider {
  provider: SocialProviderId = "xai_grok";
  source: SocialSource;
  status: SocialProviderStatus;
  private readonly env: ProviderEnv;
  private readonly diagnostics: ProviderDiagnostics;

  constructor(source: SocialSource, env: ProviderEnv = readProviderEnv()) {
    this.source = source;
    this.env = env;
    this.diagnostics = getSocialProviderDiagnostics();
    this.status = env.xaiApiKey ? "limited_mock" : "planned";
  }

  async search(params: SocialSearchParams): Promise<SocialSearchResult> {
    const fallback = buildMockSocialResult({ ...params, source: this.source });

    if (!this.env.enabled || !this.env.xaiApiKey) {
      return fallback;
    }

    const summaryPrefix =
      this.source === "x" || this.source === "combined_social" || this.source === "combined_all"
        ? this.env.xBearerToken
          ? "Env provider siap: XAI + X token terbaca."
          : "Env provider siap sebagian: XAI key ada, X token belum ada."
        : "Env provider siap: XAI key terbaca.";

    return {
      ...fallback,
      providerStatus: "limited_mock",
      summary: {
        ...fallback.summary,
        summary: `${summaryPrefix} Live provider belum diaktifkan penuh, jadi response tetap pakai sampled mock signal untuk menjaga safety dan determinisme.`
      }
    };
  }

  getMaskedDiagnostics(): ProviderDiagnostics {
    return this.diagnostics;
  }
}

export class XApiSocialSearchProvider implements SocialSearchProvider {
  provider: SocialProviderId = "x_api";
  source: SocialSource;
  status: SocialProviderStatus = "limited_mock";
  private readonly env: ProviderEnv;

  constructor(source: SocialSource, env: ProviderEnv = readProviderEnv()) {
    this.source = source;
    this.env = env;
  }

  async search(params: SocialSearchParams): Promise<SocialSearchResult> {
    const fallback = buildMockSocialResult({ ...params, source: this.source === "x" ? "x" : "combined_social" });

    if (!this.env.enabled || !this.env.xBearerToken) {
      return buildFallbackSummary(fallback, "X API", "Bearer token belum tersedia di runtime.", "limited_mock");
    }

    try {
      const query = `${params.keyword} lang:id -is:retweet`;
      const url = new URL("https://api.x.com/2/tweets/search/recent");
      url.searchParams.set("query", query);
      url.searchParams.set("max_results", "10");
      url.searchParams.set("tweet.fields", "author_id,created_at,public_metrics");
      url.searchParams.set("expansions", "author_id");
      url.searchParams.set("user.fields", "name,username");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.env.xBearerToken}`
        },
        cache: "no-store"
      });

      if (!response.ok) {
        const reason =
          response.status === 401
            ? "Auth X API ditolak."
            : response.status === 403
              ? "Tier atau permission X API belum cukup."
              : response.status === 429
                ? "Rate limit X API kena."
                : `Request X API gagal dengan status ${response.status}.`;
        return buildFallbackSummary(fallback, "X API", reason, "limited_mock");
      }

      const payload = (await response.json()) as XRecentSearchResponse;
      if (!payload.data?.length) {
        return buildFallbackSummary(fallback, "X API", "Recent Search tidak mengembalikan post yang relevan.", "limited_mock");
      }

      const userMap = new Map((payload.includes?.users ?? []).map((user) => [user.id, user]));
      const liveMentions = payload.data.map((post) => {
        const user = post.author_id ? userMap.get(post.author_id) : undefined;
        const metrics = post.public_metrics;
        return {
          id: post.id,
          platform: "x" as const,
          authorName: user?.name,
          authorHandle: user?.username ? `@${user.username}` : undefined,
          text: post.text,
          url: `https://x.com/${user?.username ?? "i"}/status/${post.id}`,
          publishedAt: post.created_at ?? new Date().toISOString(),
          likeCount: metrics?.like_count ?? 0,
          commentCount: metrics?.reply_count ?? 0,
          shareCount: (metrics?.retweet_count ?? 0) + (metrics?.quote_count ?? 0),
          viewCount: metrics?.impression_count,
          sentiment: "neutral" as const,
          intent: "trend" as const,
          hashtags: fallback.summary.topHashtags,
          keywords: fallback.summary.relatedKeywords
        };
      });

      return {
        ...fallback,
        params: { ...params, source: this.source },
        mentions:
          this.source === "combined_social" || this.source === "combined_all"
            ? [...liveMentions, ...fallback.mentions.filter((mention) => mention.platform !== "x")]
            : liveMentions,
        providerStatus: "limited_mock",
        summary: {
          ...fallback.summary,
          totalMentions: liveMentions.length,
          summary: "X Recent Search aktif dengan hasil live terbatas. Social summary masih digabung dengan heuristik mock supaya aman dipakai walau tier/coverage X bisa berubah."
        }
      };
    } catch {
      return buildFallbackSummary(fallback, "X API", "Request live error atau network tidak tersedia.", "limited_mock");
    }
  }
}

function resolveSource(params?: Pick<SocialSearchParams, "source" | "platform">): SocialSource {
  if (params?.source) return params.source;
  if (params?.platform === "x" || params?.platform === "facebook" || params?.platform === "instagram" || params?.platform === "threads") {
    return params.platform;
  }
  return "combined_social";
}

function attachMarketplaceContext(result: SocialSearchResult): SocialSearchResult {
  const keyword = result.params.keyword.toLowerCase();
  const category = result.params.category.toLowerCase();
  const matchingProducts = mockProducts.filter(
    (product) => product.title.toLowerCase().includes(keyword) || product.category.toLowerCase().includes(category)
  );

  if (matchingProducts.length === 0) {
    return {
      ...result,
      marketplaceContext: {
        matchingProducts: 0,
        averagePrice: 0,
        averageHypeScore: 0,
        topPlatform: "mixed",
        topSignals: ["Belum ada sampel marketplace yang match penuh untuk keyword ini."],
        note: "Gabungan Semua masih pakai fallback mock. Marketplace context dihitung dari katalog demo Hype2Profit."
      }
    };
  }

  const totalPrice = matchingProducts.reduce((sum, product) => sum + product.price, 0);
  const signalMap = matchingProducts
    .map((product) => ({ product, trend: mockTrendScores.find((trend) => trend.productId === product.id) }))
    .filter((entry): entry is { product: (typeof matchingProducts)[number]; trend: (typeof mockTrendScores)[number] } => Boolean(entry.trend));
  const averageHypeScore = Math.round(signalMap.reduce((sum, entry) => sum + entry.trend.hypeScore, 0) / signalMap.length);
  const platformCount = matchingProducts.reduce<Record<string, number>>((accumulator, product) => {
    accumulator[product.platform] = (accumulator[product.platform] ?? 0) + 1;
    return accumulator;
  }, {});
  const topPlatformEntry = Object.entries(platformCount).sort((left, right) => right[1] - left[1])[0];
  const topSignals = signalMap
    .sort((left, right) => right.trend.finalScore - left.trend.finalScore)
    .slice(0, 3)
    .map((entry) => `${entry.product.title} ${entry.trend.signal} (${entry.trend.finalScore})`);

  return {
    ...result,
    marketplaceContext: {
      matchingProducts: matchingProducts.length,
      averagePrice: Math.round(totalPrice / matchingProducts.length),
      averageHypeScore: Number.isFinite(averageHypeScore) ? averageHypeScore : 0,
      topPlatform:
        topPlatformEntry?.[0] === "shopee" || topPlatformEntry?.[0] === "tokopedia" || topPlatformEntry?.[0] === "tiktok_shop"
          ? topPlatformEntry[0]
          : "mixed",
      topSignals,
      note: "Gabungan Semua menggabungkan mock social buzz dengan snapshot marketplace demo. Semua angka tetap estimasi."
    }
  };
}

function buildMockProviderForSource(source: SocialSource): SocialSearchProvider {
  if (source === "x") return new SourceMockProvider({ provider: "mock", source, status: "mock" });
  if (source === "instagram") return new SourceMockProvider({ provider: "meta_instagram", source, status: "limited_mock" });
  if (source === "facebook") return new SourceMockProvider({ provider: "meta_facebook", source, status: "limited_mock" });
  if (source === "threads") return new SourceMockProvider({ provider: "threads", source, status: "limited_mock" });
  if (source === "combined_social") return new SourceMockProvider({ provider: "mock", source, status: "limited_mock" });

  return {
    provider: "mock",
    source,
    status: "limited_mock",
    async search(searchParams: SocialSearchParams) {
      return attachMarketplaceContext(buildMockSocialResult({ ...searchParams, source }));
    }
  };
}

export function getSocialSearchProvider(params?: Pick<SocialSearchParams, "source" | "platform">): SocialSearchProvider {
  const env = readProviderEnv();
  const source = resolveSource(params);

  if (!env.enabled) {
    return buildMockProviderForSource(source);
  }

  if (env.configuredProvider === "xai_grok" && env.xaiApiKey) {
    return new XaiGrokSocialSearchProvider(source, env);
  }

  if (env.configuredProvider === "x_api" && env.xBearerToken && (source === "x" || source === "combined_social" || source === "combined_all")) {
    return new XApiSocialSearchProvider(source, env);
  }

  return buildMockProviderForSource(source);
}
