"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sakura-400 to-sakura-600 flex items-center justify-center text-3xl font-bold animate-pulse-glow shadow-2xl shadow-sakura-500/30">
          日
        </div>
        <p className="text-slate-400 text-sm animate-fade-in">Loading NIhongood...</p>
      </div>
    </div>
  );
}
