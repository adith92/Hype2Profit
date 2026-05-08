import { NextRequest, NextResponse } from "next/server";
import { addToWatchlist, ensureDemoWatchlistSeeded } from "@/lib/mock-service";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ data: ensureDemoWatchlistSeeded(), source: "mock" });
  }

  const { data, error } = await supabase.from("watchlist_items").select("*").order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ data: ensureDemoWatchlistSeeded(), source: "mock", warning: error.message });
  }
  return NextResponse.json({ data: data ?? [], source: "supabase" });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    productId?: string;
    productUrl?: string;
    title?: string;
    platform?: string;
    notes?: string;
    priority?: "low" | "normal" | "high";
    status?: "active" | "archived";
  };
  if (!body.productId && !body.productUrl) {
    return NextResponse.json({ error: "productId or productUrl is required" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    if (!body.productId) return NextResponse.json({ error: "productId is required in mock mode" }, { status: 400 });
    return NextResponse.json({ data: addToWatchlist(body.productId, body.notes), source: "mock" });
  }

  const { data, error } = await supabase
    .from("watchlist_items")
    .insert({
      product_id: body.productId ?? null,
      product_url: body.productUrl ?? null,
      title: body.title ?? "Manual Watchlist Item",
      platform: body.platform ?? "shopee",
      notes: body.notes ?? null,
      priority: body.priority ?? "normal",
      status: body.status ?? "active"
    })
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data, source: "supabase" });
}
