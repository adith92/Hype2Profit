export type WatchlistViewItem = {
  id: string;
  title: string;
  notes?: string | null;
  imageUrl: string;
  signal: "BUY_TEST" | "WATCH" | "AVOID";
  priceLabel: string;
  salesLabel: string;
  ratingLabel: string;
  capturedAtLabel: string;
};

export type ReturnTypeGetWatchlist = WatchlistViewItem[];
