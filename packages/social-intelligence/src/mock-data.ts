import type { SocialMention, SocialPlatform, SocialSearchParams, SocialSearchResult, SocialSource } from "./types";
import { withComputedSocialScore } from "./scoring";

type MentionTemplate = {
  text: string;
  publishedAt: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount?: number;
  sentiment: SocialMention["sentiment"];
  intent: SocialMention["intent"];
  hashtags: string[];
  keywords: string[];
};

type MockScenario = {
  buyerIntentSignals: string[];
  riskSignals: string[];
  topHashtags: string[];
  relatedKeywords: string[];
  summary: string;
  mentions: MentionTemplate[];
};

const DEFAULT_SAMPLED_AT = "2026-05-09T00:00:00.000Z";

const SCENARIOS: Record<string, MockScenario> = {
  "fashion::tas padel": {
    buyerIntentSignals: [
      "Fashion + sports crossover lagi naik buat daily lifestyle seller.",
      "Buyer banyak cari tas padel yang masih oke dipakai ke gym atau commute."
    ],
    riskSignals: [
      "Trend bisa cepat padat kalau desain semua mirip impor.",
      "Kalau positioning terlalu niche, demand bisa pendek umur."
    ],
    topHashtags: ["#taspadel", "#padelbag", "#athleisure", "#gymbagaesthetic"],
    relatedKeywords: ["tas padel", "padel bag", "racket bag", "sporty bag", "gym bag aesthetic", "athleisure"],
    summary:
      "Tas padel lagi kebaca sebagai crossover fashion-sports. Momentum datang dari gaya hidup activewear dan kebutuhan tas fungsional yang tetap clean secara visual.",
    mentions: [
      {
        text: "Tas padel model clean + muat raket, masuk juga buat gym bag aesthetic.",
        publishedAt: "2026-05-08T09:00:00.000Z",
        likeCount: 210,
        commentCount: 34,
        shareCount: 16,
        viewCount: 5600,
        sentiment: "positive",
        intent: "trend",
        hashtags: ["#taspadel", "#gymbagaesthetic", "#athleisure"],
        keywords: ["tas padel", "gym bag aesthetic", "athleisure"]
      },
      {
        text: "Cari padel bag affordable tapi tetap stylish buat daily commute.",
        publishedAt: "2026-05-08T12:00:00.000Z",
        likeCount: 142,
        commentCount: 29,
        shareCount: 8,
        viewCount: 4100,
        sentiment: "positive",
        intent: "buying",
        hashtags: ["#padelbag", "#sportyfashion"],
        keywords: ["padel bag", "sporty bag", "affordable"]
      },
      {
        text: "Kalau brand lokal bisa bikin raket bag yang ringan + nggak norak, ini bisa rame sih.",
        publishedAt: "2026-05-08T15:00:00.000Z",
        likeCount: 96,
        commentCount: 18,
        shareCount: 6,
        viewCount: 2800,
        sentiment: "positive",
        intent: "asking",
        hashtags: ["#racketbag", "#lokalbrand"],
        keywords: ["racket bag", "brand lokal", "ringan"]
      }
    ]
  },
  "beauty::serum": {
    buyerIntentSignals: [
      "Buyer lagi ngebandingin brightening serum yang cepat kasih hasil.",
      "Review-before-buy kuat, terutama untuk klaim calming dan barrier repair."
    ],
    riskSignals: [
      "Kategori serum jenuh dan gampang masuk price war.",
      "Kalau klaim terlalu tinggi tanpa proof, backlash review bisa cepat."
    ],
    topHashtags: ["#serumwajah", "#glowingskin", "#barrierrepair", "#skincarelokal"],
    relatedKeywords: ["serum", "serum brightening", "serum barrier", "serum calming", "skincare lokal", "serum glow"],
    summary:
      "Serum tetap ramai, tapi buyer makin sensitif ke value dan bukti hasil. Yang menang bukan cuma hype, tapi positioning formula + trust cue yang jelas.",
    mentions: [
      {
        text: "Serum yang calming tapi nggak lengket sekarang lebih dicari daripada yang cuma janji glowing.",
        publishedAt: "2026-05-08T08:30:00.000Z",
        likeCount: 264,
        commentCount: 41,
        shareCount: 22,
        viewCount: 6800,
        sentiment: "positive",
        intent: "reviewing",
        hashtags: ["#serumwajah", "#barrierrepair"],
        keywords: ["serum calming", "barrier repair", "tidak lengket"]
      },
      {
        text: "Ada rekomendasi serum under 80k yang bikin kulit lebih tenang?",
        publishedAt: "2026-05-08T10:45:00.000Z",
        likeCount: 188,
        commentCount: 53,
        shareCount: 11,
        viewCount: 5200,
        sentiment: "neutral",
        intent: "asking",
        hashtags: ["#skincarelokal", "#serumunder100k"],
        keywords: ["serum under 80k", "serum lokal", "kulit tenang"]
      },
      {
        text: "Serum viral banyak, tapi buyer sekarang lebih cerewet soal ingredients list.",
        publishedAt: "2026-05-08T13:10:00.000Z",
        likeCount: 117,
        commentCount: 26,
        shareCount: 7,
        viewCount: 3100,
        sentiment: "neutral",
        intent: "trend",
        hashtags: ["#ingredientcheck", "#serumviral"],
        keywords: ["ingredients list", "serum viral", "buyer skincare"]
      }
    ]
  },
  "gadget::case iphone": {
    buyerIntentSignals: [
      "Demand stabil dari buyer yang cari case tipis tapi tetap premium look.",
      "Model magsafe-look dan anti-yellowing masih sering masuk wishlist."
    ],
    riskSignals: [
      "Kompetisi tinggi dan gampang kebanting harga.",
      "Desain cepat basi kalau telat ikut warna/model baru."
    ],
    topHashtags: ["#caseiphone", "#magsafecase", "#iphoneaccessories", "#cleancase"],
    relatedKeywords: ["case iphone", "magsafe case", "clear case", "case anti yellow", "case premium", "iphone accessories"],
    summary:
      "Case iPhone bukan kategori meledak, tapi konsisten cari volume. Yang menarik justru angle desain premium, magsafe-look, dan anti-yellow yang kasih alasan upgrade.",
    mentions: [
      {
        text: "Case iPhone yang tipis tapi nggak murahan look-nya masih susah dicari.",
        publishedAt: "2026-05-08T09:20:00.000Z",
        likeCount: 173,
        commentCount: 19,
        shareCount: 9,
        viewCount: 4700,
        sentiment: "positive",
        intent: "buying",
        hashtags: ["#caseiphone", "#cleancase"],
        keywords: ["case iphone tipis", "premium look", "clean case"]
      },
      {
        text: "Yang penting clear case-nya nggak cepat kuning dan tombol masih enak dipencet.",
        publishedAt: "2026-05-08T11:40:00.000Z",
        likeCount: 146,
        commentCount: 23,
        shareCount: 5,
        viewCount: 3900,
        sentiment: "positive",
        intent: "reviewing",
        hashtags: ["#caseantiyellow", "#iphoneaccessories"],
        keywords: ["anti yellow", "iphone accessories", "tombol empuk"]
      },
      {
        text: "Seller case iPhone banyak banget, jadi diferensiasi desain penting kalau mau naik.",
        publishedAt: "2026-05-08T14:30:00.000Z",
        likeCount: 88,
        commentCount: 14,
        shareCount: 4,
        viewCount: 2100,
        sentiment: "neutral",
        intent: "trend",
        hashtags: ["#magsafecase", "#jualancase"],
        keywords: ["magsafe case", "diferensiasi desain", "seller case"]
      }
    ]
  },
  "home::rak dapur": {
    buyerIntentSignals: [
      "Konten before-after dapur kecil masih narik buyer intent tinggi.",
      "Produk yang kelihatan bikin dapur lebih rapi cepat masuk keranjang ide."
    ],
    riskSignals: [
      "Kategori home gampang padat kalau bentuk dan ukuran terlalu generik.",
      "Kalau material tipis, review jelek bisa langsung nurunin trust."
    ],
    topHashtags: ["#rakdapur", "#dapurrapi", "#organizerdapur", "#rumahminimalis"],
    relatedKeywords: ["rak dapur", "organizer dapur", "rak bumbu", "storage kitchen", "dapur rapi", "rumah minimalis"],
    summary:
      "Rak dapur kuat di visual transformation. Buyer tertarik saat produk kelihatan langsung merapikan ruang sempit tanpa ribet pasang.",
    mentions: [
      {
        text: "Rak dapur slim yang langsung bikin counter lebih rapi itu paling gampang viral di konten rumah.",
        publishedAt: "2026-05-08T07:50:00.000Z",
        likeCount: 231,
        commentCount: 28,
        shareCount: 18,
        viewCount: 6200,
        sentiment: "positive",
        intent: "trend",
        hashtags: ["#rakdapur", "#dapurrapi"],
        keywords: ["rak dapur slim", "counter rapi", "konten rumah"]
      },
      {
        text: "Ada yang punya rekomendasi rak bumbu yang kuat tapi nggak makan tempat?",
        publishedAt: "2026-05-08T10:15:00.000Z",
        likeCount: 154,
        commentCount: 37,
        shareCount: 9,
        viewCount: 4300,
        sentiment: "neutral",
        intent: "asking",
        hashtags: ["#rakbumbu", "#organizerdapur"],
        keywords: ["rak bumbu", "kuat", "tidak makan tempat"]
      },
      {
        text: "Home storage rame terus, tapi material tipis langsung dibantai review jelek.",
        publishedAt: "2026-05-08T16:20:00.000Z",
        likeCount: 102,
        commentCount: 21,
        shareCount: 6,
        viewCount: 2500,
        sentiment: "negative",
        intent: "complaining",
        hashtags: ["#homestorage", "#reviewjelek"],
        keywords: ["material tipis", "review jelek", "home storage"]
      }
    ]
  }
};

const DEFAULT_SCENARIO: MockScenario = {
  buyerIntentSignals: [
    "Ada buyer intent ringan, tapi butuh angle produk yang lebih spesifik.",
    "Konten social lebih cocok dipakai sebagai validasi awal, bukan keputusan akhir."
  ],
  riskSignals: [
    "Data ini masih mock/sample, jadi jangan dibaca sebagai volume real.",
    "Topik bisa terlihat ramai tapi belum tentu convert di marketplace."
  ],
  topHashtags: ["#productresearch", "#marketpulse", "#hype2profit"],
  relatedKeywords: ["marketplace research", "product signal", "trend validation"],
  summary: "Belum ada skenario mock khusus untuk keyword ini, jadi sistem kasih social baseline generik buat eksplorasi awal.",
  mentions: [
    {
      text: "Masih tahap eksplorasi. Cek lagi demand dan angle produk sebelum anggap ini momentum nyata.",
      publishedAt: "2026-05-08T10:00:00.000Z",
      likeCount: 64,
      commentCount: 9,
      shareCount: 3,
      viewCount: 1400,
      sentiment: "neutral",
      intent: "other",
      hashtags: ["#productresearch"],
      keywords: ["exploration", "demand check"]
    }
  ]
};

const SOURCE_TO_PLATFORMS: Record<SocialSource, SocialPlatform[]> = {
  x: ["x"],
  facebook: ["facebook"],
  instagram: ["instagram"],
  threads: ["threads"],
  combined_social: ["x", "instagram", "facebook", "threads"],
  combined_all: ["x", "instagram", "facebook", "threads"]
};

const SOURCE_TO_STATUS: Record<SocialSource, SocialSearchResult["providerStatus"]> = {
  x: "mock",
  facebook: "limited_mock",
  instagram: "limited_mock",
  threads: "limited_mock",
  combined_social: "limited_mock",
  combined_all: "limited_mock"
};

function normalizeKey(category: string, keyword: string) {
  return `${category.trim().toLowerCase()}::${keyword.trim().toLowerCase()}`;
}

function getScenario(category: string, keyword: string) {
  return SCENARIOS[normalizeKey(category, keyword)] ?? DEFAULT_SCENARIO;
}

function resolveSource(params: SocialSearchParams): SocialSource {
  if (params.source) return params.source;
  if (params.platform && params.platform !== "all" && params.platform !== "mock") {
    if (params.platform === "x" || params.platform === "facebook" || params.platform === "instagram" || params.platform === "threads") {
      return params.platform;
    }
  }
  return "combined_social";
}

function platformHandle(platform: SocialPlatform) {
  if (platform === "x") return "@marketpulseid";
  if (platform === "instagram") return "@trendcart.id";
  if (platform === "facebook") return "Market Pulse Indo";
  if (platform === "threads") return "@sellerwire.id";
  return "@hype2profit";
}

function buildMentions(templates: MentionTemplate[], source: SocialSource): SocialMention[] {
  const platforms = SOURCE_TO_PLATFORMS[source];
  return templates.flatMap((template, templateIndex) =>
    platforms.map((platform, platformIndex) => ({
      id: `sm_${source}_${templateIndex + 1}_${platformIndex + 1}`,
      platform,
      authorName: platformHandle(platform),
      authorHandle: platformHandle(platform),
      text: template.text,
      url: `https://example.com/${platform}/mock/${source}/${templateIndex + 1}`,
      publishedAt: template.publishedAt,
      likeCount: template.likeCount + platformIndex * 11,
      commentCount: template.commentCount + platformIndex * 3,
      shareCount: template.shareCount + platformIndex * 2,
      viewCount: (template.viewCount ?? 0) + platformIndex * 350,
      sentiment: template.sentiment,
      intent: template.intent,
      hashtags: template.hashtags,
      keywords: template.keywords
    }))
  );
}

export function buildMockSocialResult(params: SocialSearchParams): SocialSearchResult {
  const source = resolveSource(params);
  const scenario = getScenario(params.category, params.keyword);
  const mentions = buildMentions(scenario.mentions, source);
  const positive = mentions.filter((mention) => mention.sentiment === "positive").length;
  const negative = mentions.filter((mention) => mention.sentiment === "negative").length;
  const neutral = mentions.length - positive - negative;

  return withComputedSocialScore({
    params: { ...params, source },
    mentions,
    providerStatus: SOURCE_TO_STATUS[source],
    summary: {
      keyword: params.keyword,
      category: params.category,
      totalMentions: mentions.length,
      sentimentBreakdown: { positive, neutral, negative },
      topHashtags: scenario.topHashtags,
      relatedKeywords: scenario.relatedKeywords,
      buyerIntentSignals: scenario.buyerIntentSignals,
      riskSignals: scenario.riskSignals,
      summary: scenario.summary,
      sampledAt: DEFAULT_SAMPLED_AT
    }
  });
}
