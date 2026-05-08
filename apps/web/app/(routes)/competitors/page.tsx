import { CompetitorView } from "@/features/competitors/competitor-view";
import { analyzeStore } from "@/lib/mock-service";

export default async function CompetitorsPage() {
  const analysis = await analyzeStore("store_001", "shopee");
  return <CompetitorView analysis={analysis} />;
}
