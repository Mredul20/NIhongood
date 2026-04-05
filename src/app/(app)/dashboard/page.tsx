"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore, ALL_BADGES } from "@/store/progressStore";
import { useSRSStore } from "@/store/srsStore";
import { useLearningStore } from "@/store/learningStore";
import { useEffect, useState } from "react";
import { ActivityChart } from "@/components/ActivityChart";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const progress = useProgressStore();
  const srs = useSRSStore();
  const learning = useLearningStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  useEffect(() => {
    if (!mounted) return;
    progress.checkBadges({
      totalReviews: progress.totalReviews,
      streak: progress.currentStreak,
      vocabLearned: Object.values(learning.learnedVocab).filter(Boolean).length,
      hiraganaLearned: Object.entries(learning.learnedKana).filter(([k, v]) =>
        v && k.charCodeAt(0) >= 0x3040 && k.charCodeAt(0) <= 0x309f
      ).length,
      katakanaLearned: Object.entries(learning.learnedKana).filter(([k, v]) =>
        v && k.charCodeAt(0) >= 0x30a0 && k.charCodeAt(0) <= 0x30ff
      ).length,
      kanaLearned: Object.values(learning.learnedKana).filter(Boolean).length,
      grammarCompleted: Object.values(learning.completedGrammar).filter(Boolean).length,
      totalXP: progress.totalXP,
      level: progress.level,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, progress.totalReviews, progress.currentStreak, progress.totalXP, progress.level]);

  if (!mounted) return <DashboardSkeleton />;

  const cardCount = srs.getCardCount();
  const weeklyActivity = progress.getWeeklyActivity();
  const todayLog = progress.getTodayLog();
  const kanaMastery = learning.getKanaMastery();
  const vocabProgress = learning.getVocabProgress();
  const grammarProgress = learning.getGrammarProgress();
  const xpForNext = progress.getXPForNextLevel();
  const dailyGoalMinutes = user?.dailyGoalMinutes || 15;
  const goalProgress = Math.min(100, Math.round((todayLog.timeSpent / dailyGoalMinutes) * 100));
  const goalDone = todayLog.timeSpent >= dailyGoalMinutes;

  const dailyTasks = [
    { label: "Review due cards",   count: cardCount.due, done: cardCount.due === 0, href: "/review",       icon: "🔄", color: "#ff4b4b" },
    { label: "Daily Challenge",    count: null,          done: todayLog.xpEarned >= 50,  href: "/challenge",    icon: "⚡", color: "#ff9600" },
    { label: "Learn vocabulary",   count: null,          done: vocabProgress >= 100,  href: "/learn/vocab",   icon: "📖", color: "#ce82ff" },
    { label: "Study grammar",      count: null,          done: grammarProgress >= 100, href: "/learn/grammar", icon: "📝", color: "#1cb0f6" },
    { label: "Practice kana",      count: null,          done: kanaMastery >= 100,    href: "/learn/kana",    icon: "あ", color: "#ff86d0" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">

      {/* ── GREETING HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "#ff4b8b" }}>
            {progress.currentStreak > 0 ? `🔥 ${progress.currentStreak} day streak!` : "Let's get started!"}
          </p>
          <h1 className="text-3xl font-black mt-0.5" style={{ color: "var(--text-primary)" }}>
            Hey, {user?.name?.split(" ")[0]} 👋
          </h1>
        </div>
        <Link
          href="/review"
          className="btn-primary w-fit"
          id="start-review-btn"
        >
          {cardCount.due > 0 ? `🔄 Review (${cardCount.due})` : "🔄 Start Review"}
        </Link>
      </div>

      {/* ── DAILY GOAL BAR ── */}
      <div className="duo-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="text-sm font-black" style={{ color: "var(--text-primary)" }}>Daily Goal</span>
            {goalDone && <span className="text-xs font-black text-green-500">✅ Complete!</span>}
          </div>
          <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
            {todayLog.timeSpent}m / {dailyGoalMinutes}m
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${goalProgress}%`,
              background: goalDone
                ? "linear-gradient(90deg, #58cc02, #89e219)"
                : "linear-gradient(90deg, #ff4b8b, #ff79a8)",
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1.5 font-semibold" style={{ color: "var(--text-secondary)" }}>
          <span>{goalProgress}% of daily goal</span>
          <span>⚡ {todayLog.xpEarned} XP today</span>
        </div>
      </div>

      {/* ── XP LEVEL BAR ── */}
      <div className="duo-card p-4 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
          style={{ background: "#ff4b8b", boxShadow: "0 4px 0 #e0357a" }}
        >
          {progress.level}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-black" style={{ color: "var(--text-primary)" }}>
              Level {progress.level}
            </span>
            <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
              {xpForNext} XP to next
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(100, ((progress.totalXP % 500) / 500) * 100)}%`,
                background: "linear-gradient(90deg, #ff4b8b, #ff79a8)",
              }}
            />
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-black" style={{ color: "#1cb0f6" }}>{progress.totalXP}</p>
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>Total XP</p>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Streak"    value={`${progress.currentStreak}d`} sub={`Best: ${progress.longestStreak}d`} emoji="🔥" color="#ff9600" shadow="#e08000" />
        <StatCard label="XP Today"  value={todayLog.xpEarned.toString()}  sub="earned today"                       emoji="⚡" color="#1cb0f6" shadow="#0a91d1" />
        <StatCard label="Due Cards" value={cardCount.due.toString()}       sub={`${cardCount.total} total`}         emoji="🃏" color="#ff4b4b" shadow="#d93636" />
        <StatCard label="Reviews"   value={progress.totalReviews.toString()} sub="all time"                        emoji="🏆" color="#ce82ff" shadow="#a560d8" />
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Left col: progress + activity */}
        <div className="lg:col-span-2 space-y-5">

          {/* Learning paths */}
          <div className="duo-card p-5">
            <h2 className="section-title mb-5">📊 Learning Progress</h2>
            <div className="space-y-4">
              <ProgressRow label="Kana Mastery" value={kanaMastery}    color="#1cb0f6" href="/learn/kana"    emoji="あ" />
              <ProgressRow label="Vocabulary"   value={vocabProgress}  color="#ce82ff" href="/learn/vocab"   emoji="📖" />
              <ProgressRow label="Grammar"      value={grammarProgress} color="#ff9600" href="/learn/grammar" emoji="📝" />
            </div>
          </div>

          {/* Activity chart */}
          <div className="duo-card p-5">
            <ActivityChart data={weeklyActivity} />
          </div>
        </div>

        {/* Right col: tasks + quick actions + badges */}
        <div className="space-y-5">

          {/* Daily tasks */}
          <div className="duo-card p-5">
            <h2 className="section-title mb-4">📋 Today&apos;s Plan</h2>
            <div className="space-y-2.5">
              {dailyTasks.map((task, i) => (
                <Link
                  key={i}
                  href={task.href}
                  className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 group"
                  style={
                    task.done
                      ? { background: "rgba(88,204,2,0.07)", borderColor: "rgba(88,204,2,0.3)" }
                      : { background: "var(--bg-secondary)", borderColor: "var(--border-color)" }
                  }
                >
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: task.done ? "rgba(88,204,2,0.15)" : `${task.color}15` }}
                  >
                    {task.done ? "✅" : task.icon}
                  </span>
                  <span
                    className="text-sm font-bold flex-1"
                    style={{ color: task.done ? "#ff4b8b" : "var(--text-primary)", textDecoration: task.done ? "line-through" : "none" }}
                  >
                    {task.label}
                  </span>
                  {task.count !== null && task.count > 0 && (
                    <span className="text-xs font-black text-white px-2 py-0.5 rounded-full" style={{ background: task.color }}>
                      {task.count}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="duo-card p-5">
            <h2 className="section-title mb-4">⚡ Quick Start</h2>
            <div className="space-y-2.5">
              <QuickAction href="/learn/kana"    label="Learn Kana"    emoji="あ" color="#ff86d0" shadow="#e060b0" id="quick-kana" />
              <QuickAction href="/learn/kanji"   label="Learn Kanji"   emoji="漢" color="#ff9600" shadow="#e08000" id="quick-kanji" />
              <QuickAction href="/flashcards"    label="Flashcards"    emoji="🃏" color="#ffc800" shadow="#e0a800" id="quick-flash" />
              <QuickAction href="/learn/vocab"   label="Study Vocab"   emoji="📖" color="#ce82ff" shadow="#a560d8" id="quick-vocab" />
              <QuickAction href="/review"        label="Review Cards"  emoji="🔄" color="#ff4b8b" shadow="#e0357a" id="quick-review" />
              <QuickAction href="/challenge"     label="Daily Challenge" emoji="⚡" color="#ff9600" shadow="#e08000" id="quick-challenge" />
            </div>
          </div>

          {/* Badges */}
          <div className="duo-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title text-base">🏆 Badges</h2>
              <Link href="/profile" className="text-xs font-bold" style={{ color: "#1cb0f6" }}>
                View all →
              </Link>
            </div>
            {progress.unlockedBadges.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-3xl mb-2">🎯</p>
                <p className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
                  Start learning to earn badges!
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {progress.unlockedBadges.slice(0, 6).map((id) => {
                  const badge = ALL_BADGES.find((b) => b.id === id);
                  return badge ? (
                    <div
                      key={id}
                      title={badge.name}
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border-2 transition-transform hover:scale-110"
                      style={{ background: "rgba(255,200,0,0.1)", borderColor: "rgba(255,200,0,0.35)", boxShadow: "0 2px 0 rgba(255,200,0,0.4)" }}
                    >
                      {badge.emoji}
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({ label, value, sub, emoji, color, shadow }: {
  label: string; value: string; sub: string; emoji: string; color: string; shadow: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 border-2 flex flex-col gap-1.5"
      style={{
        background: "var(--bg-card)",
        borderColor: `${color}35`,
        boxShadow: `0 4px 0 ${shadow}30`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
        <span className="text-xl">{emoji}</span>
      </div>
      <p className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>{value}</p>
      <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{sub}</p>
    </div>
  );
}

function ProgressRow({ label, value, color, href, emoji }: {
  label: string; value: number; color: string; href: string; emoji: string;
}) {
  return (
    <Link href={href} className="block group">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
          style={{ background: `${color}18` }}
        >
          {emoji}
        </span>
        <span className="text-sm font-bold flex-1" style={{ color: "var(--text-primary)" }}>
          {label}
        </span>
        <span className="text-sm font-black" style={{ color }}>{value}%</span>
      </div>
      <div className="progress-bar ml-9">
        <div
          className="progress-bar-fill"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)` }}
        />
      </div>
    </Link>
  );
}

function QuickAction({ href, label, emoji, color, shadow, id }: {
  href: string; label: string; emoji: string; color: string; shadow: string; id: string;
}) {
  return (
    <Link
      href={href}
      id={id}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-150 hover:translate-y-[-1px] active:translate-y-[1px]"
      style={{
        background: `${color}10`,
        borderColor: `${color}40`,
        boxShadow: `0 3px 0 ${shadow}40`,
        color,
      }}
    >
      <span className="text-lg">{emoji}</span>
      <span>{label}</span>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse pb-8">
      <div className="h-14 rounded-2xl w-2/3" style={{ background: "var(--border-color)" }} />
      <div className="h-16 duo-card rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl" style={{ background: "var(--bg-card)", border: "2px solid var(--border-color)" }} />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="h-52 duo-card" />
          <div className="h-44 duo-card" />
        </div>
        <div className="space-y-5">
          <div className="h-56 duo-card" />
          <div className="h-36 duo-card" />
        </div>
      </div>
    </div>
  );
}
