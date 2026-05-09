import { NextRequest, NextResponse } from "next/server";
import { isExtensionAuthorized } from "@/lib/extension-auth";
import { persistExtensionScan } from "@/lib/persistence";

type IngestProduct = {
  title?: string;
  price?: string;
  sold?: string;
  rating?: string;
  image?: string;
  shop?: string;
  url?: string;
  normalizedUrl?: string;
  extractionConfidence?: number;
};

type IngestPayload = {
  marketplace: string;
  url: string;
  scannedAt: string;
  products: IngestProduct[];
};

function isValidPayload(input: unknown): input is IngestPayload {
  if (!input || typeof input !== "object") return false;
  const payload = input as Record<string, unknown>;
  return (
    typeof payload.marketplace === "string" &&
    typeof payload.url === "string" &&
    typeof payload.scannedAt === "string" &&
    Array.isArray(payload.products)
  );
}

export async function POST(request: NextRequest) {
  if (!isExtensionAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized extension ingest" }, { status: 401 });
  }

  const body = await request.json();
  if (!isValidPayload(body)) {
    return NextResponse.json({ ok: false, error: "Invalid payload shape" }, { status: 400 });
  }

  const persisted = await persistExtensionScan(body);

  return NextResponse.json({
    ok: true,
    persisted: persisted.persisted,
    sessionId: persisted.sessionId,
    received: body.products.length,
    source: persisted.source,
    reason: persisted.reason,
    warning: persisted.warning,
    note: "Prototype ingest accepts visible DOM payloads only. All marketplace metrics are estimates and users must comply with platform Terms of Service."
  });
}
