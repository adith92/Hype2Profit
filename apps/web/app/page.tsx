import Link from "next/link";
import { Activity, ArrowUpRight, Download, Radar, ScanSearch, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Product Momentum Chart",
    body: "Lihat momentum barang seperti market chart, bukan sekadar list SKU.",
    icon: TrendingUp
  },
  {
    title: "Competitor Radar",
    body: "Baca pola revenue, upload velocity, dan mix kategori toko kompetitor.",
    icon: Radar
  },
  {
    title: "Chrome Extension Scanner",
    body: "Visible DOM scanner untuk Shopee dan Tokopedia tanpa private API.",
    icon: ScanSearch
  },
  {
    title: "CSV Export",
    body: "Bawa hasil riset ke workflow tim, supplier, atau analisis internal.",
    icon: Download
  },
  {
    title: "Risk Signal",
    body: "BUY_TEST, WATCH, dan AVOID untuk seller yang bergerak harian.",
    icon: Activity
  }
];

export default function LandingPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[34px] border border-white/10 bg-slate-950/65 p-6 lg:p-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="max-w-4xl">
          <div className="text-xs uppercase tracking-[0.4em] text-cyan">TradingView For Marketplace Product Research Indonesia</div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white lg:text-6xl">
            Temukan Hype sebelum viral.
            <br />
            Hitung Profit sebelum stok.
            <br />
            Hindari rugi sebelum checkout.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            Product momentum, not just product list. Riset produk seperti trader membaca market, dengan Shopee-first cockpit, Tokopedia second lane, dan visible DOM scanner yang dibangun aman.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button>Open Dashboard</Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline">Install Extension</Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-400">
            <span>Bukan sekadar tabel produk.</span>
            <span>•</span>
            <span>Cari produk naik sebelum kompetitor ramai.</span>
            <span>•</span>
            <span>Estimasi dulu, stok kemudian.</span>
          </div>
        </div>
          <div className="rounded-3xl border border-cyan/20 bg-white/[0.04] p-5">
            <div className="text-xs uppercase tracking-[0.3em] text-cyan">Decision Cockpit Preview</div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Momentum Window</span>
                <span>30D</span>
              </div>
              <svg viewBox="0 0 480 160" className="mt-4 h-40 w-full">
                <defs>
                  <linearGradient id="hero-line" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                <path d="M20 128 L80 104 L122 110 L170 78 L212 84 L258 58 L302 66 L348 44 L390 48 L452 24" fill="none" stroke="url(#hero-line)" strokeWidth="5" strokeLinecap="round" />
                {[
                  [80, 104],
                  [170, 78],
                  [258, 58],
                  [348, 44],
                  [452, 24]
                ].map(([x, y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#67e8f9" />
                ))}
              </svg>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Signal Stack</span>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-emerald-200">BUY_TEST bias</span>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                <span>Temukan Hype sebelum viral</span>
                <ArrowUpRight className="h-4 w-4 text-cyan" />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                <span>Hitung Profit sebelum stok</span>
                <ArrowUpRight className="h-4 w-4 text-cyan" />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                <span>Hindari rugi sebelum checkout</span>
                <ArrowUpRight className="h-4 w-4 text-cyan" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="border-white/10 bg-white/[0.04]">
              <div className="rounded-2xl border border-cyan/20 bg-cyan/10 p-3 text-cyan w-fit">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-5 text-lg font-semibold text-white">{feature.title}</div>
              <p className="mt-2 text-sm text-slate-400">{feature.body}</p>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card className="border-cyan/20 bg-cyan/5">
          <div className="text-xs uppercase tracking-[0.35em] text-cyan">Built Safely</div>
          <h2 className="mt-3 text-2xl font-semibold text-white">Visible DOM scanner, no auto checkout, no bypass</h2>
          <p className="mt-3 text-sm text-slate-300">
            Hype2Profit V1 bukan all-in-one scraper. Extension hanya membaca data yang terlihat di browser user, tidak bypass captcha, tidak bypass login, tidak hit private API, dan tidak mengambil data personal pembeli.
          </p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-400">
            Semua angka sales, revenue, views, dan risk signal pada V1 adalah estimasi untuk riset keputusan, bukan data resmi marketplace.
          </div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-[0.35em] text-emerald">Phase 1 Focus</div>
          <h2 className="mt-3 text-2xl font-semibold text-white">Riset cepat untuk seller yang bergerak harian</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>Chrome Extension visible DOM scanner</li>
            <li>Product search + filters</li>
            <li>Competitor store analysis</li>
            <li>TradingView-style product dashboard</li>
            <li>Watchlist + CSV export + premium mock data fallback</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
