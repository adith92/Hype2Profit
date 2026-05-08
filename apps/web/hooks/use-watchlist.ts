"use client";

import { create } from "zustand";

type WatchlistState = {
  items: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
};

export const useWatchlist = create<WatchlistState>((set) => ({
  items: [],
  add: (id) => set((state) => ({ items: Array.from(new Set([...state.items, id])) })),
  remove: (id) => set((state) => ({ items: state.items.filter((item) => item !== id) }))
}));
