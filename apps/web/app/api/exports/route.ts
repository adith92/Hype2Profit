import { NextRequest, NextResponse } from "next/server";
import { createPersistedExportJob, getPersistedExportJobs } from "@/lib/persistence";

export async function GET() {
  const data = await getPersistedExportJobs();
  return NextResponse.json({ ok: true, data });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { kind?: "products" | "watchlist" | "social" | "custom"; metadata?: Record<string, unknown> };
  if (!body.kind) {
    return NextResponse.json({ ok: false, error: "kind is required" }, { status: 400 });
  }
  const data = await createPersistedExportJob(body.kind, body.metadata);
  return NextResponse.json({ ok: true, data });
}
