import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyTheme: (theme?: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    devtools(
      (set, get) => ({
        // Initial State
        theme: localStorage.getItem("theme") || "system",

        // Actions
        setTheme: (newTheme) => {
          localStorage.setItem("theme", newTheme);
          set({ theme: newTheme });
          get().applyTheme(newTheme);
        },
        applyTheme: (theme) => {
          const appliedTheme = theme ?? get().theme;
          const isDark =
            appliedTheme === "dark" ||
            (appliedTheme === "system" &&
              window.matchMedia("(prefers-color-scheme: dark)").matches);
          document.body.classList.toggle("dark", isDark);
        },
      }),
      // The options object for devtools
      {
        name: "ThemeStore",
      },
    ),
    // The options object for persist
    {
      name: "theme-store", // Use a different key for localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
    },
  ),
);
