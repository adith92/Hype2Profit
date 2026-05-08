import { TrendingView } from "@/features/trending/trending-view";
import { getTrendingPayload } from "@/lib/mock-service";

export default function TrendingPage() {
  return <TrendingView payload={getTrendingPayload()} />;
}
