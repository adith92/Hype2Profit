import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({
    ok: true,
    received: Array.isArray(body?.products) ? body.products.length : 0,
    note: "Prototype ingest accepts visible DOM payloads only. All marketplace metrics are estimates and users must comply with platform Terms of Service."
  });
}
