"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, HistogramSeries, LineSeries, CandlestickSeries } from "lightweight-charts";
import type { TrendCandle } from "@hype2profit/shared";

export function ProductMomentumChart({ data }: { data: TrendCandle[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#cbd5e1"
      },
      grid: {
        vertLines: { color: "rgba(148,163,184,.08)" },
        horzLines: { color: "rgba(148,163,184,.08)" }
      },
      crosshair: { mode: 1 },
      width: ref.current.clientWidth,
      height: 360,
      rightPriceScale: { borderColor: "rgba(148,163,184,.12)" },
      timeScale: { borderColor: "rgba(148,163,184,.12)" }
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#34d399",
      downColor: "#fb7185",
      wickUpColor: "#67e8f9",
      wickDownColor: "#8b5cf6",
      borderVisible: false
    });
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: ""
    });
    const lineSeries = chart.addSeries(LineSeries, {
      color: "#67e8f9",
      lineWidth: 2
    });

    candleSeries.setData(data.map((item) => ({ time: item.time.slice(0, 10), open: item.open, high: item.high, low: item.low, close: item.close })));
    volumeSeries.setData(data.map((item) => ({ time: item.time.slice(0, 10), value: item.volume, color: item.close >= item.open ? "rgba(52,211,153,.4)" : "rgba(251,113,133,.4)" })));
    lineSeries.setData(data.map((item) => ({ time: item.time.slice(0, 10), value: item.movingAverage })));

    const resize = () => chart.applyOptions({ width: ref.current?.clientWidth ?? 0 });
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, [data]);

  return <div ref={ref} className="w-full" />;
}
