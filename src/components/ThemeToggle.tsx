"use client";

import { useThemeStore, Theme } from "@/store/themeStore";
import { useEffect, useState } from "react";

const themes: { value: Theme; icon: string; label: string }[] = [
  { value: "light", icon: "☀️", label: "Light" },
  { value: "dark",  icon: "🌙", label: "Dark"  },
  { value: "system",icon: "💻", label: "System"},
];

export function ThemeToggle() {
  const { theme, setTheme, initTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // setMounted(true) is a one-time hydration guard — intentional setState in effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); initTheme(); }, [initTheme]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-xl animate-pulse" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-20 h-8 rounded-lg" style={{ background: "var(--border-color)" }} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "var(--bg-secondary)", border: "2px solid var(--border-color)" }}>
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            theme === t.value ? "text-sakura-400" : ""
          }`}
          style={theme === t.value
            ? { background: "rgba(255,75,139,0.15)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
            : { color: "var(--text-secondary)" }
          }
          title={t.label}
        >
          <span className="text-sm">{t.icon}</span>
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// Compact version for sidebar — cycles through light → dark → system
export function ThemeToggleCompact() {
  const { theme, resolvedTheme, setTheme, initTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // setMounted(true) is a one-time hydration guard — intentional setState in effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); initTheme(); }, [initTheme]);

  const cycleTheme = () => {
    const order: Theme[] = ["light", "dark", "system"];
    setTheme(order[(order.indexOf(theme) + 1) % order.length]);
  };

  if (!mounted) return <div className="w-full h-10 rounded-xl animate-pulse" style={{ background: "var(--bg-secondary)" }} />;

  const icon  = theme === "system" ? "💻" : resolvedTheme === "dark" ? "🌙" : "☀️";
  const label = theme === "system" ? "System" : resolvedTheme === "dark" ? "Dark" : "Light";

  return (
    <button
      onClick={cycleTheme}
      className="nav-link w-full"
      title={`Theme: ${label}. Click to cycle.`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-bold">{label} Mode</span>
    </button>
  );
}
