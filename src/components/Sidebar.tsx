"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useSRSStore } from "@/store/srsStore";
import { useState } from "react";
import { ThemeToggleCompact } from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/dashboard",      label: "Home",         icon: "🏠", color: "#ff4b8b" },
  { href: "/learn/kana",     label: "Kana",         icon: "あ", color: "#ff86d0" },
  { href: "/learn/kanji",    label: "Kanji",        icon: "漢", color: "#ff9600" },
  { href: "/learn/vocab",    label: "Vocabulary",   icon: "📖", color: "#ce82ff" },
  { href: "/learn/grammar",  label: "Grammar",      icon: "📝", color: "#1cb0f6" },
  { href: "/flashcards",     label: "Flashcards",   icon: "🃏", color: "#ffc800" },
  { href: "/review",         label: "Review",       icon: "🔄", color: "#ff4b4b" },
  { href: "/profile",        label: "Profile",      icon: "👤", color: "#ff4b8b" },
  { href: "/import-export",  label: "Import/Export",icon: "↔️", color: "#1cb0f6" },
  { href: "/settings",       label: "Settings",     icon: "⚙️", color: "#777777" },
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
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white border-2 border-[#e5e5e5] shadow-[0_3px_0_#e5e5e5] flex items-center justify-center text-xl"
        id="sidebar-toggle"
      >
        {collapsed ? "☰" : "✕"}
      </button>

      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`sidebar fixed top-0 left-0 h-full z-40 w-72 flex flex-col transition-transform duration-300 ${
          collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3 group" id="logo-link">
            <div className="w-11 h-11 rounded-2xl bg-[#ff4b8b] flex items-center justify-center text-2xl font-black text-white shadow-[0_4px_0_#e0357a] group-hover:shadow-[0_2px_0_#e0357a] group-hover:translate-y-0.5 transition-all">
              日
            </div>
            <div>
              <h1 className="text-xl font-black sidebar-text-primary tracking-tight">NIhongood</h1>
              <p className="text-xs sidebar-text-muted font-semibold">日本語がいい</p>
            </div>
          </Link>
        </div>

        {/* XP / Streak stats bar */}
        {user && (
          <div className="mx-4 mt-4 p-3 rounded-2xl sidebar-card border sidebar-border flex items-center justify-around">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-black text-[#ff9600]">{currentStreak}</span>
              <span className="text-[10px] font-bold sidebar-text-muted uppercase tracking-wide">Streak</span>
            </div>
            <div className="w-px h-8 bg-[var(--border-color)]" />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-black text-[#1cb0f6]">{totalXP}</span>
              <span className="text-[10px] font-bold sidebar-text-muted uppercase tracking-wide">XP</span>
            </div>
            <div className="w-px h-8 bg-[var(--border-color)]" />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-lg">🏅</span>
              <span className="text-sm font-black text-[#ce82ff]">{level}</span>
              <span className="text-[10px] font-bold sidebar-text-muted uppercase tracking-wide">Level</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCollapsed(true)}
                id={`nav-${item.label.toLowerCase()}`}
                className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                style={isActive ? { borderColor: `${item.color}40`, background: `${item.color}12`, color: item.color } : {}}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${item.color}15` }}
                >
                  {item.icon}
                </span>
                <span className="font-bold">{item.label}</span>
                {item.href === "/review" && dueCount > 0 && (
                  <span className="ml-auto bg-[#ff4b4b] text-white text-xs font-black px-2 py-0.5 rounded-full min-w-[22px] text-center">
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

        {/* JLPT badge */}
        {user && (
          <div className="px-4 pb-3">
            <div className="p-3 rounded-xl sidebar-card border sidebar-border flex items-center justify-between">
              <span className="text-xs sidebar-text-muted font-bold uppercase tracking-wide">JLPT Level</span>
              <span className="badge badge-gold font-black">{user.level}</span>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-4 border-t sidebar-border">
          <button
            onClick={logout}
            className="logout-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm"
            id="logout-btn"
          >
            <span>🚪</span>
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
