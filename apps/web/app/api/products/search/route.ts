import { NextRequest, NextResponse } from "next/server";
import { searchRecords } from "@/lib/mock-service";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const data = searchRecords({
    keyword: searchParams.get("keyword") ?? undefined,
    platform: (searchParams.get("platform") as "all" | "shopee" | "tokopedia" | "tiktok_shop" | null) ?? "all",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    minSales: searchParams.get("minSales") ? Number(searchParams.get("minSales")) : undefined,
    maxSales: searchParams.get("maxSales") ? Number(searchParams.get("maxSales")) : undefined,
    minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
    minStock: searchParams.get("minStock") ? Number(searchParams.get("minStock")) : undefined,
    maxStock: searchParams.get("maxStock") ? Number(searchParams.get("maxStock")) : undefined,
    signal: (searchParams.get("signal") as "BUY_TEST" | "WATCH" | "AVOID" | "ALL" | null) ?? "ALL"
  });
  return NextResponse.json({ data });
}
