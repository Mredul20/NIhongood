import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "dark",

      setTheme: (theme) => {
        const resolved = theme === "system" ? getSystemTheme() : theme;
        applyTheme(resolved);
        set({ theme, resolvedTheme: resolved });
      },

      initTheme: () => {
        const { theme } = get();
        const resolved = theme === "system" ? getSystemTheme() : theme;
        applyTheme(resolved);
        set({ resolvedTheme: resolved });

        // Listen for system theme changes
        if (typeof window !== "undefined") {
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          const handler = (e: MediaQueryListEvent) => {
            const currentTheme = get().theme;
            if (currentTheme === "system") {
              const newResolved = e.matches ? "dark" : "light";
              applyTheme(newResolved);
              set({ resolvedTheme: newResolved });
            }
          };
          mediaQuery.addEventListener("change", handler);
        }
      },
    }),
    {
      name: "nihongood-theme",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
