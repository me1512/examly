"use client";

import { useEffect } from "react";
import { useThemeStore, Theme } from "@/stores/themeStore";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setTheme = useThemeStore((s) => s.setTheme);
  const applyTheme = useThemeStore((s) => s.applyTheme);

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme) || "system";
    setTheme(stored);

    if (stored === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [setTheme, applyTheme]);

  return <>{children}</>;
}
