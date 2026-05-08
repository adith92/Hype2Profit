import { NextRequest, NextResponse } from "next/server";
import { getProductRecords } from "@/lib/mock-service";

export function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  return context.params.then(({ id }) => {
    const item = getProductRecords("all").find((record) => record.id === id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: item });
  });
}
