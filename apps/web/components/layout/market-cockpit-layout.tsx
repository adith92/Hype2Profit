import Link from "next/link";
import type { PropsWithChildren } from "react";
import { Activity, BarChart3, BadgeDollarSign, Download, Radar, Search, Settings, Star } from "lucide-react";
import { CyberGridBackground } from "./cyber-grid-background";
import { FloatingCommandPalette } from "./floating-command-palette";
import { ExtensionStatusBadge } from "./extension-status-badge";
import { KeyboardShortcuts } from "./keyboard-shortcuts";
import { CommandPaletteOverlay } from "./command-palette-overlay";
import { PageTransition } from "./page-transition";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/scanner", label: "Scanner", icon: Search },
  { href: "/competitors", label: "Competitors", icon: Radar },
  { href: "/trending", label: "Trending", icon: BarChart3 },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/exports", label: "Exports", icon: Download },
  { href: "/pricing", label: "Pricing", icon: BadgeDollarSign },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function MarketCockpitLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CyberGridBackground />
      <KeyboardShortcuts />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-64 shrink-0 flex-col gap-3 rounded-[28px] border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl lg:flex">
          <div className="rounded-2xl border border-cyan/20 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.35em] text-cyan">Hype2Profit</div>
            <div className="mt-2 text-2xl font-semibold">Market Intelligence Cockpit</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ExtensionStatusBadge />
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">Ctrl/Cmd + K</span>
            </div>
          </div>
          <nav className="space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 transition hover:border-cyan/25 hover:bg-cyan/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 text-cyan" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="relative z-10 flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <FloatingCommandPalette />
      <CommandPaletteOverlay />
    </div>
  );
}
