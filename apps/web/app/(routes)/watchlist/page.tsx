import { WatchlistView } from "@/features/watchlist/watchlist-view";
import type { ReturnTypeGetWatchlist } from "@/features/watchlist/watchlist-view.types";
import { ensureDemoWatchlistSeeded } from "@/lib/mock-service";
import { getWatchlistItems } from "@/lib/persistence";
import { formatCurrency, formatDate } from "@/lib/utils";

function normalizeWatchlistItems(input: unknown[]): ReturnTypeGetWatchlist {
  return input.map((item, index) => {
    const record = item as Record<string, unknown>;
    const hasMockShape = "trend" in record && "latestSnapshot" in record;

    if (hasMockShape) {
      const mock = record as Record<string, unknown> & {
        id: string;
        title: string;
        notes?: string;
        imageUrl: string;
        price: number;
        soldCount: number;
        rating: number;
        latestSnapshot: { capturedAt: string };
        trend: { signal: "BUY_TEST" | "WATCH" | "AVOID" };
      };

      return {
        id: mock.id,
        title: mock.title,
        notes: mock.notes,
        imageUrl: mock.imageUrl,
        signal: mock.trend.signal,
        priceLabel: formatCurrency(mock.price),
        salesLabel: String(mock.soldCount),
        ratingLabel: mock.rating.toFixed(1),
        capturedAtLabel: formatDate(mock.latestSnapshot.capturedAt)
      };
    }

    return {
      id: String(record.id ?? record.product_id ?? record.product_url ?? `watch-${index}`),
      title: String(record.title ?? "Watchlist item"),
      notes: typeof record.notes === "string" ? record.notes : null,
      imageUrl: "https://placehold.co/640x360/020617/22d3ee?text=Hype2Profit",
      signal: record.status === "avoid" ? "AVOID" : record.priority === "high" ? "BUY_TEST" : "WATCH",
      priceLabel: typeof record.product_url === "string" ? "From extension scan" : "Manual item",
      salesLabel: typeof record.platform === "string" ? record.platform : "-",
      ratingLabel: typeof record.status === "string" ? record.status : "-",
      capturedAtLabel: formatDate(String(record.created_at ?? new Date().toISOString()))
    };
  });
}

export default async function WatchlistPage() {
  const result = await getWatchlistItems();
  const fallback = ensureDemoWatchlistSeeded();
  const items = normalizeWatchlistItems((result.data as unknown[])?.length ? (result.data as unknown[]) : fallback);

  return <WatchlistView items={items} />;
}
