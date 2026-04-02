"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore, ALL_BADGES } from "@/store/progressStore";
import { useSRSStore } from "@/store/srsStore";
import { useLearningStore } from "@/store/learningStore";

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

  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name);
      setLevel(user.level);
      setGoal(user.dailyGoalMinutes);
    }
  }, [user]);

  if (!mounted || !user) return <div className="animate-pulse glass-card h-96" />;

  const handleSave = () => {
    updateProfile({ name, level, dailyGoalMinutes: goal });
    setEditMode(false);
  };

  const xpForNext = progress.getXPForNextLevel();
  const xpProgress = progress.totalXP > 0 ? Math.min(100, ((progress.totalXP) / (progress.totalXP + xpForNext)) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="glass-card p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sakura-400 via-gold-400 to-teal-400 flex items-center justify-center text-3xl font-bold shadow-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-100">{user.name}</h1>
            <p className="text-slate-400">{user.email}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="badge-sakura">{user.level}</span>
              <span className="badge-gold">Level {progress.level}</span>
              <span className="badge-teal">🔥 {progress.currentStreak} day streak</span>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="btn-secondary text-sm"
            id="edit-profile-btn"
          >
            {editMode ? "Cancel" : "✏️ Edit"}
          </button>
        </div>

        {/* Edit Mode */}
        {editMode && (
          <div className="mt-6 pt-6 border-t border-white/5 space-y-4 animate-slide-up">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                id="edit-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">JLPT Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as "N5" | "N4")}
                  className="input-field"
                  id="edit-level"
                >
                  <option value="N5">N5 (Beginner)</option>
                  <option value="N4">N4 (Elementary)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Daily Goal (minutes)</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="input-field"
                  id="edit-goal"
                >
                  {[5, 10, 15, 20, 30, 45, 60].map((m) => (
                    <option key={m} value={m}>{m} min/day</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={handleSave} className="btn-primary text-sm" id="save-profile-btn">
              Save Changes
            </button>
          </div>
        )}

        {/* XP Progress */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Level {progress.level} → {progress.level + 1}</span>
            <span className="text-sm text-gold-400 font-medium">{progress.totalXP} XP</span>
          </div>
          <div className="progress-bar h-3">
            <div className="progress-bar-fill bg-gradient-to-r from-gold-400 to-gold-500" style={{ width: `${xpProgress}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-1">{xpForNext} XP to next level</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon="⚡" label="Total XP" value={progress.totalXP.toString()} />
        <StatBox icon="🔥" label="Best Streak" value={`${progress.longestStreak}d`} />
        <StatBox icon="📚" label="Words Learned" value={Object.keys(learning.learnedVocab).length.toString()} />
        <StatBox icon="🃏" label="Total Cards" value={srs.cards.length.toString()} />
        <StatBox icon="⏱️" label="Study Time" value={`${progress.totalStudyMinutes}m`} />
        <StatBox icon="✅" label="Reviews Done" value={progress.totalReviews.toString()} />
        <StatBox icon="あ" label="Kana Learned" value={Object.keys(learning.learnedKana).length.toString()} />
        <StatBox icon="📝" label="Grammar Done" value={Object.keys(learning.completedGrammar).length.toString()} />
      </div>

      {/* Badges */}
      <div className="glass-card p-6">
        <h2 className="section-title mb-6">
          <span>🏆</span> Badges ({progress.unlockedBadges.length}/{ALL_BADGES.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ALL_BADGES.map((badge) => {
            const unlocked = progress.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border text-center transition-all ${
                  unlocked
                    ? "bg-gold-400/5 border-gold-400/20"
                    : "bg-navy-800/30 border-white/5 opacity-40"
                }`}
              >
                <div className="text-3xl mb-2">{unlocked ? badge.emoji : "🔒"}</div>
                <p className={`text-sm font-bold ${unlocked ? "text-slate-200" : "text-slate-500"}`}>
                  {badge.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="glass-card-hover p-4 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold text-slate-100 mt-2">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
