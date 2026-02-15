import type { Product } from "@/schemas/product.schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (product) =>
        set((state) => {
          if (state.favorites.some((f) => f.id === product.id)) return state;
          return { favorites: [...state.favorites, product] };
        }),

      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== productId),
        })),

      toggleFavorite: (product) => {
        const exists = get().favorites.some((f) => f.id === product.id);
        if (exists) {
          get().removeFavorite(product.id);
        } else {
          get().addFavorite(product);
        }
      },

      isFavorite: (productId) =>
        get().favorites.some((f) => f.id === productId),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
