import { create } from "zustand";

type Severity = "success" | "info" | "warning" | "error";

interface UIState {
  snackbar: {
    open: boolean;
    message: string;
    severity: Severity;
  };
  showSnackbar: (message: string, severity: Severity) => void;
  hideSnackbar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  snackbar: {
    open: false,
    message: "",
    severity: "info",
  },
  showSnackbar: (message, severity) => set({ snackbar: { open: true, message, severity } }),
  hideSnackbar: () => set((state) => ({ snackbar: { ...state.snackbar, open: false } })),
}));
