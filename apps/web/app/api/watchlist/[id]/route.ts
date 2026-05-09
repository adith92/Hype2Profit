import { NextRequest, NextResponse } from "next/server";
import { removeWatchlistItem } from "@/lib/persistence";

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const data = await removeWatchlistItem(id);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to delete watchlist item" }, { status: 500 });
  }
}
