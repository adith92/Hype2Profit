"use client";

export function MiniSparkline({
  values,
  tone = "cyan"
}: {
  values: number[];
  tone?: "cyan" | "emerald" | "rose";
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const color = tone === "emerald" ? "#34d399" : tone === "rose" ? "#fb7185" : "#67e8f9";
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="h-10 w-24 overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
