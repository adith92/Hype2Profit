import { NextRequest, NextResponse } from "next/server";
import { addWatchlistItem, getWatchlistItems } from "@/lib/persistence";

export async function GET() {
  const data = await getWatchlistItems();
  return NextResponse.json({ ok: true, data });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    productId?: string;
    productUrl?: string;
    title?: string;
    platform?: string;
    notes?: string;
    priority?: "low" | "normal" | "high";
    status?: "active" | "archived";
  };
  if (!body.productId && !body.productUrl) {
    return NextResponse.json({ ok: false, error: "productId or productUrl is required" }, { status: 400 });
  }
  try {
    const data = await addWatchlistItem(body as Record<string, unknown>);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to add watchlist item" }, { status: 500 });
  }
}
