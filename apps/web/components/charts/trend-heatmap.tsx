"use client";

import { ResponsiveContainer, Tooltip, Treemap } from "recharts";

export function TrendHeatmap({ data }: { data: Array<{ category: string; score: number }> }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap data={data} dataKey="score" nameKey="category" stroke="rgba(255,255,255,.08)" fill="#67e8f9">
          <Tooltip contentStyle={{ background: "#08111f", border: "1px solid rgba(103,232,249,.15)" }} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}
