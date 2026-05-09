import { NextRequest, NextResponse } from "next/server";
import { getSocialSearchProvider } from "@hype2profit/social-adapters";
import type { SocialSearchParams } from "@hype2profit/social-intelligence";

function isValid(body: Record<string, unknown>) {
  return typeof body.category === "string" && body.category.length > 0 && typeof body.keyword === "string" && body.keyword.length > 0;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;
  if (!isValid(body)) return NextResponse.json({ ok: false, error: "category and keyword are required" }, { status: 400 });
  if ((body.keyword as string).length > 120 || (body.category as string).length > 120) {
    return NextResponse.json({ ok: false, error: "category or keyword too long" }, { status: 400 });
  }
  const provider = getSocialSearchProvider();
  try {
    const data = await provider.searchPublicConversation({
      category: body.category as string,
      keyword: body.keyword as string,
      timeframe: (body.timeframe as SocialSearchParams["timeframe"]) ?? "7d",
      platform: (body.platform as SocialSearchParams["platform"]) ?? "all"
    });
    return NextResponse.json({
      ok: true,
      provider: provider.provider,
      data,
      note: "Social metrics are sampled/estimated and should be used as research signals, not absolute truth."
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed social search" }, { status: 500 });
  }
}
