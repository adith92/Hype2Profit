"use client";

import { Command, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useUIStore } from "@/stores/ui-store";

export function FloatingCommandPalette() {
  const { setCommandPaletteOpen } = useUIStore();
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => setCommandPaletteOpen(true)}
      className="fixed bottom-6 right-6 z-40 hidden lg:block"
    >
      <Card className="flex items-center gap-3 border-cyan/20 bg-slate-950/70 px-4 py-3 shadow-glow transition hover:-translate-y-1 hover:border-cyan/35">
        <Search className="h-4 w-4 text-cyan" />
        <div className="text-sm text-slate-200">Command Palette</div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-400">
          <Command className="mr-1 inline h-3 w-3" />K
        </div>
      </Card>
    </motion.button>
  );
}
