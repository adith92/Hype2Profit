import { NextRequest, NextResponse } from "next/server";
import { getTrendingPayload } from "@/lib/mock-service";

export function GET(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get("kind");
  const payload = getTrendingPayload();
  return NextResponse.json({
    data:
      kind && kind in payload.tabs
        ? payload.tabs[kind as keyof typeof payload.tabs]
        : payload.leaderboard
  });
}
