"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { StoreAnalysis } from "@hype2profit/shared";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CompetitorRadarCard } from "./radar-card";
import { formatCompact, formatCurrency } from "@/lib/utils";

export function CompetitorView({ analysis }: { analysis: StoreAnalysis }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-cyan">Competitor Research</div>
          <h1 className="mt-2 text-3xl font-semibold">Riset cepat untuk seller yang bergerak harian, bukan crawler besar yang susah dirawat</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-400">Competitor radar di V1 membantu membaca product mix, revenue pattern, dan upload velocity dengan visible data dan estimasi lokal.</p>
        </div>
        <div className="w-full max-w-xl">
          <Input defaultValue={analysis.store.url} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <CompetitorRadarCard label="Estimated Sales" value={formatCompact(analysis.metrics.estimatedSales)} />
        <CompetitorRadarCard label="Estimated Revenue" value={formatCurrency(analysis.metrics.estimatedRevenue)} />
        <CompetitorRadarCard label="Product Count" value={String(analysis.metrics.productCount)} />
        <CompetitorRadarCard label="Average Rating" value={analysis.metrics.averageRating.toFixed(1)} />
        <CompetitorRadarCard label="Upload Frequency" value={`${analysis.metrics.uploadFrequency}/wk`} />
        <CompetitorRadarCard label="Views Estimate" value={formatCompact(analysis.metrics.viewsEstimate)} />
      </div>
      <Card className="border-white/10 bg-white/[0.03] text-sm text-slate-400">
        Estimasi dulu, stok kemudian. Data competitor pada V1 dirancang untuk decision support, bukan sumber kebenaran absolut.
      </Card>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 text-xl font-semibold">Store revenue trend</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysis.snapshots}>
                <CartesianGrid stroke="rgba(148,163,184,.08)" />
                <XAxis dataKey="capturedAt" hide />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line dataKey="estimatedRevenue" stroke="#67e8f9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="mb-4 text-xl font-semibold">Product mix by category</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analysis.categoryMix} dataKey="value" nameKey="name" outerRadius={90} fill="#8b5cf6" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card>
          <div className="mb-4 text-xl font-semibold">Top products</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-slate-400">
                <tr>
                  {["Product", "Price", "Sold", "Revenue", "Rank", "Score"].map((head) => (
                    <th key={head} className="px-3 py-2 text-left font-medium">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analysis.topProducts.map((item) => (
                  <tr key={item.id} className="border-t border-white/5">
                    <td className="px-3 py-3">{item.title}</td>
                    <td className="px-3 py-3">{formatCurrency(item.price)}</td>
                    <td className="px-3 py-3">{item.soldCount}</td>
                    <td className="px-3 py-3">{formatCurrency(item.estimatedRevenue)}</td>
                    <td className="px-3 py-3">#{item.rank}</td>
                    <td className="px-3 py-3">{item.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <div className="mb-4 text-xl font-semibold">Product upload velocity</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.snapshots}>
                <CartesianGrid stroke="rgba(148,163,184,.08)" />
                <XAxis dataKey="capturedAt" hide />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="productCount" fill="#34d399" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
