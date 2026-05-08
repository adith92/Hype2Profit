import { NextRequest, NextResponse } from "next/server";
import { removeFromWatchlist } from "@/lib/mock-service";

export function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  return context.params.then(({ id }) => NextResponse.json({ data: removeFromWatchlist(id) }));
}
