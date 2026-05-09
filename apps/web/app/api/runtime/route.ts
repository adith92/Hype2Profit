import { NextResponse } from "next/server";
import { getRuntimeModeStatus } from "@/lib/runtime-status";

export async function GET() {
  const runtime = getRuntimeModeStatus();
  return NextResponse.json({
    ok: true,
    mode: runtime.mode,
    label: runtime.label,
    detail: runtime.detail,
    hasSupabase: runtime.hasSupabase,
    extensionPaired: runtime.extensionPaired,
    mockDataEnabled: runtime.mockDataEnabled,
    finalModeRequested: runtime.finalModeRequested,
    missing: runtime.missing
  });
}
