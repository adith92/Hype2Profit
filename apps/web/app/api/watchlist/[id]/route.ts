import { NextRequest, NextResponse } from "next/server";
import { removeFromWatchlist } from "@/lib/mock-service";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ data: removeFromWatchlist(id), source: "mock" });
  }
  const { error } = await supabase.from("watchlist_items").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id, source: "supabase" });
}
