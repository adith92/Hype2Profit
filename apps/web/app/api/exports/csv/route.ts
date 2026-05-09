import { NextRequest, NextResponse } from "next/server";
import { buildProductCsv } from "@/lib/csv";
import { createPersistedExportJob } from "@/lib/persistence";

export async function POST(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get("kind") ?? "products";
  await createPersistedExportJob(kind);
  return buildProductCsv(kind as "products" | "trending" | "watchlist" | "competitors" | "latest_scan").then((data) => NextResponse.json({ data }));
}

export async function GET(request: NextRequest) {
  const kind = (request.nextUrl.searchParams.get("kind") ?? "products") as "products" | "trending" | "watchlist" | "competitors" | "latest_scan";
  await createPersistedExportJob(kind);
  return buildProductCsv(kind).then(({ csv, fileName }) =>
    new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`
      }
    })
  );
}
