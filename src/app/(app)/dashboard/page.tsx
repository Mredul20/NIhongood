"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
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

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    // Check badges whenever dashboard loads
    progress.checkBadges({
      totalReviews: progress.totalReviews,
      streak: progress.currentStreak,
      vocabLearned: Object.keys(learning.learnedVocab).length,
      hiraganaLearned: Object.keys(learning.learnedKana).filter((k) =>
        k.charCodeAt(0) >= 0x3040 && k.charCodeAt(0) <= 0x309f
      ).length,
      katakanaLearned: Object.keys(learning.learnedKana).filter((k) =>
        k.charCodeAt(0) >= 0x30a0 && k.charCodeAt(0) <= 0x30ff
      ).length,
      kanaLearned: Object.keys(learning.learnedKana).length,
      grammarCompleted: Object.keys(learning.completedGrammar).length,
      totalXP: progress.totalXP,
      level: progress.level,
    });
  }, [mounted]);

  if (!mounted) return <DashboardSkeleton />;

  const cardCount = srs.getCardCount();
  const weeklyActivity = progress.getWeeklyActivity();
  const todayLog = progress.getTodayLog();
  const kanaMastery = learning.getKanaMastery();
  const vocabProgress = learning.getVocabProgress();
  const grammarProgress = learning.getGrammarProgress();
  const xpForNext = progress.getXPForNextLevel();

  // Daily tasks
  const dailyTasks = [
    { label: `Review ${cardCount.due} due cards`, done: cardCount.due === 0, href: "/review", icon: "🔄" },
    { label: "Learn new vocabulary", done: vocabProgress >= 100, href: "/learn/vocab", icon: "📖" },
    { label: "Study a grammar point", done: grammarProgress >= 100, href: "/learn/grammar", icon: "📝" },
    { label: "Practice kana", done: kanaMastery >= 100, href: "/learn/kana", icon: "あ" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Welcome back, <span className="text-gradient-sakura">{user?.name}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1">
            {progress.currentStreak > 0
              ? `🔥 ${progress.currentStreak} day streak! Keep it going!`
              : "Start studying to begin your streak!"}
          </p>
        </div>
        <Link href="/review" className="btn-primary flex items-center gap-2 w-fit" id="start-review-btn">
          <span>🔄</span>
          <span>Start Review {cardCount.due > 0 && `(${cardCount.due})`}</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Level"
          value={progress.level.toString()}
          sub={`${xpForNext} XP to next`}
          gradient="from-sakura-500 to-sakura-600"
          icon="⚡"
        />
        <StatCard
          label="Total XP"
          value={progress.totalXP.toString()}
          sub={`${todayLog.xpEarned} earned today`}
          gradient="from-gold-400 to-gold-500"
          icon="💎"
        />
        <StatCard
          label="Streak"
          value={`${progress.currentStreak}d`}
          sub={`Best: ${progress.longestStreak}d`}
          gradient="from-orange-400 to-red-500"
          icon="🔥"
        />
        <StatCard
          label="Cards"
          value={cardCount.total.toString()}
          sub={`${cardCount.due} due now`}
          gradient="from-teal-400 to-teal-500"
          icon="🃏"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mastery Progress */}
          <div className="glass-card p-6">
            <h2 className="section-title mb-6">
              <span>📊</span> Learning Progress
            </h2>
            <div className="space-y-5">
              <ProgressRow label="Kana Mastery" value={kanaMastery} color="bg-sakura-400" href="/learn/kana" />
              <ProgressRow label="Vocabulary" value={vocabProgress} color="bg-teal-400" href="/learn/vocab" />
              <ProgressRow label="Grammar" value={grammarProgress} color="bg-gold-400" href="/learn/grammar" />
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <ActivityChart data={weeklyActivity} />
        </div>

        {/* Sidebar: Daily Tasks + Quick Actions */}
        <div className="space-y-6">
          {/* Daily Tasks */}
          <div className="glass-card p-6">
            <h2 className="section-title mb-4">
              <span>📋</span> Today&apos;s Plan
            </h2>
            <div className="space-y-3">
              {dailyTasks.map((task, i) => (
                <Link
                  key={i}
                  href={task.href}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    task.done
                      ? "bg-teal-500/10 border border-teal-500/20"
                      : "bg-navy-800/40 border border-white/5 hover:border-sakura-400/20 hover:bg-sakura-500/5"
                  }`}
                >
                  <span className="text-lg">{task.done ? "✅" : task.icon}</span>
                  <span className={`text-sm font-medium ${task.done ? "text-teal-400 line-through" : "text-slate-300"}`}>
                    {task.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h2 className="section-title mb-4">
              <span>⚡</span> Quick Start
            </h2>
            <div className="space-y-2">
              <Link href="/learn/kana" className="block w-full btn-secondary text-center text-sm" id="quick-kana">
                🎌 Learn Kana
              </Link>
              <Link href="/learn/vocab" className="block w-full btn-secondary text-center text-sm" id="quick-vocab">
                📖 Study Vocab
              </Link>
              <Link href="/review" className="block w-full btn-secondary text-center text-sm" id="quick-review">
                🔄 Review Cards
              </Link>
            </div>
          </div>

          {/* Badges preview */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title text-base">
                <span>🏆</span> Badges
              </h2>
              <Link href="/profile" className="text-xs text-sakura-400 hover:text-sakura-300">View all →</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {progress.unlockedBadges.length === 0 ? (
                <p className="text-sm text-slate-500">Start learning to earn badges!</p>
              ) : (
                progress.unlockedBadges.slice(0, 6).map((id) => {
                  const badge = require("@/store/progressStore").ALL_BADGES.find((b: { id: string }) => b.id === id);
                  return badge ? (
                    <div key={id} className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-lg" title={badge.name}>
                      {badge.emoji}
                    </div>
                  ) : null;
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, gradient, icon }: {
  label: string; value: string; sub: string; gradient: string; icon: string;
}) {
  return (
    <div className="glass-card-hover p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-sm shadow-lg`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

function ProgressRow({ label, value, color, href }: {
  label: string; value: number; color: string; href: string;
}) {
  return (
    <Link href={href} className="block group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">{label}</span>
        <span className="text-sm font-bold text-slate-400">{value}%</span>
      </div>
      <div className="progress-bar">
        <div className={`progress-bar-fill ${color}`} style={{ width: `${value}%` }} />
      </div>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-12 bg-navy-800/40 rounded-xl w-2/3" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 h-28" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 h-52" />
          <div className="glass-card p-6 h-52" />
        </div>
        <div className="space-y-6">
          <div className="glass-card p-6 h-64" />
          <div className="glass-card p-6 h-40" />
        </div>
      </div>
    </div>
  );
}
