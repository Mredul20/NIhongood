"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import BadgeToast from "@/components/BadgeToast";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";

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
      <div className="flex min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse glass-card p-8">
            <div className="text-4xl mb-4">🎌</div>
            <p className="text-slate-400">Loading...</p>
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
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
      <BadgeToast />
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
