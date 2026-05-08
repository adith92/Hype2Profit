import { ScannerView } from "@/features/scanner/scanner-view";
import { searchRecords } from "@/lib/mock-service";

export default function ScannerPage() {
  return <ScannerView rows={searchRecords({ platform: "all" }).slice(0, 20)} />;
}
