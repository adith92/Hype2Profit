export type RuntimeMode = "live" | "demo" | "setup_required";

export type RuntimeModeStatus = {
  mode: RuntimeMode;
  label: string;
  detail: string;
  hasSupabase: boolean;
  extensionPaired: boolean;
  mockDataEnabled: boolean;
  finalModeRequested: boolean;
  missing: string[];
};

function isPresent(value?: string) {
  return Boolean(value && value.trim().length > 0);
}

export function isMockDataEnabled() {
  return process.env.ENABLE_MOCK_DATA !== "false";
}

export function isFinalModeRequested() {
  return process.env.APP_MODE === "final" || process.env.NEXT_PUBLIC_RUNTIME_MODE === "final" || process.env.ENABLE_MOCK_DATA === "false";
}

export function getRuntimeModeStatus(): RuntimeModeStatus {
  const missing: string[] = [];
  const hasSupabaseUrl = isPresent(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabaseAnonKey = isPresent(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasSupabaseServiceRoleKey = isPresent(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const extensionPaired = isPresent(process.env.EXTENSION_PAIRING_SECRET);
  const mockDataEnabled = isMockDataEnabled();
  const finalModeRequested = isFinalModeRequested();

  if (!hasSupabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!hasSupabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!hasSupabaseServiceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!extensionPaired) missing.push("EXTENSION_PAIRING_SECRET");

  const hasSupabase = hasSupabaseUrl && hasSupabaseAnonKey && hasSupabaseServiceRoleKey;

  if (hasSupabase && !mockDataEnabled) {
    return {
      mode: "live",
      label: "Live mode",
      detail: extensionPaired ? "Supabase persistence and extension pairing are configured." : "Supabase persistence is configured. Extension pairing secret is still missing.",
      hasSupabase,
      extensionPaired,
      mockDataEnabled,
      finalModeRequested,
      missing: extensionPaired ? [] : ["EXTENSION_PAIRING_SECRET"]
    };
  }

  if (finalModeRequested) {
    return {
      mode: "setup_required",
      label: "Setup required",
      detail: "Final mode is requested, but required production environment variables are missing.",
      hasSupabase,
      extensionPaired,
      mockDataEnabled,
      finalModeRequested,
      missing
    };
  }

  return {
    mode: "demo",
    label: "Demo mode",
    detail: "Using mock data fallback. Set Supabase env and ENABLE_MOCK_DATA=false for final live data.",
    hasSupabase,
    extensionPaired,
    mockDataEnabled,
    finalModeRequested,
    missing
  };
}
