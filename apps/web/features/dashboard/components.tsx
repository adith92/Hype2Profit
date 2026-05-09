"use client";

import { motion } from "framer-motion";
import { BellRing, Eye, Flame, ShieldAlert, Star } from "lucide-react";
import Link from "next/link";
import type { ProductRecord } from "@/lib/mock-service";
import type { LatestScanPayload } from "@/lib/persistence";
import type { RuntimeModeStatus } from "@/lib/runtime-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendHeatmap } from "@/components/charts/trend-heatmap";
import { ProductMomentumChart } from "@/components/charts/product-momentum-chart";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { formatCompact, formatCurrency } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

export function ProductSearchBar() {
  return <Input placeholder="Cari keyword, toko, atau kategori..." data-command-search="true" className="max-w-xl" />;
}

export function PlatformFilter() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="default" className="h-10">
        Shopee First
      </Button>
      <Button variant="ghost" className="h-10">
        Tokopedia Secondary
      </Button>
      <Button variant="ghost" className="h-10 opacity-70">
        All
      </Button>
      <Button variant="ghost" className="h-10 cursor-not-allowed opacity-45">
        TikTok Shop Phase 2
      </Button>
    </div>
  );
}

export function DateRangeFilter() {
  return <Input type="text" defaultValue="30 hari terakhir" className="max-w-[180px]" />;
}

export function AnimatedMetricCard({
  label,
  value,
  hint,
  icon: Icon
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Flame;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6, scale: 1.01 }}>
      <Card className="group relative overflow-hidden border-white/10 bg-white/[0.06] transition hover:border-cyan/30 hover:shadow-glow">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,232,249,.12),transparent_30%)] opacity-0 transition group-hover:opacity-100"
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</div>
            <motion.div className="mt-3 text-3xl font-semibold text-white" initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
              {value}
            </motion.div>
            <div className="mt-2 text-sm text-slate-400">{hint}</div>
          </div>
          <div className="rounded-2xl border border-cyan/20 bg-cyan/10 p-3 text-cyan">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function ProductSignalBadge({ signal }: { signal: ProductRecord["trend"]["signal"] }) {
  const styles =
    signal === "BUY_TEST"
      ? "border-emerald/30 bg-emerald/10 text-emerald shadow-[0_0_24px_rgba(52,211,153,.2)]"
      : signal === "AVOID"
        ? "border-rose-400/30 bg-rose-400/10 text-rose-300 shadow-[0_0_20px_rgba(251,113,133,.14)]"
        : "border-cyan/30 bg-cyan/10 text-cyan shadow-[0_0_20px_rgba(103,232,249,.15)]";
  return (
    <motion.div animate={{ scale: [1, 1.035, 1] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
      <Badge className={styles}>{signal}</Badge>
    </motion.div>
  );
}

export function BreakoutAlertTicker({ alerts }: { alerts: string[] }) {
  return (
    <Card className="overflow-hidden border-violet/20 bg-violet/10">
      <div className="mb-3 flex items-center gap-2 text-sm text-violet-200">
        <BellRing className="h-4 w-4" />
        Breakout Alerts
      </div>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-3 text-sm text-slate-200"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {[...alerts, ...alerts].map((alert, index) => (
            <div key={`${alert}-${index}`} className="min-w-max rounded-2xl border border-white/5 bg-white/[0.04] px-3 py-2">
              {alert}
            </div>
          ))}
        </motion.div>
      </div>
    </Card>
  );
}

export function WatchlistPanel({ items }: { items: ProductRecord[] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
        <Star className="h-4 w-4 text-cyan" />
        Watchlist
      </div>
      <div className="space-y-3">
        {items.slice(0, 5).map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/5 bg-white/[0.04] p-3">
            <div className="text-sm font-medium text-white">{item.title}</div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>{item.shopName}</span>
              <ProductSignalBadge signal={item.trend.signal} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ProductTable({ rows }: { rows: ProductRecord[] }) {
  const { tableDensity, setSelectedProductId } = useUIStore();

  if (rows.length === 0) {
    return <EmptyState title="No market pulse yet" description="When products match your current scope, the cockpit table will stream ranked opportunities here." />;
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/50">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/[0.04] text-slate-400">
          <tr>
            {["Title", "Platform", "Price", "Sold", "Revenue", "Rating", "Signal"].map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 10).map((row) => (
            <motion.tr
              key={row.id}
              onHoverStart={() => setSelectedProductId(row.id)}
              className="border-t border-white/5 text-slate-200 transition hover:bg-cyan/5"
            >
              <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3.5"}>{row.title}</td>
              <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3.5"}>{row.platform}</td>
              <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3.5"}>{formatCurrency(row.price)}</td>
              <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3.5"}>
                <div className="flex items-center gap-3">
                  <span>{formatCompact(row.soldCount)}</span>
                  <MiniSparkline
                    values={[
                      row.latestSnapshot.viewsEstimate * 0.62,
                      row.latestSnapshot.viewsEstimate * 0.78,
                      row.latestSnapshot.viewsEstimate * 0.71,
                      row.latestSnapshot.viewsEstimate * 0.86,
                      row.latestSnapshot.viewsEstimate
                    ]}
                    tone={row.trend.signal === "BUY_TEST" ? "emerald" : row.trend.signal === "AVOID" ? "rose" : "cyan"}
                  />
                </div>
              </td>
              <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3.5"}>{formatCurrency(row.latestSnapshot.revenueEstimate)}</td>
              <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3.5"}>{row.rating.toFixed(1)}</td>
              <td className={tableDensity === "compact" ? "px-4 py-2.5" : "px-4 py-3.5"}>
                <ProductSignalBadge signal={row.trend.signal} />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TopTrendingProducts({ items }: { items: ProductRecord[] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
        <Flame className="h-4 w-4 text-emerald" />
        Top Trending Products
      </div>
      <div className="space-y-3">
        {items.slice(0, 5).map((item, index) => (
          <div key={item.id} className="rounded-2xl border border-white/5 bg-white/[0.04] p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">#{index + 1}</div>
              <div className="text-xs text-cyan">{item.trend.finalScore} score</div>
            </div>
            <div className="mt-2 text-sm font-medium text-white">{item.title}</div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{formatCurrency(item.price)}</span>
              <span>{formatCompact(item.soldCount)} sold</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function DashboardView({
  payload,
  latestScan,
  runtime
}: {
  payload: ReturnType<typeof import("@/lib/mock-service").getDashboardPayload>;
  latestScan: { data: LatestScanPayload; source: "supabase" | "mock"; warning?: string };
  runtime: RuntimeModeStatus;
}) {
  const { tableDensity, setTableDensity } = useUIStore();

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-cyan">TradingView For Marketplace Product Research Indonesia</div>
            <h1 className="mt-2 text-3xl font-semibold text-white">Temukan Hype sebelum viral. Hitung Profit sebelum stok. Hindari rugi sebelum checkout.</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-400">Bukan sekadar tabel produk. Lihat momentum barang seperti market chart dan baca peluang produk seperti trader membaca market.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ProductSearchBar />
            <PlatformFilter />
            <DateRangeFilter />
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
          {latestScan.source === "supabase" && latestScan.data.session
            ? `Live scan data connected. Session terbaru dari ${latestScan.data.session.marketplace} dengan ${latestScan.data.session.product_count} item siap dibaca dari cockpit.`
            : "No live scans yet. Open extension on Shopee/Tokopedia and run scan. Dashboard tetap pakai fallback mock yang diberi label jujur."}
          <span className="ml-2 text-xs text-slate-500">Mode: {runtime.label}</span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AnimatedMetricCard label="Total Products Scanned" value={String(payload.kpis.totalProductsScanned)} hint="Visible pipeline hari ini" icon={Eye} />
        <AnimatedMetricCard label="Hot Products" value={String(payload.kpis.hotProducts)} hint="Signal BUY_TEST aktif" icon={Flame} />
        <AnimatedMetricCard label="Average Hype Score" value={`${payload.kpis.averageHypeScore}`} hint="Momentum rata-rata" icon={Star} />
        <AnimatedMetricCard label="Revenue Opportunity" value={formatCurrency(payload.kpis.estimatedRevenueOpportunity)} hint="Akumulasi snapshot terakhir" icon={BellRing} />
        <AnimatedMetricCard label="Risk Alerts" value={String(payload.kpis.riskAlerts)} hint="Produk perlu audit cepat" icon={ShieldAlert} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <Card className="border-cyan/20">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-cyan">Search Momentum</div>
              <div className="mt-1 text-xl font-semibold">TradingView-style trend candles</div>
            </div>
            <Button variant="outline">Realtime pulse</Button>
          </div>
          {payload.candles.length ? <ProductMomentumChart data={payload.candles} /> : <Skeleton className="h-[360px] w-full" />}
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-400">
            Product momentum, not just product list. Semua volume, sales, dan revenue pada V1 adalah estimasi berbasis mock atau visible DOM capture dan bukan data resmi marketplace.
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Trade Thesis</div>
              <div className="mt-1 text-sm text-white">Cari produk naik sebelum kompetitor ramai.</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Risk Lens</div>
              <div className="mt-1 text-sm text-white">Hindari rugi sebelum checkout dengan signal stack.</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Profit Lens</div>
              <div className="mt-1 text-sm text-white">Estimasi dulu, stok kemudian.</div>
            </div>
          </div>
        </Card>
        <div className="space-y-6">
          <TopTrendingProducts items={payload.records} />
          <BreakoutAlertTicker alerts={payload.breakoutAlerts} />
          <WatchlistPanel items={payload.records.filter((record) => record.trend.signal !== "AVOID")} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-semibold">Product Heatmap</div>
            <Link href="/trending" className="text-sm text-cyan">
              Explore leaderboard
            </Link>
          </div>
          <TrendHeatmap data={payload.categoryHeatmap} />
        </Card>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-semibold">Scanner Result Overview</div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
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
          </div>
          <ProductTable rows={payload.records} />
        </div>
      </section>
    </div>
  );
}
