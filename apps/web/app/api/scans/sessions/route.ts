import { NextRequest, NextResponse } from "next/server";
import { getScanSessions } from "@/lib/persistence";

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "20");
  const result = await getScanSessions(Number.isFinite(limit) ? limit : 20);
  return NextResponse.json({
    ok: true,
    source: result.source,
    warning: result.warning,
    data: result.data
  });
}
