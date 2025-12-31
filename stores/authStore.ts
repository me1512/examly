// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, AuthUser } from "@/types/auth";

interface AuthStore extends AuthState {
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),
      setError: (error) => set({ error, isLoading: false }),
      clearError: () => set({ error: null }),
      reset: () => set(initialState),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
