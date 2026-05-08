"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Download, Trash2 } from "lucide-react";
import type { ReturnTypeGetWatchlist } from "./watchlist-view.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductSignalBadge } from "@/features/dashboard/components";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function WatchlistView({ items }: { items: ReturnTypeGetWatchlist }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localItems, setLocalItems] = useState(items);

  async function removeItem(id: string) {
    setLocalItems((current) => current.filter((item) => item.id !== id));
    startTransition(async () => {
      await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-cyan">Watchlist</div>
          <h1 className="mt-2 text-3xl font-semibold">Produk incaran yang siap dipantau dan diekspor</h1>
        </div>
        <a href="/api/exports/csv?kind=watchlist">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Watchlist
          </Button>
        </a>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {localItems.map((item) => (
          <Card key={item.id}>
            <Image src={item.imageUrl} alt={item.title} width={480} height={208} unoptimized className="h-52 w-full rounded-2xl object-cover" />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-white">{item.title}</div>
                <div className="mt-1 text-sm text-slate-400">{item.notes || "Belum ada catatan"}</div>
              </div>
              <ProductSignalBadge signal={item.trend.signal} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div>Price: {formatCurrency(item.price)}</div>
              <div>Sales: {item.soldCount}</div>
              <div>Rating: {item.rating.toFixed(1)}</div>
              <div>Captured: {formatDate(item.latestSnapshot.capturedAt)}</div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={() => removeItem(item.id)} disabled={isPending}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </Card>
        ))}
        {localItems.length === 0 ? (
          <Card className="xl:col-span-3">
            <div className="py-12 text-center text-slate-400">Watchlist kosong. Tambahkan produk dari scanner untuk mulai memantau.</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
