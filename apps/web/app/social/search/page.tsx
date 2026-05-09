"use client";

import { useState } from "react";
import type { SocialSearchResult, SocialSource, SocialTimeframe } from "@hype2profit/social-intelligence";
import { SOCIAL_SOURCE_GROUPS } from "@hype2profit/social-intelligence";

type SocialResponse = {
  ok: boolean;
  provider?: string;
  source?: SocialSource;
  status?: string;
  data?: SocialSearchResult;
  error?: string;
};

const PRESET_KEYWORDS: Record<string, string> = {
  Fashion: "Tas Padel",
  Beauty: "Serum",
  Gadget: "Case iPhone",
  Home: "Rak Dapur"
};

export default function SocialSearchPage() {
  const [category, setCategory] = useState("Fashion");
  const [keyword, setKeyword] = useState("Tas Padel");
  const [timeframe, setTimeframe] = useState<SocialTimeframe>("7d");
  const [source, setSource] = useState<SocialSource>("combined_social");
  const [result, setResult] = useState<SocialResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/social/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, keyword, timeframe, source })
    });
    const payload = (await response.json()) as SocialResponse;
    setResult(payload);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-6xl p-6 text-slate-100">
      <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_40%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-6 shadow-[0_30px_120px_rgba(8,47,73,0.35)]">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.3em] text-cyan">Social Search</div>
          <h1 className="mt-3 text-4xl font-semibold">Cari obrolan pasar sebelum produk keburu penuh</h1>
          <p className="mt-3 text-slate-400">
            Ini fondasi mock-first untuk source social. Belum ada real API call, tapi struktur source, provider, dan summary sudah siap buat ngedorong riset yang lebih visual dan decision-oriented.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select
            value={category}
            onChange={(event) => {
              const nextCategory = event.target.value;
              setCategory(nextCategory);
              setKeyword(PRESET_KEYWORDS[nextCategory] ?? nextCategory);
            }}
            className="rounded-2xl border border-white/10 bg-slate-950/70 p-3"
          >
            {Object.keys(PRESET_KEYWORDS).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3" placeholder="Keyword" />
          <select value={timeframe} onChange={(event) => setTimeframe(event.target.value as SocialTimeframe)} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
          </select>
          <select value={source} onChange={(event) => setSource(event.target.value as SocialSource)} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
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
          <button disabled={loading} className="rounded-2xl bg-cyan px-4 py-3 font-medium text-slate-950 md:col-span-2 xl:col-span-4">
            {loading ? "Loading mock pulse..." : "Search Social Signal"}
          </button>
        </form>

        {result?.ok && result.data ? (
          <section className="mt-8 space-y-5">
            <div className="grid gap-4 md:grid-cols-5">
              {[
                ["Social Hype", result.data.score.socialHypeScore],
                ["Buyer Intent", result.data.score.buyerIntentScore],
                ["Marketplace Fit", result.data.score.marketplaceFitScore],
                ["Saturation Risk", result.data.score.saturationRisk],
                ["Controversy Risk", result.data.score.controversyRisk]
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-cyan">Summary</div>
                <p className="mt-3 text-base leading-7 text-slate-200">{result.data.summary.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {result.data.summary.topHashtags.map((item) => (
                    <span key={item} className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs text-cyan">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {result.data.summary.relatedKeywords.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Provider</div>
                <div className="mt-3 text-lg text-white">{result.provider}</div>
                <div className="mt-2 text-sm text-slate-400">Source: {result.source}</div>
                <div className="mt-2 text-sm text-slate-400">Status: {result.status}</div>
                <div className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">Buyer Intent Signals</div>
                <div className="mt-3 space-y-2">
                  {result.data.summary.buyerIntentSignals.map((item) => (
                    <div key={item} className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-3 py-2 text-sm text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Sample Mentions</div>
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {result.data.mentions.slice(0, 6).map((mention) => (
                  <div key={mention.id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-white">{mention.authorHandle ?? mention.platform}</div>
                      <div className="rounded-full border border-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">{mention.platform}</div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{mention.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {result?.ok === false ? <p className="mt-4 text-sm text-rose-300">{result.error}</p> : null}
      </div>
    </main>
  );
}
