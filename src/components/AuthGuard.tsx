"use client";

import { useAuthStore } from "@/store/authStore";
import { useInitializeStores, useSyncStores } from "@/hooks/useInitializeStores";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialize } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Initialize stores when user logs in
  useInitializeStores();
  
  // Set up periodic sync
  useSyncStores();

  useEffect(() => {
    // Initialize auth on mount
    initialize().then(() => setMounted(true));
  }, [initialize]);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sakura-400 to-sakura-600 flex items-center justify-center text-2xl font-bold animate-pulse-glow">
            日
          </div>
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
