import { WatchlistView } from "@/features/watchlist/watchlist-view";
import { ensureDemoWatchlistSeeded } from "@/lib/mock-service";

export default function WatchlistPage() {
  return <WatchlistView items={ensureDemoWatchlistSeeded()} />;
}
