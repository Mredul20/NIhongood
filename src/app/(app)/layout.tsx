"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import BadgeToast from "@/components/BadgeToast";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";
import SearchBar from "@/components/SearchBar";
import LevelUpAnimation from "@/components/LevelUpAnimation";

function AppContent({ children }: { children: React.ReactNode }) {
  const { onboarding } = useUserPreferencesStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show onboarding for new users who haven't completed it
    if (!onboarding.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [onboarding.hasCompletedOnboarding]);

  if (!mounted) {
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
