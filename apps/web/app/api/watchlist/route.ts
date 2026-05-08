import { NextRequest, NextResponse } from "next/server";
import { addToWatchlist } from "@/lib/mock-service";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { productId?: string; notes?: string };
  if (!body.productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }
  return NextResponse.json({ data: addToWatchlist(body.productId, body.notes) });
}
