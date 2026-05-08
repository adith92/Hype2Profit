"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleCommandPalette, setCommandPaletteOpen, selectedProductId } = useUIStore();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping = target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggleCommandPalette();
        return;
      }

      if (isTyping) return;

      if (event.key === "/") {
        event.preventDefault();
        const search = document.querySelector<HTMLElement>("[data-command-search='true']");
        search?.focus();
      }

      if (event.key.toLowerCase() === "e") {
        event.preventDefault();
        window.location.assign("/api/exports/csv?kind=products");
      }

      if (event.key.toLowerCase() === "w" && selectedProductId) {
        event.preventDefault();
        fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: selectedProductId, notes: `Saved from ${pathname}` })
        }).then(() => router.refresh());
      }

      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pathname, router, selectedProductId, setCommandPaletteOpen, toggleCommandPalette]);

  return null;
}
