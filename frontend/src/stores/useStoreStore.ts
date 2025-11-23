import { create } from "zustand";
import serverService from "../services/server";
import type { StoreWithRating } from "../types/types";

interface ShopState {
  stores: StoreWithRating[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    category: string;
  };
  fetchStores: () => Promise<void>;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
}

export const useShopStore = create<ShopState>((set, get) => ({
  stores: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    category: "all",
  },

  fetchStores: async () => {
    set({ loading: true, error: null });
    const { filters } = get();

    try {
      const queryFilters = {
        search: filters.search || undefined,
        category: filters.category === "all" ? undefined : filters.category,
      };

      const data = await serverService.getStoresWithAverageRating(queryFilters);
      set({ stores: data });
    } catch {
      set({ error: "Error al cargar las tiendas" });
    } finally {
      set({ loading: false });
    }
  },

  setSearch: (search) => {
    set((state) => ({
      filters: { ...state.filters, search },
    }));
  },

  setCategory: (category) => {
    set((state) => ({
      filters: { ...state.filters, category },
    }));
    get().fetchStores();
  },
}));
