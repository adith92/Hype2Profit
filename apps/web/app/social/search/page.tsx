"use client";

import { useState } from "react";

type SocialResponse = {
  ok: boolean;
  provider?: string;
  data?: any;
  error?: string;
};

export default function SocialSearchPage() {
  const [category, setCategory] = useState("Fashion");
  const [keyword, setKeyword] = useState("Tas Padel");
  const [timeframe, setTimeframe] = useState("7d");
  const [platform, setPlatform] = useState("all");
  const [result, setResult] = useState<SocialResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/social/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, keyword, timeframe, platform })
    });
    const payload = (await response.json()) as SocialResponse;
    setResult(payload);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-5xl p-6 text-slate-100">
      <h1 className="text-3xl font-semibold">Social Signal Search</h1>
      <p className="mt-2 text-slate-400">Cari apa yang lagi dibicarakan di sosial media berdasarkan kategori dan keyword produk.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3 md:grid-cols-2">
        <input value={category} onChange={(event) => setCategory(event.target.value)} className="rounded bg-slate-900 p-3" placeholder="Category" />
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="rounded bg-slate-900 p-3" placeholder="Keyword" />
        <select value={timeframe} onChange={(event) => setTimeframe(event.target.value)} className="rounded bg-slate-900 p-3">
          <option value="24h">24h</option><option value="7d">7d</option><option value="30d">30d</option>
        </select>
        <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="rounded bg-slate-900 p-3">
          <option value="all">All</option><option value="x">X</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="mock">Mock</option>
        </select>
        <button disabled={loading} className="rounded bg-cyan-500 px-4 py-2 font-medium text-slate-900 md:col-span-2">{loading ? "Loading..." : "Search Social Signal"}</button>
      </form>

      {result?.ok && result.data ? (
        <section className="mt-8 space-y-3 rounded border border-slate-800 bg-slate-950 p-4">
          <div className="text-sm text-cyan-400">Provider: {result.provider}</div>
          <div className="text-lg">{result.data.summary.summary}</div>
          <div>SocialHypeScore: {result.data.score.socialHypeScore}</div>
          <div>BuyerIntentScore: {result.data.score.buyerIntentScore}</div>
          <div>MarketplaceFitScore: {result.data.score.marketplaceFitScore}</div>
          <div>SaturationRisk: {result.data.score.saturationRisk}</div>
          <div>ControversyRisk: {result.data.score.controversyRisk}</div>
          <div>Top hashtags: {result.data.summary.topHashtags.join(", ")}</div>
          <div>Related keywords: {result.data.summary.relatedKeywords.join(", ")}</div>
        </section>
      ) : null}
      {result?.ok === false ? <p className="mt-4 text-red-400">{result.error}</p> : null}
    </main>
  );
}
