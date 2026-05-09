import { NextRequest, NextResponse } from "next/server";
import { getSocialSearchProvider } from "@hype2profit/social-adapters";
import type { SocialSearchParams, SocialSource } from "@hype2profit/social-intelligence";

function isValid(body: Record<string, unknown>) {
  return typeof body.category === "string" && body.category.length > 0 && typeof body.keyword === "string" && body.keyword.length > 0;
}

const VALID_SOURCES = new Set<SocialSource>(["x", "facebook", "instagram", "threads", "combined_social", "combined_all"]);

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;
  if (!isValid(body)) return NextResponse.json({ ok: false, error: "category and keyword are required" }, { status: 400 });
  if ((body.keyword as string).length > 120 || (body.category as string).length > 120) {
    return NextResponse.json({ ok: false, error: "category or keyword too long" }, { status: 400 });
  }

  const source = ((body.source as SocialSource | undefined) ??
    ((body.platform as SocialSearchParams["platform"]) === "x" ||
    (body.platform as SocialSearchParams["platform"]) === "facebook" ||
    (body.platform as SocialSearchParams["platform"]) === "instagram" ||
    (body.platform as SocialSearchParams["platform"]) === "threads"
      ? (body.platform as SocialSource)
      : "combined_social")) as SocialSource;

  if (!VALID_SOURCES.has(source)) {
    return NextResponse.json({ ok: false, error: "unsupported social source" }, { status: 400 });
  }

  const provider = getSocialSearchProvider({ source });
  try {
    const data = await provider.search({
      category: body.category as string,
      keyword: body.keyword as string,
      timeframe: (body.timeframe as SocialSearchParams["timeframe"]) ?? "7d",
      source,
      platform: (body.platform as SocialSearchParams["platform"]) ?? "all"
    });
    return NextResponse.json({
      ok: true,
      provider: provider.provider,
      source: provider.source,
      status: provider.status,
      data,
      note: "Social metrics are sampled/estimated signals. Live providers may fall back to mock summaries when env, network, permission, or rate limits are not available."
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed social search" }, { status: 500 });
  }
}
