import type { NextRequest } from "next/server";
import { getRuntimeModeStatus } from "@/lib/runtime-status";

function extractBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice("Bearer ".length).trim();
}

export function isExtensionSecretRequired() {
  const runtime = getRuntimeModeStatus();
  return runtime.finalModeRequested || runtime.mode === "live";
}

export function isExtensionAuthorized(request: NextRequest) {
  if (!isExtensionSecretRequired()) {
    return true;
  }

  const expectedSecret = process.env.EXTENSION_PAIRING_SECRET?.trim();
  if (!expectedSecret) {
    return false;
  }

  const bearerToken = extractBearerToken(request);
  const headerToken = request.headers.get("x-hype2profit-extension-secret")?.trim() ?? null;
  return bearerToken === expectedSecret || headerToken === expectedSecret;
}
