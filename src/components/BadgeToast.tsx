"use client";

import { ALL_BADGES } from "@/store/progressStore";
import { useProgressStore } from "@/store/progressStore";
import { useEffect, useState } from "react";

export default function BadgeToast() {
  const { newBadgeId, dismissBadgeNotification } = useProgressStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (newBadgeId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => dismissBadgeNotification(), 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [newBadgeId, dismissBadgeNotification]);

  if (!newBadgeId) return null;

  const badge = ALL_BADGES.find((b) => b.id === newBadgeId);
  if (!badge) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 glass-card p-4 flex items-center gap-4 transition-all duration-300 ${
        visible ? "animate-slide-up opacity-100" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-3xl animate-bounce-in">
        {badge.emoji}
      </div>
      <div>
        <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider">Badge Unlocked!</p>
        <p className="text-lg font-bold text-slate-100">{badge.name}</p>
        <p className="text-sm text-slate-400">{badge.description}</p>
      </div>
    </div>
  );
}
