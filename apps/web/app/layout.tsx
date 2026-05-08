import type { Metadata } from "next";
import "./globals.css";
import { MarketCockpitLayout } from "@/components/layout/market-cockpit-layout";

export const metadata: Metadata = {
  title: "Hype2Profit",
  description: "Marketplace intelligence cockpit prototype"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="selection:bg-cyan/20 selection:text-white">
        <MarketCockpitLayout>{children}</MarketCockpitLayout>
      </body>
    </html>
  );
}
