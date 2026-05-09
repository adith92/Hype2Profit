import { NextRequest, NextResponse } from "next/server";
import { getScanItems } from "@/lib/persistence";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const result = await getScanItems({
    marketplace: params.get("marketplace") ?? undefined,
    q: params.get("q") ?? undefined,
    limit: Number(params.get("limit") ?? "20")
  });

  return NextResponse.json({
    ok: true,
    source: result.source,
    warning: result.warning,
    data: result.data
  });
}
