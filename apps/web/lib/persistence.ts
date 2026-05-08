import { ensureDemoWatchlistSeeded, addToWatchlist, createExportJob, getExportJobs, getWatchlistRecords, removeFromWatchlist } from "@/lib/mock-service";
import { getSupabaseServerClient } from "@/lib/supabase";

export function hasSupabaseServerEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseServiceClient() {
  return getSupabaseServerClient();
}

type PersistPayload = {
  marketplace: string;
  url: string;
  scannedAt: string;
  products: Array<Record<string, unknown>>;
};

export async function persistExtensionScan(payload: PersistPayload) {
  if (!hasSupabaseServerEnv()) {
    return { persisted: false, received: payload.products.length, sessionId: null, reason: "Supabase env missing" };
  }
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { persisted: false, received: payload.products.length, sessionId: null, reason: "Supabase client unavailable" };
  }
  const { data: session, error } = await supabase
    .from("extension_scan_sessions")
    .insert({
      marketplace: payload.marketplace,
      url: payload.url,
      scanned_at: payload.scannedAt,
      product_count: payload.products.length,
      raw_payload: payload
    })
    .select("id")
    .single();
  if (error || !session?.id) {
    return { persisted: false, received: payload.products.length, sessionId: null, reason: error?.message ?? "insert failed" };
  }
  if (payload.products.length) {
    await supabase.from("extension_scan_items").insert(
      payload.products.map((product) => ({
        scan_session_id: session.id,
        title: (product.title as string | undefined) ?? null,
        price_text: (product.price as string | undefined) ?? null,
        sold_text: (product.sold as string | undefined) ?? null,
        rating_text: (product.rating as string | undefined) ?? null,
        image_url: (product.image as string | undefined) ?? null,
        shop_name: (product.shop as string | undefined) ?? null,
        product_url: ((product.normalizedUrl as string | undefined) ?? (product.url as string | undefined)) ?? null,
        confidence_score: ((product.confidenceScore as number | undefined) ?? (product.extractionConfidence as number | undefined)) ?? null,
        raw_item: product
      }))
    );
  }
  return { persisted: true, received: payload.products.length, sessionId: session.id };
}

export async function getWatchlistItems() {
  if (!hasSupabaseServerEnv()) return ensureDemoWatchlistSeeded();
  const supabase = getSupabaseServiceClient();
  if (!supabase) return ensureDemoWatchlistSeeded();
  const { data, error } = await supabase.from("watchlist_items").select("*").order("created_at", { ascending: false });
  if (error) return ensureDemoWatchlistSeeded();
  return data ?? [];
}

export async function addWatchlistItem(input: Record<string, unknown>) {
  if (!hasSupabaseServerEnv()) {
    const productId = (input.productId as string | undefined) ?? "";
    if (!productId) throw new Error("productId is required in mock mode");
    return addToWatchlist(productId, input.notes as string | undefined);
  }
  const supabase = getSupabaseServiceClient();
  if (!supabase) throw new Error("Supabase client unavailable");
  const { data, error } = await supabase
    .from("watchlist_items")
    .insert({
      product_id: (input.productId as string | undefined) ?? null,
      product_url: (input.productUrl as string | undefined) ?? null,
      title: (input.title as string | undefined) ?? "Manual Watchlist Item",
      platform: (input.platform as string | undefined) ?? "shopee",
      notes: (input.notes as string | undefined) ?? null,
      priority: (input.priority as string | undefined) ?? "medium",
      status: (input.status as string | undefined) ?? "watching"
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function removeWatchlistItem(idOrProductId: string) {
  if (!hasSupabaseServerEnv()) return removeFromWatchlist(idOrProductId);
  const supabase = getSupabaseServiceClient();
  if (!supabase) return removeFromWatchlist(idOrProductId);
  const { error } = await supabase.from("watchlist_items").delete().eq("id", idOrProductId);
  if (error) throw new Error(error.message);
  return { id: idOrProductId };
}

export async function createPersistedExportJob(kind: string, metadata?: Record<string, unknown>) {
  if (!hasSupabaseServerEnv()) return createExportJob(kind);
  const supabase = getSupabaseServiceClient();
  if (!supabase) return createExportJob(kind);
  const { data, error } = await supabase
    .from("export_jobs")
    .insert({ kind, status: "completed", metadata: metadata ?? null })
    .select("*")
    .single();
  if (error) return createExportJob(kind);
  return data;
}

export async function getPersistedExportJobs() {
  if (!hasSupabaseServerEnv()) return getExportJobs();
  const supabase = getSupabaseServiceClient();
  if (!supabase) return getExportJobs();
  const { data, error } = await supabase.from("export_jobs").select("*").order("created_at", { ascending: false });
  if (error) return getExportJobs();
  return data ?? [];
}

export { getWatchlistRecords };
