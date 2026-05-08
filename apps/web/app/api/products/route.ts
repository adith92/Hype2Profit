import { NextResponse } from "next/server";
import { getProductRecords } from "@/lib/mock-service";

export function GET() {
  return NextResponse.json({ data: getProductRecords("all") });
}
