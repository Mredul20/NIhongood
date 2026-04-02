"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useSRSStore } from "@/store/srsStore";
import { useState } from "react";
import { ThemeToggleCompact } from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/learn/kana", label: "Kana", icon: "あ" },
  { href: "/learn/vocab", label: "Vocabulary", icon: "📖" },
  { href: "/learn/grammar", label: "Grammar", icon: "📝" },
  { href: "/review", label: "Review", icon: "🔄" },
  { href: "/profile", label: "Profile", icon: "👤" },
  { href: "/import-export", label: "Import/Export", icon: "↔️" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { level, totalXP, currentStreak } = useProgressStore();
  const { getCardCount } = useSRSStore();
  const dueCount = getCardCount().due;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-card rounded-xl"
        id="sidebar-toggle"
      >
        <span className="text-xl">{collapsed ? "☰" : "✕"}</span>
      </button>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`sidebar fixed top-0 left-0 h-full z-40 w-72 backdrop-blur-xl border-r flex flex-col transition-transform duration-300 ${
          collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3 group" id="logo-link">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sakura-400 to-sakura-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-sakura-500/30 group-hover:shadow-sakura-500/50 transition-all">
              日
            </div>
            <div>
              <h1 className="text-lg font-bold sidebar-text-primary">NIhongood</h1>
              <p className="text-xs sidebar-text-muted">日本語がいい</p>
            </div>
          </Link>
        </div>

        {/* User info card */}
        {user && (
          <div className="mx-4 mt-4 p-4 rounded-xl sidebar-card border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sakura-400 to-gold-400 flex items-center justify-center text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium sidebar-text-secondary truncate">{user.name}</p>
                <p className="text-xs sidebar-text-muted">Level {level}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-gold-500">
                <span>⚡</span> {totalXP} XP
              </span>
              <span className="flex items-center gap-1 text-sakura-500">
                <span>🔥</span> {currentStreak}d
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCollapsed(true)}
                id={`nav-${item.label.toLowerCase()}`}
                className={`nav-link ${isActive ? "nav-link-active" : ""}`}
              >
                <span className="text-lg w-6 text-center font-japanese">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.href === "/review" && dueCount > 0 && (
                  <span className="ml-auto bg-sakura-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {dueCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="px-4 pb-2">
          <ThemeToggleCompact />
        </div>

        {/* JLPT Level badge */}
        {user && (
          <div className="px-4 pb-4">
            <div className="p-3 rounded-xl sidebar-card border flex items-center justify-between">
              <span className="text-xs sidebar-text-muted">JLPT Level</span>
              <span className="badge-sakura font-bold">{user.level}</span>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-4 border-t sidebar-border">
          <button
            onClick={logout}
            className="logout-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
            id="logout-btn"
          >
            <span>🚪</span>
            <span className="font-medium text-sm">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
