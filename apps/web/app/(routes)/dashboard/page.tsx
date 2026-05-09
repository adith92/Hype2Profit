import { DashboardView } from "@/features/dashboard/components";
import { getDashboardPayload } from "@/lib/mock-service";
import { getLatestScan } from "@/lib/persistence";
import { getRuntimeModeStatus } from "@/lib/runtime-status";

export default async function DashboardPage() {
  const latestScan = await getLatestScan();
  const runtime = getRuntimeModeStatus();
  return <DashboardView payload={getDashboardPayload("all")} latestScan={latestScan} runtime={runtime} />;
}
