import { NextRequest, NextResponse } from "next/server";
import { buildProductCsv } from "@/lib/csv";
import { createExportJob } from "@/lib/mock-service";

export function POST(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get("kind") ?? "products";
  createExportJob(kind);
  return buildProductCsv(kind as "products" | "trending" | "watchlist" | "competitors").then((data) => NextResponse.json({ data }));
}

export function GET(request: NextRequest) {
  const kind = (request.nextUrl.searchParams.get("kind") ?? "products") as "products" | "trending" | "watchlist" | "competitors";
  createExportJob(kind);
  return buildProductCsv(kind).then(({ csv, fileName }) =>
    new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`
      }
    })
  );
}
