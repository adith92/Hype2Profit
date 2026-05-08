"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Download, Eye, Plus, Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { ProductSignalBadge } from "@/features/dashboard/components";
import type { ProductRecord } from "@/lib/mock-service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";

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

export function ScannerView({ rows }: { rows: ProductRecord[] }) {
  const router = useRouter();
  const { tableDensity, setTableDensity, setSelectedProductId, selectedProductId, setCommandPaletteOpen } = useUIStore();
  const [isPending, startTransition] = useTransition();
  const [keyword, setKeyword] = useState("");
  const [platform, setPlatform] = useState<"all" | "shopee" | "tokopedia" | "tiktok_shop">("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSales, setMinSales] = useState("");
  const [maxSales, setMaxSales] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minStock, setMinStock] = useState("");
  const [signal, setSignal] = useState<"ALL" | "BUY_TEST" | "WATCH" | "AVOID">("ALL");

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (keyword && !row.title.toLowerCase().includes(keyword.toLowerCase())) return false;
        if (platform !== "all" && row.platform !== platform) return false;
        if (minPrice && row.price < Number(minPrice)) return false;
        if (maxPrice && row.price > Number(maxPrice)) return false;
        if (minSales && row.soldCount < Number(minSales)) return false;
        if (maxSales && row.soldCount > Number(maxSales)) return false;
        if (minRating && row.rating < Number(minRating)) return false;
        if (minStock && row.stockCount < Number(minStock)) return false;
        if (signal !== "ALL" && row.trend.signal !== signal) return false;
        return true;
      }),
    [rows, keyword, platform, minPrice, maxPrice, minSales, maxSales, minRating, minStock, signal]
  );

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

  function resetFilters() {
    setKeyword("");
    setPlatform("all");
    setMinPrice("");
    setMaxPrice("");
    setMinSales("");
    setMaxSales("");
    setMinRating("");
    setMinStock("");
    setSignal("ALL");
  }

  return (
    <div className="space-y-6">
      <Card className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Input placeholder="Keyword produk..." value={keyword} onChange={(event) => setKeyword(event.target.value)} />
        <select
          value={platform}
          onChange={(event) => setPlatform(event.target.value as typeof platform)}
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
        >
          <option value="all">Shopee + Tokopedia</option>
          <option value="shopee">Shopee</option>
          <option value="tokopedia">Tokopedia</option>
          <option value="tiktok_shop" disabled>
            TikTok Shop (Phase 2 placeholder)
          </option>
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
          <h1 className="mt-2 text-3xl font-semibold">Riset produk seperti trader membaca market</h1>
          <div className="mt-2 text-sm text-slate-400">{filteredRows.length} products matched current filter set</div>
          <div className="mt-2 max-w-3xl text-sm text-slate-500">Fokus V1: Shopee dulu, Tokopedia kedua, TikTok Shop placeholder untuk Phase 2. Visible DOM only, no bypass.</div>
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
      {filteredRows.length === 0 ? (
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
