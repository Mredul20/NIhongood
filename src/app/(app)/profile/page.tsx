"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore, ALL_BADGES } from "@/store/progressStore";
import { useSRSStore } from "@/store/srsStore";
import { useLearningStore } from "@/store/learningStore";
import StudyHeatmap from "@/components/StudyHeatmap";

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const progress = useProgressStore();
  const srs = useSRSStore();
  const learning = useLearningStore();
  const [mounted, setMounted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<"N5" | "N4">("N5");
  const [goal, setGoal] = useState(15);

  // Sync external user data into local edit-state on mount and when user changes.
  // setState calls in this effect mirror server state into form fields and are
  // not triggered by React render — intentional pattern.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name);
      setLevel(user.level);
      setGoal(user.dailyGoalMinutes);
    }
  }, [user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!mounted || !user) return <div className="animate-pulse duo-card h-96" />;

  const handleSave = () => {
    updateProfile({ name, level, dailyGoalMinutes: goal });
    setEditMode(false);
  };

  const xpForNext = progress.getXPForNextLevel();
  const xpProgress = progress.totalXP > 0
    ? Math.min(100, ((progress.totalXP) / (progress.totalXP + xpForNext)) * 100)
    : 0;

  return (
    <div className="space-y-4 animate-fade-in">

      {/* ── Profile Header ── */}
      <div className="duo-card p-5">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#ff4b8b,#ce82ff)", boxShadow: "0 4px 0 rgba(165,96,216,0.4)" }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-black truncate" style={{ color: "var(--text-primary)" }}>{user.name}</h1>
                <p className="text-[11px] font-semibold truncate" style={{ color: "var(--text-secondary)" }}>{user.email}</p>
              </div>
              {/* Edit button inline */}
              <button
                onClick={() => setEditMode(!editMode)}
                className="btn-secondary text-xs px-2 py-1.5 flex-shrink-0"
                id="edit-profile-btn"
              >
                {editMode ? "✕" : "✏️"}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="badge badge-sakura">{user.level}</span>
              <span className="badge badge-gold">Lv.{progress.level}</span>
              <span className="badge badge-teal">🔥 {progress.currentStreak}d</span>
            </div>
          </div>
        </div>

        {/* Edit Mode */}
        {editMode && (
          <div className="mt-4 pt-4 space-y-3 animate-slide-up" style={{ borderTop: "2px solid var(--border-color)" }}>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-secondary)" }}>Display Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" id="edit-name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-secondary)" }}>JLPT Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value as "N5" | "N4")} className="input-field" id="edit-level">
                  <option value="N5">N5 — Beginner</option>
                  <option value="N4">N4 — Elementary</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-secondary)" }}>Daily Goal</label>
                <select value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="input-field" id="edit-goal">
                  {[5, 10, 15, 20, 30, 45, 60].map((m) => (
                    <option key={m} value={m}>{m} min/day</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={handleSave} className="btn-primary text-sm w-full" id="save-profile-btn">
              Save Changes
            </button>
          </div>
        )}

        {/* XP Progress */}
        <div className="mt-4 pt-4" style={{ borderTop: "2px solid var(--border-color)" }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Level {progress.level} → {progress.level + 1}</span>
            <span className="text-xs font-black" style={{ color: "#ffc800" }}>{progress.totalXP} XP</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${xpProgress}%`, background: "linear-gradient(90deg,#ffc800,#ff9600)" }} />
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{xpForNext} XP to next level</p>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <StatBox icon="⚡" label="Total XP"    value={progress.totalXP.toString()} color="#ffc800" />
        <StatBox icon="🔥" label="Best Streak" value={`${progress.longestStreak}d`} color="#ff9600" />
        <StatBox icon="📚" label="Vocab"        value={Object.values(learning.learnedVocab).filter(Boolean).length.toString()} color="#ce82ff" />
        <StatBox icon="🃏" label="Cards"        value={srs.cards.length.toString()} color="#1cb0f6" />
        <StatBox icon="⏱️" label="Minutes"     value={`${progress.totalStudyMinutes}`} color="#ff4b8b" />
        <StatBox icon="✅" label="Reviews"      value={progress.totalReviews.toString()} color="#58cc02" />
        <StatBox icon="あ" label="Kana"         value={Object.values(learning.learnedKana).filter(Boolean).length.toString()} color="#ff86d0" />
        <StatBox icon="📝" label="Grammar"      value={Object.values(learning.completedGrammar).filter(Boolean).length.toString()} color="#1cb0f6" />
      </div>

      {/* ── Study Heatmap ── */}
      <div className="duo-card p-4 overflow-x-auto">
        <StudyHeatmap />
      </div>

      {/* ── Badges ── */}
      <div className="duo-card p-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-black flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            🏆 Badges
          </h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(206,130,255,0.12)", color: "#a560d8" }}>
            {progress.unlockedBadges.length}/{ALL_BADGES.length}
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
          Earn badges by hitting milestones in your Japanese journey.
        </p>

        {[
          { tier: "🥉 Bronze", color: "#cd7f32", ids: ["first-review","vocab-10","kana-hiragana","grammar-5","xp-100","streak-3","reviews-50","level-5"] },
          { tier: "🥈 Silver", color: "#aaaaaa", ids: ["vocab-25","kana-katakana","grammar-all","xp-500","streak-7","reviews-100","level-10"] },
          { tier: "🥇 Gold",   color: "#ffc800", ids: ["vocab-50","kana-master","xp-1000","streak-30"] },
        ].map(({ tier, color, ids }) => {
          const tierBadges = ALL_BADGES.filter((b) => ids.includes(b.id));
          const unlockedCount = tierBadges.filter((b) => progress.unlockedBadges.includes(b.id)).length;
          return (
            <div key={tier} className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-black" style={{ color }}>{tier}</span>
                <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {unlockedCount}/{tierBadges.length}
                </span>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {tierBadges.map((badge) => {
                  const unlocked = progress.unlockedBadges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className="p-3 rounded-xl border-2 text-center transition-all"
                      style={{
                        background: unlocked ? `${color}10` : "var(--bg-secondary)",
                        borderColor: unlocked ? `${color}40` : "var(--border-color)",
                        boxShadow: unlocked ? `0 3px 0 ${color}30` : "0 3px 0 var(--border-color)",
                        opacity: unlocked ? 1 : 0.5,
                      }}
                    >
                      <div className="text-2xl mb-1">{unlocked ? badge.emoji : "🔒"}</div>
                      <p className="text-xs font-black leading-tight" style={{ color: unlocked ? "var(--text-primary)" : "var(--text-secondary)" }}>
                        {badge.name}
                      </p>
                      <p className="text-[10px] mt-0.5 leading-tight" style={{ color: "var(--text-secondary)" }}>{badge.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div
      className="duo-card p-3 flex items-center gap-3 sm:flex-col sm:items-center sm:text-center"
      style={{ borderColor: `${color}30`, boxShadow: `0 3px 0 ${color}20` }}
    >
      <span className="text-2xl leading-none flex-shrink-0">{icon}</span>
      <div className="flex flex-col sm:items-center">
        <p className="text-base sm:text-lg font-black leading-none" style={{ color }}>{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-wide leading-none mt-0.5" style={{ color: "var(--text-secondary)" }}>{label}</p>
      </div>
    </div>
  );
}
