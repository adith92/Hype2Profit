import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Free", price: "50 scans/day", note: "Limited export" },
  { name: "Basic", price: "Rp99.000/bulan", note: "For daily seller research" },
  { name: "Pro", price: "Rp249.000/bulan", note: "For intensive product operators" },
  { name: "Enterprise", price: "Rp499.000+/bulan", note: "For teams and incubators" }
];

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-white/10 bg-slate-950/60 p-6">
        <div className="text-xs uppercase tracking-[0.35em] text-cyan">Pricing</div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Coming Soon pricing for decision-oriented marketplace cockpit</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-400">Bukan pricing scraper clone. Packaging ini dirancang untuk seller yang butuh keputusan harian berbasis momentum, profit, dan risk signal.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.name} className="border-white/10 bg-white/[0.04]">
            <div className="text-sm uppercase tracking-[0.25em] text-cyan">{plan.name}</div>
            <div className="mt-4 text-3xl font-semibold text-white">{plan.price}</div>
            <div className="mt-2 text-sm text-slate-400">{plan.note}</div>
            <div className="mt-6 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-200">Coming Soon</div>
          </Card>
        ))}
      </div>
      <Card className="border-cyan/20 bg-cyan/5">
        <div className="text-lg font-semibold text-white">No payment in V1</div>
        <p className="mt-2 text-sm text-slate-300">Won't V1: payment, creator matching, social radar, scraper farm, dan TikTok deep analytics. Fokusnya adalah TradingView for Marketplace Product Research Indonesia, bukan all-in-one scraping platform.</p>
        <p className="mt-2 text-sm text-slate-400">Temukan Hype sebelum viral. Hitung Profit sebelum stok. Hindari rugi sebelum checkout.</p>
        <Link href="/dashboard" className="mt-5 inline-flex">
          <Button>Open Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
