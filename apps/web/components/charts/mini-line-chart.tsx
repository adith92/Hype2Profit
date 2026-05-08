"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";

export function MiniLineChart({ values }: { values: number[] }) {
  return (
    <div className="h-12 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={values.map((value, index) => ({ index, value }))}>
          <Line type="monotone" dataKey="value" stroke="#67e8f9" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
