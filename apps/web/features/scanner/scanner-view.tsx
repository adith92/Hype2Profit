"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Download, Eye, Plus, Radar, Search, Sparkles, X } from "lucide-react";
import type { SocialSearchResult, SocialSource } from "@hype2profit/social-intelligence";
import { SOCIAL_SOURCE_GROUPS } from "@hype2profit/social-intelligence";
import type { RuntimeModeStatus } from "@/lib/runtime-status";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { ProductSignalBadge } from "@/features/dashboard/components";
import type { ProductRecord } from "@/lib/mock-service";
import type { ScanItemRecord, ScanSessionRecord } from "@/lib/persistence";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";

type MarketplaceSource = "shopee" | "tokopedia" | "tiktok_shop";
type ScannerSource = MarketplaceSource | SocialSource;
type SocialApiResponse = {
  ok: boolean;
  provider?: string;
  source?: SocialSource;
  status?: string;
  data?: SocialSearchResult;
  error?: string;
};

type LatestScanResult = {
  data: {
    session: ScanSessionRecord | null;
    items: ScanItemRecord[];
  };
  source: "supabase" | "mock";
  warning?: string;
};

const MARKETPLACE_OPTIONS: Array<{ value: MarketplaceSource; label: string }> = [
  { value: "shopee", label: "Shopee" },
  { value: "tokopedia", label: "Tokopedia" },
  { value: "tiktok_shop", label: "TikTok Shop" }
];

const CATEGORY_OPTIONS = ["Fashion", "Beauty", "Gadget", "Home"] as const;
const DEFAULT_SOCIAL_KEYWORD_BY_CATEGORY: Record<(typeof CATEGORY_OPTIONS)[number], string> = {
  Fashion: "Tas Padel",
  Beauty: "Serum",
  Gadget: "Case iPhone",
  Home: "Rak Dapur"
};

function isSocialSource(source: ScannerSource): source is SocialSource {
  return source === "x" || source === "facebook" || source === "instagram" || source === "threads" || source === "combined_social" || source === "combined_all";
}

function isMarketplaceSource(source: ScannerSource): source is MarketplaceSource {
  return source === "shopee" || source === "tokopedia" || source === "tiktok_shop";
}

function sourceLabel(source: ScannerSource) {
  if (source === "shopee") return "Shopee";
  if (source === "tokopedia") return "Tokopedia";
  if (source === "tiktok_shop") return "TikTok Shop";
  if (source === "x") return "X";
  if (source === "facebook") return "Facebook";
  if (source === "instagram") return "Instagram";
  if (source === "threads") return "Threads";
  if (source === "combined_social") return "Gabungan Social";
  return "Gabungan Semua";
}

export function ExportCsvButton() {
  return (
    <a href="/api/exports/csv?kind=products" className="inline-flex">
      <Button>
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </a>
  );
}

export function ScannerView({ rows, latestScan, runtime }: { rows: ProductRecord[]; latestScan: LatestScanResult; runtime: RuntimeModeStatus }) {
  const router = useRouter();
  const { tableDensity, setTableDensity, setSelectedProductId, selectedProductId, setCommandPaletteOpen } = useUIStore();
  const [isPending, startTransition] = useTransition();
  const [keyword, setKeyword] = useState("");
  const [source, setSource] = useState<ScannerSource>("shopee");
  const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]>("Fashion");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSales, setMinSales] = useState("");
  const [maxSales, setMaxSales] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minStock, setMinStock] = useState("");
  const [signal, setSignal] = useState<"ALL" | "BUY_TEST" | "WATCH" | "AVOID">("ALL");
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialResult, setSocialResult] = useState<SocialApiResponse | null>(null);

  const socialKeyword = keyword || DEFAULT_SOCIAL_KEYWORD_BY_CATEGORY[category];
  const socialMode = isSocialSource(source);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (keyword && !row.title.toLowerCase().includes(keyword.toLowerCase())) return false;
        if (isMarketplaceSource(source) && row.platform !== source) return false;
        if (minPrice && row.price < Number(minPrice)) return false;
        if (maxPrice && row.price > Number(maxPrice)) return false;
        if (minSales && row.soldCount < Number(minSales)) return false;
        if (maxSales && row.soldCount > Number(maxSales)) return false;
        if (minRating && row.rating < Number(minRating)) return false;
        if (minStock && row.stockCount < Number(minStock)) return false;
        if (signal !== "ALL" && row.trend.signal !== signal) return false;
        return true;
      }),
    [rows, keyword, source, minPrice, maxPrice, minSales, maxSales, minRating, minStock, signal]
  );

  useEffect(() => {
    if (!socialMode) {
      setSocialResult(null);
      return;
    }

    let cancelled = false;
    setSocialLoading(true);

    fetch("/api/social/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        keyword: socialKeyword,
        source
      })
    })
      .then(async (response) => (await response.json()) as SocialApiResponse)
      .then((payload) => {
        if (!cancelled) setSocialResult(payload);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSocialResult({
            ok: false,
            error: error instanceof Error ? error.message : "Failed to load social signal"
          });
        }
      })
      .finally(() => {
        if (!cancelled) setSocialLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, socialKeyword, socialMode, source]);

  async function addToWatchlist(productId: string) {
    startTransition(async () => {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, notes: "Added from scanner" })
      });
      router.refresh();
    });
  }

  async function addScanItemToWatchlist(item: ScanItemRecord) {
    startTransition(async () => {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.id,
          productUrl: item.product_url,
          title: item.title,
          platform: latestScan.data.session?.marketplace ?? "shopee",
          notes: "Added from latest extension scan",
          priority: "medium",
          status: "watching"
        })
      });
      router.refresh();
    });
  }

  function resetFilters() {
    setKeyword("");
    setSource("shopee");
    setCategory("Fashion");
    setMinPrice("");
    setMaxPrice("");
    setMinSales("");
    setMaxSales("");
    setMinRating("");
    setMinStock("");
    setSignal("ALL");
    setSocialResult(null);
  }

  return (
    <div className="space-y-6">
      <Card className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <Input placeholder={socialMode ? "Keyword social / product angle..." : "Keyword produk..."} value={keyword} onChange={(event) => setKeyword(event.target.value)} />
        <select
          value={source}
          onChange={(event) => setSource(event.target.value as ScannerSource)}
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
        >
          <optgroup label="Marketplace">
            {MARKETPLACE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
          {SOCIAL_SOURCE_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as (typeof CATEGORY_OPTIONS)[number])}
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Price min" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
          <Input placeholder="Price max" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Sales min" value={minSales} onChange={(event) => setMinSales(event.target.value)} />
          <Input placeholder="Sales max" value={maxSales} onChange={(event) => setMaxSales(event.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input placeholder="Rating min" value={minRating} onChange={(event) => setMinRating(event.target.value)} />
          <Input placeholder="Stock min" value={minStock} onChange={(event) => setMinStock(event.target.value)} />
          <select
            value={signal}
            onChange={(event) => setSignal(event.target.value as typeof signal)}
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
          >
            <option value="ALL">All signal</option>
            <option value="BUY_TEST">BUY_TEST</option>
            <option value="WATCH">WATCH</option>
            <option value="AVOID">AVOID</option>
          </select>
        </div>
      </Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-cyan">Scanner</div>
          <h1 className="mt-2 text-3xl font-semibold">Product momentum, not just product list</h1>
          <div className="mt-2 text-sm text-slate-400">
            {socialMode ? `Mock social pulse aktif untuk ${sourceLabel(source)}. Keyword contoh otomatis: ${socialKeyword}.` : `${filteredRows.length} products matched current filter set`}
          </div>
          <div className="mt-2 max-w-3xl text-sm text-slate-500">
            Source sekarang: {sourceLabel(source)}. Marketplace scanner tetap visible DOM only. Source social masih mock-first, belum ada real API call.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1 lg:flex">
            <button
              onClick={() => setTableDensity("compact")}
              className={`rounded-full px-3 py-1.5 text-xs ${tableDensity === "compact" ? "bg-cyan/15 text-cyan" : "text-slate-400"}`}
            >
              Compact
            </button>
            <button
              onClick={() => setTableDensity("comfortable")}
              className={`rounded-full px-3 py-1.5 text-xs ${tableDensity === "comfortable" ? "bg-cyan/15 text-cyan" : "text-slate-400"}`}
            >
              Comfortable
            </button>
          </div>
          <Button variant="ghost" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={() => setCommandPaletteOpen(true)}>
            <Search className="mr-2 h-4 w-4" />
            {isPending ? "Updating..." : "Palette / Search"}
          </Button>
          <ExportCsvButton />
        </div>
      </div>

      <Card className="space-y-4 border-emerald/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.98))]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">Latest Extension Scan</div>
            <h2 className="mt-2 text-2xl font-semibold">Visible DOM scan terbaru dari extension</h2>
            <div className="mt-2 text-sm text-slate-400">
              Runtime source: {latestScan.source === "supabase" ? "Live Supabase" : "Demo fallback"} · Mode: {runtime.label}
            </div>
            {latestScan.warning ? <div className="mt-2 text-xs text-amber-300">{latestScan.warning}</div> : null}
          </div>
          <div className="flex gap-3">
            <a href="/api/exports/csv?kind=latest_scan">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Latest Scan
              </Button>
            </a>
          </div>
        </div>

        {latestScan.data.session ? (
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Marketplace</div>
              <div className="mt-2 text-sm text-white">{latestScan.data.session.marketplace}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Scanned At</div>
              <div className="mt-2 text-sm text-white">{formatDate(latestScan.data.session.scanned_at)}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Product Count</div>
              <div className="mt-2 text-sm text-white">{latestScan.data.session.product_count}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Source URL</div>
              <a href={latestScan.data.session.url} className="mt-2 line-clamp-2 text-sm text-cyan">
                {latestScan.data.session.url}
              </a>
            </div>
          </div>
        ) : (
          <EmptyState title="No live scan yet" description="Open extension on Shopee atau Tokopedia, jalankan scan, lalu hasil visible DOM akan muncul di sini." />
        )}

        {latestScan.data.items.length ? (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/40">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-slate-400">
                <tr>
                  {["Title", "Price", "Sold", "Rating", "Shop", "Confidence", "Link", "Action"].map((header) => (
                    <th key={header} className="px-4 py-3 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {latestScan.data.items.map((item) => (
                  <tr key={item.id} className="border-t border-white/5 text-slate-200 transition hover:bg-emerald/5">
                    <td className="px-4 py-3">{item.title ?? "-"}</td>
                    <td className="px-4 py-3">{item.price_text ?? "-"}</td>
                    <td className="px-4 py-3">{item.sold_text ?? "-"}</td>
                    <td className="px-4 py-3">{item.rating_text ?? "-"}</td>
                    <td className="px-4 py-3">{item.shop_name ?? "-"}</td>
                    <td className="px-4 py-3">{item.confidence_score ? `${Math.round(item.confidence_score * 100)}%` : "-"}</td>
                    <td className="px-4 py-3">
                      {item.product_url ? (
                        <a href={item.product_url} className="text-cyan">
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" onClick={() => addScanItemToWatchlist(item)} disabled={isPending}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Watchlist
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>

      {socialMode ? (
        <Card className="space-y-5 overflow-hidden border-cyan/20 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.96))]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan">
                <Radar className="h-3.5 w-3.5" />
                Social Signal Mode
              </div>
              <h2 className="mt-3 text-2xl font-semibold">Riset cepat untuk seller yang bergerak harian</h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                Bukan sekadar tabel produk. Source social dipakai buat baca obrolan pasar lebih dulu, lalu baru kita cek apakah momentum itu layak dibawa ke watchlist atau export.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
              <div>Source: {sourceLabel(source)}</div>
              <div>Category: {category}</div>
              <div>Keyword: {socialKeyword}</div>
              <div>Status: {socialLoading ? "Loading mock pulse..." : socialResult?.status ?? "mock"}</div>
            </div>
          </div>

          {socialLoading ? (
            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
              ))}
            </div>
          ) : null}

          {socialResult?.ok && socialResult.data ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {[
                  { label: "Social Hype", value: socialResult.data.score.socialHypeScore, tone: "text-cyan" },
                  { label: "Buyer Intent", value: socialResult.data.score.buyerIntentScore, tone: "text-emerald-300" },
                  { label: "Saturation Risk", value: socialResult.data.score.saturationRisk, tone: "text-amber-300" },
                  { label: "Controversy Risk", value: socialResult.data.score.controversyRisk, tone: "text-rose-300" },
                  { label: "Signal", value: socialResult.data.score.finalSocialSignal, tone: "text-violet-300" }
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.label}</div>
                    <div className={`mt-3 text-3xl font-semibold ${item.tone}`}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cyan">
                    <Sparkles className="h-4 w-4" />
                    Summary
                  </div>
                  <p className="mt-3 text-base leading-7 text-slate-200">{socialResult.data.summary.summary}</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Top Hashtags</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {socialResult.data.summary.topHashtags.map((hashtag) => (
                          <span key={hashtag} className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs text-cyan">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Related Keywords</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {socialResult.data.summary.relatedKeywords.map((item) => (
                          <span key={item} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Buyer Intent Signals</div>
                    <div className="mt-3 space-y-3 text-sm text-slate-200">
                      {socialResult.data.summary.buyerIntentSignals.map((item) => (
                        <div key={item} className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-3">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Risk Signals</div>
                    <div className="mt-3 space-y-3 text-sm text-slate-200">
                      {socialResult.data.summary.riskSignals.map((item) => (
                        <div key={item} className="rounded-2xl border border-rose-400/10 bg-rose-400/5 px-4 py-3">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {socialResult.data.marketplaceContext ? (
                <div className="rounded-3xl border border-violet-400/15 bg-violet-400/5 p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-violet-200">Gabungan Semua Context</div>
                  <div className="mt-4 grid gap-4 md:grid-cols-4">
                    <div>
                      <div className="text-xs text-slate-400">Matching products</div>
                      <div className="mt-2 text-2xl font-semibold text-white">{socialResult.data.marketplaceContext.matchingProducts}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Avg price</div>
                      <div className="mt-2 text-2xl font-semibold text-white">{formatCurrency(socialResult.data.marketplaceContext.averagePrice)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Avg hype</div>
                      <div className="mt-2 text-2xl font-semibold text-white">{socialResult.data.marketplaceContext.averageHypeScore}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Top platform</div>
                      <div className="mt-2 text-2xl font-semibold text-white">{socialResult.data.marketplaceContext.topPlatform}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-slate-300">{socialResult.data.marketplaceContext.note}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {socialResult.data.marketplaceContext.topSignals.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Sample Mentions</div>
                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  {socialResult.data.mentions.slice(0, 6).map((mention) => (
                    <div key={mention.id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-white">{mention.authorHandle ?? mention.platform}</div>
                        <div className="rounded-full border border-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          {mention.platform}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-200">{mention.text}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                        <span>Intent: {mention.intent}</span>
                        <span>Likes: {mention.likeCount ?? 0}</span>
                        <span>Comments: {mention.commentCount ?? 0}</span>
                        <span>Shares: {mention.shareCount ?? 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {socialResult?.ok === false ? (
            <EmptyState
              title="Social mock pulse belum kebaca"
              description={socialResult.error ?? "Coba ganti category atau keyword. Untuk sekarang semua source social masih mock-first dan tidak memanggil API eksternal."}
            />
          ) : null}
        </Card>
      ) : null}

      {!socialMode && filteredRows.length === 0 ? (
        <EmptyState
          title="Scanner returned no matches"
          description="Broaden your price, sales, or signal filter to let more candidate products flow back into the table."
        />
      ) : null}

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/60">
        <table className="min-w-[1400px] w-full text-sm">
          <thead className="bg-white/[0.04] text-slate-400">
            <tr>
              {["Image", "Title", "Platform", "Price", "Sold", "Revenue", "Rating", "Reviews", "Uploaded", "Shop", "Hype", "Profit", "Risk", "Signal", "Actions"].map((head) => (
                <th key={head} className="px-4 py-3 text-left font-medium">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr
                key={row.id}
                onMouseEnter={() => setSelectedProductId(row.id)}
                className={`border-t border-white/5 transition ${selectedProductId === row.id ? "bg-cyan/6" : "hover:bg-cyan/5"}`}
              >
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>
                  <Image src={row.imageUrl} alt={row.title} width={48} height={48} unoptimized className="h-12 w-12 rounded-2xl object-cover" />
                </td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5 text-white" : "px-4 py-3 text-white"}>
                  <div className="space-y-1">
                    <div>{row.title}</div>
                    <div className="text-xs text-slate-500">{row.category}</div>
                  </div>
                </td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5 text-slate-300" : "px-4 py-3 text-slate-300"}>{row.platform}</td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>{formatCurrency(row.price)}</td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>
                  <div className="flex items-center gap-3">
                    <span>{row.soldCount}</span>
                    <MiniSparkline
                      values={[
                        row.latestSnapshot.soldCount * 0.7,
                        row.latestSnapshot.soldCount * 0.76,
                        row.latestSnapshot.soldCount * 0.82,
                        row.latestSnapshot.soldCount * 0.9,
                        row.latestSnapshot.soldCount
                      ]}
                      tone={row.trend.signal === "BUY_TEST" ? "emerald" : row.trend.signal === "AVOID" ? "rose" : "cyan"}
                    />
                  </div>
                </td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>{formatCurrency(row.latestSnapshot.revenueEstimate)}</td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>{row.rating.toFixed(1)}</td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>{row.reviewCount}</td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>{formatDate(row.uploadedAt)}</td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>{row.shopName}</td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>{row.trend.hypeScore}</td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>{row.trend.profitScore}</td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>{row.trend.riskScore}</td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>
                  <ProductSignalBadge signal={row.trend.signal} />
                </td>
                <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3"}>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="px-3">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="px-3" onClick={() => addToWatchlist(row.id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <a href="/api/exports/csv?kind=products">
                      <Button variant="ghost" className="px-3">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
