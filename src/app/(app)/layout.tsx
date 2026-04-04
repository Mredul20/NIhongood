"use client";

import { useState, useEffect, useRef } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import BadgeToast from "@/components/BadgeToast";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";
import { useAuthStore } from "@/store/authStore";
import { db } from "@/lib/database";
import SearchBar from "@/components/SearchBar";
import LevelUpAnimation from "@/components/LevelUpAnimation";

function AppContent({ children }: { children: React.ReactNode }) {
  const { onboarding } = useUserPreferencesStore();
  const { user } = useAuthStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Track whether we've finished loading preferences from Supabase
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const loadedForUser = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load preferences from Supabase first, THEN decide whether to show onboarding.
  // This prevents returning users from seeing onboarding on a fresh browser/device
  // where the Zustand localStorage cache hasn't been hydrated yet.
  useEffect(() => {
    if (!user || loadedForUser.current === user.id) return;

    const checkOnboarding = async () => {
      try {
        // Fetch raw preference row directly — avoids relying on store hydration timing
        const preferences = await db.getUserPreferences(user.id);
        const completed = preferences?.onboarding_completed ?? false;

        if (!completed) {
          setShowOnboarding(true);
        }
      } catch {
        // On error fall back to local store value — better than blocking the user
        if (!onboarding.hasCompletedOnboarding) {
          setShowOnboarding(true);
        }
      } finally {
        loadedForUser.current = user.id;
        setPrefsLoaded(true);
      }
    };

    checkOnboarding();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Show loading spinner until mounted AND preferences are fetched from Supabase.
  // This is the gate that prevents the onboarding flash for returning users.
  if (!mounted || !prefsLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg-secondary, #f7f7f7)" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white animate-bounce"
            style={{ background: "#ff4b8b", boxShadow: "0 5px 0 #e0357a" }}
          >
            日
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full animate-bounce"
                style={{ background: "#ff4b8b", animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-72 min-h-screen">
        {/* Top bar with search */}
        <div className="sticky top-0 z-20 px-6 lg:px-8 py-3 flex items-center justify-end gap-3" style={{ background: "var(--bg-secondary)", borderBottom: "2px solid var(--border-color)" }}>
          <SearchBar />
        </div>
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
      <BadgeToast />
      <LevelUpAnimation />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppContent>{children}</AppContent>
    </AuthGuard>
  );
}
