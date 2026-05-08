import type {
  MarketplacePlatform,
  Product,
  ProductSnapshot,
  Store,
  StoreSnapshot,
  TrendScore
} from "./types";

const categories = [
  "Beauty",
  "Fashion",
  "Aksesori HP",
  "Home Living",
  "Gadget",
  "Mom & Baby",
  "Otomotif",
  "Pet Supplies",
  "Kitchen Tools"
] as const;

const titleSeeds = {
  Beauty: ["Serum Glass Skin Niacinamide", "Lip Cream Transferproof", "Masker Wajah Collagen Glow"],
  Fashion: ["Kemeja Linen Oversize Premium", "Celana Cargo Wanita Stretch", "Hijab Pashmina Crinkle"],
  "Aksesori HP": ["Holder Magnet Mobil 360", "Kabel Fast Charging Braided", "Case iPhone Magsafe Matte"],
  "Home Living": ["Rak Serbaguna Minimalis", "Lampu Tidur Sensor Kayu", "Vacuum Storage Bag Set"],
  Gadget: ["Smartwatch AMOLED Sport", "TWS ENC Gaming Low Latency", "Mini Projector Android"],
  "Mom & Baby": ["Sterilizer Botol Portable", "Mainan Edukasi Busy Book", "Pompa ASI Handsfree"],
  Otomotif: ["Dashcam Full HD Wide Angle", "Parfum Mobil Diffuser", "Pompa Ban Portable Digital"],
  "Pet Supplies": ["Pasir Kucing Clumping Premium", "Feeder Otomatis Smart Bowl", "Vitamin Bulu Anjing Kucing"],
  "Kitchen Tools": ["Pisau Dapur Jepang 8 Inch", "Air Fryer Silicone Liner", "Chopper Elektrik Mini"]
} as const;

const shopPrefixes = ["Toko", "Gudang", "Sentra", "Pusat", "Rumah", "Official"];
const cities = ["Jakarta", "Bandung", "Surabaya", "Semarang", "Yogyakarta", "Medan", "Makassar"];
const keywords = ["viral", "laris", "grosir", "premium", "hemat", "reseller"];

const platforms: MarketplacePlatform[] = ["shopee", "tiktok_shop", "tokopedia"];

const now = new Date("2026-05-07T10:00:00.000Z").getTime();

const id = (prefix: string, index: number) => `${prefix}_${String(index).padStart(3, "0")}`;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const platformLabel = (platform: MarketplacePlatform) =>
  platform === "shopee" ? "Shopee" : platform === "tokopedia" ? "Tokopedia" : "TikTok Shop";

export const mockProducts: Product[] = Array.from({ length: 90 }, (_, index) => {
  const category = categories[index % categories.length];
  const platform = platforms[index % platforms.length];
  const variant = titleSeeds[category][index % titleSeeds[category].length];
  const keyword = keywords[index % keywords.length];
  const price = 19000 + ((index * 13791) % 420000);
  const soldCount = 24 + ((index * 97) % 6400);
  const rating = clamp(4 + ((index % 10) - 2) * 0.11, 3.6, 5);
  const reviewCount = 18 + ((index * 59) % 7200);
  const stockCount = 12 + ((index * 23) % 540);
  const uploadOffset = (index % 40) * 86400000;
  const title = `${variant} ${keyword} ${platformLabel(platform)} ${index + 1}`;
  const shopName = `${shopPrefixes[index % shopPrefixes.length]} ${cities[index % cities.length]} ${category.replace(/\s+/g, "")}`;

  return {
    id: id("prod", index + 1),
    platform,
    externalId: `ext-${platform}-${index + 1}`,
    title,
    url: `https://example.com/${platform}/product/${index + 1}`,
    imageUrl: `https://placehold.co/480x480/111827/67e8f9?text=${encodeURIComponent(category)}`,
    category,
    price,
    originalPrice: Math.round(price * (1.08 + (index % 4) * 0.05)),
    rating: Number(rating.toFixed(1)),
    reviewCount,
    soldCount,
    stockCount,
    shopName,
    shopUrl: `https://example.com/${platform}/shop/${index + 1}`,
    uploadedAt: new Date(now - uploadOffset).toISOString(),
    scrapedAt: new Date(now - (index % 7) * 3600000).toISOString()
  };
});

export const mockProductSnapshots: ProductSnapshot[] = mockProducts.flatMap((product, pIndex) =>
  Array.from({ length: 12 }, (_, sIndex) => {
    const baseSold = product.soldCount - 260 + sIndex * (8 + (pIndex % 9));
    const views = 900 + pIndex * 33 + sIndex * 120;
    const revenue = Math.round(product.price * Math.max(baseSold, 1) * 0.18);
    return {
      id: `${product.id}_snap_${sIndex + 1}`,
      productId: product.id,
      searchKeyword: keywords[pIndex % keywords.length],
      price: product.price - (sIndex % 2) * 1500,
      rating: product.rating,
      reviewCount: product.reviewCount - 120 + sIndex * 14,
      soldCount: Math.max(baseSold, 0),
      stockCount: Math.max(product.stockCount - sIndex * 3, 0),
      viewsEstimate: views,
      revenueEstimate: revenue,
      rankPosition: 1 + ((pIndex + sIndex) % 25),
      capturedAt: new Date(now - (12 - sIndex) * 86400000).toISOString()
    };
  })
);

export const mockStores: Store[] = Array.from({ length: 18 }, (_, index) => ({
  id: id("store", index + 1),
  platform: platforms[index % platforms.length],
  externalId: `store-${index + 1}`,
  name: `${shopPrefixes[index % shopPrefixes.length]} ${cities[index % cities.length]} Official`,
  url: `https://example.com/store/${index + 1}`,
  rating: Number(clamp(4.1 + (index % 6) * 0.12, 4.1, 4.9).toFixed(1)),
  followerCount: 1300 + index * 940,
  productCount: 24 + (index % 8) * 18
}));

export const mockStoreSnapshots: StoreSnapshot[] = mockStores.flatMap((store, index) =>
  Array.from({ length: 8 }, (_, sIndex) => ({
    id: `${store.id}_snapshot_${sIndex + 1}`,
    storeId: store.id,
    estimatedSales: 180 + index * 22 + sIndex * 17,
    estimatedRevenue: 14000000 + index * 1300000 + sIndex * 560000,
    viewsEstimate: 11000 + index * 420 + sIndex * 190,
    productCount: store.productCount - 5 + sIndex,
    rating: store.rating,
    capturedAt: new Date(now - (8 - sIndex) * 86400000 * 5).toISOString()
  }))
);

export const mockTrendScores: TrendScore[] = mockProducts.map((product, index) => {
  const hypeScore = clamp(58 + (index % 11) * 3.2, 0, 98);
  const profitScore = clamp(42 + (index % 9) * 4.3, 0, 95);
  const riskScore = clamp(22 + (index % 7) * 5.4, 0, 93);
  const finalScore = Number((hypeScore * 0.45 + profitScore * 0.35 - riskScore * 0.2 + 20).toFixed(1));
  const signal = riskScore >= 65 || profitScore < 35 ? "AVOID" : hypeScore > 75 && profitScore > 60 && riskScore < 45 ? "BUY_TEST" : hypeScore > 60 && riskScore < 65 ? "WATCH" : "WATCH";
  return {
    id: `${product.id}_trend`,
    productId: product.id,
    hypeScore: Number(hypeScore.toFixed(1)),
    profitScore: Number(profitScore.toFixed(1)),
    riskScore: Number(riskScore.toFixed(1)),
    finalScore,
    signal,
    reasons: [
      `Momentum ${hypeScore > 75 ? "menanjak kuat" : "stabil"}`,
      `Margin ${profitScore > 60 ? "cukup sehat" : "perlu validasi supplier"}`,
      `Risk ${riskScore < 45 ? "terkendali" : "butuh monitoring"}`
    ],
    calculatedAt: new Date(now - (index % 3) * 3600000).toISOString()
  };
});
