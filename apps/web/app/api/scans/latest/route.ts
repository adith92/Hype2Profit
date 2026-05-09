import { NextResponse } from "next/server";
import { getLatestScan } from "@/lib/persistence";

export async function GET() {
  const result = await getLatestScan();
  return NextResponse.json({
    ok: true,
    source: result.source,
    warning: result.warning,
    session: result.data.session,
    items: result.data.items
  });
}
