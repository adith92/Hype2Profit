"use client";

import { Card } from "@/components/ui/card";
import { ProductSignalBadge } from "@/features/dashboard/components";
import { TrendHeatmap } from "@/components/charts/trend-heatmap";
import { formatCompact, formatCurrency } from "@/lib/utils";

export function TrendingView({ payload }: { payload: ReturnType<typeof import("@/lib/mock-service").getTrendingPayload> }) {
  const tabs = [
    ["Rising Fast", payload.tabs.risingFast],
    ["High Revenue", payload.tabs.highRevenue],
    ["Low Competition", payload.tabs.lowCompetition],
    ["New Uploads", payload.tabs.newUploads],
    ["Watchlist Worthy", payload.tabs.watchlistWorthy]
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.35em] text-cyan">Trending Board</div>
        <h1 className="mt-2 text-3xl font-semibold">Cari produk naik sebelum kompetitor ramai</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-400">Basic trending board ini masuk V1 sebagai pelengkap cockpit utama. Fokus utama tetap product momentum chart, scanner, competitor radar, dan visible DOM extension.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card>
          <div className="mb-4 text-xl font-semibold">Leaderboard</div>
          <div className="space-y-3">
            {payload.leaderboard.slice(0, 12).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.04] px-4 py-3">
                <div>
                  <div className="text-xs text-slate-500">#{index + 1}</div>
                  <div className="mt-1 text-sm text-white">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {item.platform} • {formatCurrency(item.price)} • {formatCompact(item.soldCount)} sold
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-cyan">{item.trend.finalScore}</div>
                  <ProductSignalBadge signal={item.trend.signal} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-4 text-xl font-semibold">Category Heatmap</div>
          <TrendHeatmap
            data={payload.leaderboard.slice(0, 20).reduce<Array<{ category: string; score: number }>>((acc, item) => {
              const found = acc.find((entry) => entry.category === item.category);
              if (found) found.score += item.trend.finalScore;
              else acc.push({ category: item.category, score: item.trend.finalScore });
              return acc;
            }, [])}
          />
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-5">
        {tabs.map(([label, items]) => (
          <Card key={label}>
            <div className="mb-3 text-sm font-medium text-cyan">{label}</div>
            <div className="space-y-3">
              {items.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/5 bg-white/[0.04] p-3">
                  <div className="text-sm text-white">{item.title}</div>
                  <div className="mt-2 text-xs text-slate-400">{item.category}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
