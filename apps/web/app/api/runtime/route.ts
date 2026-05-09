import { NextResponse } from "next/server";
import { hasSupabaseServerEnv } from "@/lib/persistence";

function readRuntimeStatus() {
  const mockDataEnabled = process.env.ENABLE_MOCK_DATA !== "false";
  const hasSupabase = hasSupabaseServerEnv();
  const extensionPaired = Boolean(process.env.EXTENSION_PAIRING_SECRET);
  const appMode = process.env.APP_MODE?.toLowerCase();

  const missing: string[] = [];

  if (mockDataEnabled) missing.push("ENABLE_MOCK_DATA=false");
  if (!hasSupabase) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!extensionPaired) missing.push("EXTENSION_PAIRING_SECRET");
  if (appMode !== "final") missing.push("APP_MODE=final");

  const live = !mockDataEnabled && hasSupabase && extensionPaired && appMode === "final";

  return {
    mode: live ? "live" : "demo",
    label: live ? "Live mode" : "Demo mode",
    missing,
    mockDataEnabled,
    hasSupabase,
    extensionPaired
  };
}

export async function GET() {
  return NextResponse.json(readRuntimeStatus());
}
