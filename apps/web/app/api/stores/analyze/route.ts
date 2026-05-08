import { NextRequest, NextResponse } from "next/server";
import { analyzeStore } from "@/lib/mock-service";

export async function GET(request: NextRequest) {
  const urlOrId = request.nextUrl.searchParams.get("query") ?? "store_001";
  const platform = (request.nextUrl.searchParams.get("platform") as "all" | "shopee" | "tokopedia" | "tiktok_shop" | null) ?? "shopee";
  const data = await analyzeStore(urlOrId, platform);
  return NextResponse.json({ data });
}
