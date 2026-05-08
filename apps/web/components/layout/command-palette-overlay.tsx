"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Radar, Search, Settings, Star, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";

const commandItems = [
  { label: "Open Dashboard", href: "/dashboard", icon: TrendingUp },
  { label: "Open Scanner", href: "/scanner", icon: Search },
  { label: "Open Competitors", href: "/competitors", icon: Radar },
  { label: "Open Watchlist", href: "/watchlist", icon: Star },
  { label: "Open Exports", href: "/exports", icon: Download },
  { label: "Open Settings", href: "/settings", icon: Settings }
];

export function CommandPaletteOverlay() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => commandItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <AnimatePresence>
      {commandPaletteOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/55 px-4 pt-[10vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl rounded-[28px] border border-cyan/20 bg-slate-950/85 p-4 shadow-[0_30px_120px_rgba(15,23,42,.7)]"
          >
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Jump to route, action, or export..."
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none focus:border-cyan/40"
            />
            <div className="mt-4 space-y-2">
              {filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setCommandPaletteOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-left transition hover:border-cyan/25 hover:bg-cyan/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-cyan/20 bg-cyan/10 p-2 text-cyan">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-sm text-white">{item.label}</div>
                    </div>
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Enter</div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
