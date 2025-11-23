import { create } from "zustand";
import authService from "../services/auth";
import type { User } from "../types/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  signup: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  checkAuth: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ user });
    } catch {
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (credentials) => {
    const user = await authService.login(credentials);
    set({ user });
  },

  signup: async (credentials) => {
    await authService.signup(credentials);
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },
}));
