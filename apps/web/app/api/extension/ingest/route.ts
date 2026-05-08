import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

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
  const body = await request.json();
  if (!isValidPayload(body)) {
    return NextResponse.json({ ok: false, error: "Invalid payload shape" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  let sessionId: string | null = null;
  if (supabase) {
    const { data: session, error: sessionError } = await supabase
      .from("extension_scan_sessions")
      .insert({
        marketplace: body.marketplace,
        url: body.url,
        scanned_at: body.scannedAt,
        raw_payload: body
      })
      .select("id")
      .single();

    if (!sessionError && session?.id) {
      sessionId = session.id;
      if (body.products.length > 0) {
        await supabase.from("extension_scan_items").insert(
          body.products.map((product) => ({
            scan_session_id: session.id,
            title: product.title ?? null,
            price_text: product.price ?? null,
            sold_text: product.sold ?? null,
            rating_text: product.rating ?? null,
            image_url: product.image ?? null,
            shop_name: product.shop ?? null,
            product_url: product.normalizedUrl ?? product.url ?? null,
            confidence_score: typeof product.extractionConfidence === "number" ? product.extractionConfidence : null
          }))
        );
      }
    }
  }

  return NextResponse.json({
    ok: true,
    sessionId,
    received: body.products.length,
    note: "Prototype ingest accepts visible DOM payloads only. All marketplace metrics are estimates and users must comply with platform Terms of Service."
  });
}
