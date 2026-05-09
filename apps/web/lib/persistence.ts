import { ensureDemoWatchlistSeeded, addShadowWatchlistItem, addToWatchlist, createExportJob, getExportJobs, getProductRecords, getWatchlistRecords, removeFromWatchlist } from "@/lib/mock-service";
import { getSupabaseServerClient } from "@/lib/supabase";

export function hasSupabaseServerEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseServiceClient() {
  return getSupabaseServerClient();
}

type PersistSource = "supabase" | "mock";

type PersistenceResult<T> = {
  data: T;
  source: PersistSource;
  warning?: string;
};

type PersistPayload = {
  marketplace: string;
  url: string;
  scannedAt: string;
  products: Array<Record<string, unknown>>;
};

export type ScanSessionRecord = {
  id: string;
  marketplace: string;
  url: string;
  scanned_at: string;
  product_count: number;
  created_at: string;
};

export type ScanItemRecord = {
  id: string;
  scan_session_id: string;
  title: string | null;
  price_text: string | null;
  sold_text: string | null;
  rating_text: string | null;
  image_url: string | null;
  shop_name: string | null;
  product_url: string | null;
  confidence_score: number | null;
  created_at: string;
};

export type LatestScanPayload = {
  session: ScanSessionRecord | null;
  items: ScanItemRecord[];
};

function isMissingColumnError(message?: string) {
  return Boolean(message?.toLowerCase().includes("column") && message.toLowerCase().includes("does not exist"));
}

export async function persistExtensionScan(payload: PersistPayload) {
  if (!hasSupabaseServerEnv()) {
    return { persisted: false, received: payload.products.length, sessionId: null, source: "mock" as const, reason: "Supabase env missing" };
  }
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { persisted: false, received: payload.products.length, sessionId: null, source: "mock" as const, reason: "Supabase client unavailable" };
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
    return { persisted: false, received: payload.products.length, sessionId: null, source: "mock" as const, reason: error?.message ?? "insert failed" };
  }
  if (payload.products.length) {
    const { error: itemsError } = await supabase.from("extension_scan_items").insert(
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
    if (itemsError) {
      return {
        persisted: true,
        received: payload.products.length,
        sessionId: session.id,
        source: "supabase" as const,
        warning: `Scan session persisted, but item insert failed: ${itemsError.message}`
      };
    }
  }
  return { persisted: true, received: payload.products.length, sessionId: session.id, source: "supabase" as const };
}

function getMockScanItems(): ScanItemRecord[] {
  const fallback = ensureDemoWatchlistSeeded().slice(0, 6);
  return fallback.map((item, index) => ({
    id: `mock-scan-item-${index + 1}`,
    scan_session_id: "mock-scan-session",
    title: item.title,
    price_text: `Rp${item.price.toLocaleString("id-ID")}`,
    sold_text: `${item.soldCount} terjual`,
    rating_text: item.rating.toFixed(1),
    image_url: item.imageUrl,
    shop_name: item.shopName,
    product_url: item.url,
    confidence_score: Number((0.84 + index * 0.02).toFixed(2)),
    created_at: item.latestSnapshot.capturedAt
  }));
}

function getMockLatestScanPayload(): LatestScanPayload {
  return {
    session: {
      id: "mock-scan-session",
      marketplace: "shopee",
      url: "https://shopee.co.id/search?keyword=serum",
      scanned_at: new Date().toISOString(),
      product_count: getMockScanItems().length,
      created_at: new Date().toISOString()
    },
    items: getMockScanItems()
  };
}

export async function getScanSessions(limit = 20): Promise<PersistenceResult<ScanSessionRecord[]>> {
  if (!hasSupabaseServerEnv()) {
    return { data: [getMockLatestScanPayload().session!], source: "mock", warning: "Supabase env missing" };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { data: [getMockLatestScanPayload().session!], source: "mock", warning: "Supabase client unavailable" };
  }

  const { data, error } = await supabase
    .from("extension_scan_sessions")
    .select("id, marketplace, url, scanned_at, product_count, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { data: [getMockLatestScanPayload().session!], source: "mock", warning: error.message };
  }

  return { data: (data ?? []) as ScanSessionRecord[], source: "supabase" };
}

export async function getLatestScan(): Promise<PersistenceResult<LatestScanPayload>> {
  if (!hasSupabaseServerEnv()) {
    return { data: getMockLatestScanPayload(), source: "mock", warning: "Supabase env missing" };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { data: getMockLatestScanPayload(), source: "mock", warning: "Supabase client unavailable" };
  }

  const { data: session, error: sessionError } = await supabase
    .from("extension_scan_sessions")
    .select("id, marketplace, url, scanned_at, product_count, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sessionError) {
    return { data: getMockLatestScanPayload(), source: "mock", warning: sessionError.message };
  }

  if (!session) {
    return { data: { session: null, items: [] }, source: "supabase" };
  }

  const { data: items, error: itemsError } = await supabase
    .from("extension_scan_items")
    .select("id, scan_session_id, title, price_text, sold_text, rating_text, image_url, shop_name, product_url, confidence_score, created_at")
    .eq("scan_session_id", session.id)
    .order("created_at", { ascending: false });

  if (itemsError) {
    return {
      data: {
        session: session as ScanSessionRecord,
        items: []
      },
      source: "supabase",
      warning: itemsError.message
    };
  }

  return {
    data: {
      session: session as ScanSessionRecord,
      items: (items ?? []) as ScanItemRecord[]
    },
    source: "supabase"
  };
}

export async function getScanItems(filters: {
  marketplace?: string;
  q?: string;
  limit?: number;
}): Promise<PersistenceResult<ScanItemRecord[]>> {
  if (!hasSupabaseServerEnv()) {
    const mock = getMockScanItems().filter((item) => {
      const q = filters.q?.toLowerCase();
      if (!q) return true;
      return [item.title, item.shop_name, item.product_url].some((value) => value?.toLowerCase().includes(q));
    });
    return { data: mock.slice(0, filters.limit ?? 20), source: "mock", warning: "Supabase env missing" };
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return { data: getMockScanItems().slice(0, filters.limit ?? 20), source: "mock", warning: "Supabase client unavailable" };
  }

  let query = supabase
    .from("extension_scan_items")
    .select("id, scan_session_id, title, price_text, sold_text, rating_text, image_url, shop_name, product_url, confidence_score, created_at")
    .order("created_at", { ascending: false })
    .limit(filters.limit ?? 20);

  if (filters.marketplace) {
    const { data: matchingSessions, error: sessionsError } = await supabase
      .from("extension_scan_sessions")
      .select("id")
      .eq("marketplace", filters.marketplace)
      .order("created_at", { ascending: false })
      .limit(50);

    if (sessionsError) {
      return { data: getMockScanItems().slice(0, filters.limit ?? 20), source: "mock", warning: sessionsError.message };
    }

    const ids = (matchingSessions ?? []).map((session) => session.id);
    if (!ids.length) {
      return { data: [], source: "supabase" };
    }

    query = query.in("scan_session_id", ids);
  }

  if (filters.q) {
    query = query.or(`title.ilike.%${filters.q}%,shop_name.ilike.%${filters.q}%,product_url.ilike.%${filters.q}%`);
  }

  const { data, error } = await query;
  if (error) {
    return { data: getMockScanItems().slice(0, filters.limit ?? 20), source: "mock", warning: error.message };
  }

  return { data: (data ?? []) as ScanItemRecord[], source: "supabase" };
}

export async function getWatchlistItems(): Promise<PersistenceResult<unknown[]>> {
  if (!hasSupabaseServerEnv()) return { data: ensureDemoWatchlistSeeded(), source: "mock", warning: "Supabase env missing" };
  const supabase = getSupabaseServiceClient();
  if (!supabase) return { data: ensureDemoWatchlistSeeded(), source: "mock", warning: "Supabase client unavailable" };
  const { data, error } = await supabase.from("watchlist_items").select("*").order("created_at", { ascending: false });
  if (error) return { data: ensureDemoWatchlistSeeded(), source: "mock", warning: error.message };
  return { data: data ?? [], source: "supabase" };
}

export async function addWatchlistItem(input: Record<string, unknown>): Promise<PersistenceResult<unknown>> {
  if (!hasSupabaseServerEnv()) {
    const productId = (input.productId as string | undefined) ?? "";
    if (!productId) throw new Error("productId is required in mock mode");
    const matchingRecord = getProductRecords("all").find((item) => item.id === productId);
    const data = matchingRecord
      ? addToWatchlist(productId, input.notes as string | undefined)
      : addShadowWatchlistItem({
          productId,
          notes: input.notes as string | undefined,
          title: input.title as string | undefined,
          productUrl: input.productUrl as string | undefined,
          platform: (input.platform as "shopee" | "tokopedia" | "tiktok_shop" | "all" | undefined) ?? "all"
        });
    return { data, source: "mock", warning: "Supabase env missing" };
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
  return { data, source: "supabase" };
}

export async function removeWatchlistItem(idOrProductId: string): Promise<PersistenceResult<unknown>> {
  if (!hasSupabaseServerEnv()) return { data: removeFromWatchlist(idOrProductId), source: "mock", warning: "Supabase env missing" };
  const supabase = getSupabaseServiceClient();
  if (!supabase) return { data: removeFromWatchlist(idOrProductId), source: "mock", warning: "Supabase client unavailable" };
  const { error } = await supabase.from("watchlist_items").delete().or(`id.eq.${idOrProductId},product_id.eq.${idOrProductId}`);
  if (error) throw new Error(error.message);
  return { data: { id: idOrProductId }, source: "supabase" };
}

export async function createPersistedExportJob(kind: string, metadata?: Record<string, unknown>): Promise<PersistenceResult<unknown>> {
  if (!hasSupabaseServerEnv()) return { data: createExportJob(kind), source: "mock", warning: "Supabase env missing" };
  const supabase = getSupabaseServiceClient();
  if (!supabase) return { data: createExportJob(kind), source: "mock", warning: "Supabase client unavailable" };

  const insertPayload = { kind, status: "completed", metadata: metadata ?? null, completed_at: new Date().toISOString() };
  const { data, error } = await supabase.from("export_jobs").insert(insertPayload).select("*").single();
  if (!error) return { data, source: "supabase" };

  // Older Supabase projects created export_jobs in the initial migration without metadata/completed_at compatibility.
  // Keep exports usable while the additive migration is applied.
  if (isMissingColumnError(error.message)) {
    const { data: legacyData, error: legacyError } = await supabase.from("export_jobs").insert({ kind, status: "completed" }).select("*").single();
    if (!legacyError) return { data: legacyData, source: "supabase", warning: "Legacy export_jobs schema detected. Apply 20260509_core_persistence_compat.sql." };
  }

  return { data: createExportJob(kind), source: "mock", warning: error.message };
}

export async function getPersistedExportJobs(): Promise<PersistenceResult<unknown[]>> {
  if (!hasSupabaseServerEnv()) return { data: getExportJobs(), source: "mock", warning: "Supabase env missing" };
  const supabase = getSupabaseServiceClient();
  if (!supabase) return { data: getExportJobs(), source: "mock", warning: "Supabase client unavailable" };
  const { data, error } = await supabase.from("export_jobs").select("*").order("created_at", { ascending: false });
  if (error) return { data: getExportJobs(), source: "mock", warning: error.message };
  return { data: data ?? [], source: "supabase" };
}

export { getWatchlistRecords };
