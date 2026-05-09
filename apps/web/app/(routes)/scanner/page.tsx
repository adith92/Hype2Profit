import { ScannerView } from "@/features/scanner/scanner-view";
import { searchRecords } from "@/lib/mock-service";
import { getLatestScan } from "@/lib/persistence";
import { getRuntimeModeStatus } from "@/lib/runtime-status";

export default async function ScannerPage() {
  const latestScan = await getLatestScan();
  const runtime = getRuntimeModeStatus();

  return <ScannerView rows={searchRecords({ platform: "all" }).slice(0, 20)} latestScan={latestScan} runtime={runtime} />;
}
