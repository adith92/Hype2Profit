"use client";

import { create } from "zustand";

type TableDensity = "compact" | "comfortable";

type UIState = {
  commandPaletteOpen: boolean;
  tableDensity: TableDensity;
  selectedProductId: string | null;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setTableDensity: (density: TableDensity) => void;
  setSelectedProductId: (id: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  commandPaletteOpen: false,
  tableDensity: "comfortable",
  selectedProductId: null,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  setTableDensity: (density) => set({ tableDensity: density }),
  setSelectedProductId: (id) => set({ selectedProductId: id })
}));
