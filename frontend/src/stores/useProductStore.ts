import { create } from "zustand";
import server from "../services/server";
import type { StoreItem } from "../types/types";
import { getErrorMessage } from "../utils/errorUtils";

interface ProductState {
  items: StoreItem[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  filters: {
    query: string;
    sort: string;
  };
  searchItems: () => Promise<void>;
  setQuery: (query: string) => void;
  setSort: (sort: string) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  hasSearched: false,
  filters: {
    query: "",
    sort: "price_asc",
  },

  searchItems: async () => {
    const { filters } = get();

    set({ loading: true, error: null, hasSearched: false });

    try {
      const results = await server.searchItems(filters.query, filters.sort);
      set({ items: results, hasSearched: true });
    } catch (error) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ loading: false });
    }
  },

  setQuery: (query) => {
    set((state) => ({
      filters: { ...state.filters, query },
    }));
  },

  setSort: (sort) => {
    set((state) => ({
      filters: { ...state.filters, sort },
    }));
  },
}));
