import { create } from "zustand";

interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  searchQuery: "",
  selectedCategory: "Tüm Ürünler",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  resetFilters: () => set({ searchQuery: "", selectedCategory: "Tüm Ürünler" }),
}));
