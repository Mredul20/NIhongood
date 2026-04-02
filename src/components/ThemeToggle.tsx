"use client";

import { useThemeStore, Theme } from "@/store/themeStore";
import { useEffect, useState } from "react";

const themes: { value: Theme; icon: string; label: string }[] = [
  { value: "light", icon: "☀️", label: "Light" },
  { value: "dark", icon: "🌙", label: "Dark" },
  { value: "system", icon: "💻", label: "System" },
];

export function ThemeToggle() {
  const { theme, setTheme, initTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initTheme();
  }, [initTheme]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-800/60 dark:bg-navy-800/60 light:bg-slate-100">
        <div className="w-20 h-8 rounded-lg bg-navy-700/50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-800/60 dark:bg-navy-800/60">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            theme === t.value
              ? "bg-gradient-to-r from-sakura-500/20 to-sakura-600/20 text-sakura-400 shadow-sm"
              : "text-slate-400 hover:text-slate-300 hover:bg-navy-700/50"
          }`}
          title={t.label}
        >
          <span className="text-sm">{t.icon}</span>
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// Compact version for sidebar
export function ThemeToggleCompact() {
  const { theme, resolvedTheme, setTheme, initTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initTheme();
  }, [initTheme]);

  const cycleTheme = () => {
    const order: Theme[] = ["light", "dark", "system"];
    const currentIndex = order.indexOf(theme);
    const nextIndex = (currentIndex + 1) % order.length;
    setTheme(order[nextIndex]);
  };

  if (!mounted) {
    return (
      <button className="w-full h-12 rounded-xl bg-navy-800/60 animate-pulse" />
    );
  }

  const getIcon = () => {
    if (theme === "system") return "💻";
    return resolvedTheme === "dark" ? "🌙" : "☀️";
  };

  const getLabel = () => {
    if (theme === "system") return "System";
    return resolvedTheme === "dark" ? "Dark" : "Light";
  };

  return (
    <button
      onClick={cycleTheme}
      className="nav-link w-full"
      title={`Current: ${getLabel()}. Click to change.`}
    >
      <span className="text-lg transition-transform duration-300 hover:scale-110">
        {getIcon()}
      </span>
      <span className="text-sm font-medium">{getLabel()} Mode</span>
    </button>
  );
}
