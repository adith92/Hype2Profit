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
        summary: `${summaryPrefix} Live provider belum diaktifkan, jadi response tetap pakai sampled mock signal untuk menjaga safety dan determinisme.`
      }
    };
  }

  // Intentionally internal only; never return this through API responses.
  getMaskedDiagnostics(): ProviderDiagnostics {
    return this.diagnostics;
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

  if (env.configuredProvider === "x_api" && env.xBearerToken && source === "x") {
    return new SourceMockProvider({ provider: "x_api", source, status: "limited_mock" });
  }

  return buildMockProviderForSource(source);
}
