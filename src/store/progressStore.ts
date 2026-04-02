import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: string;
  unlockedAt?: string;
}

export const ALL_BADGES: Badge[] = [
  { id: "first-review", name: "First Steps", description: "Complete your first review", emoji: "⭐", condition: "totalReviews >= 1" },
  { id: "streak-3", name: "Getting Started", description: "Maintain a 3-day streak", emoji: "🔥", condition: "streak >= 3" },
  { id: "streak-7", name: "Week Warrior", description: "Maintain a 7-day streak", emoji: "🔥", condition: "streak >= 7" },
  { id: "streak-30", name: "Monthly Master", description: "Maintain a 30-day streak", emoji: "💪", condition: "streak >= 30" },
  { id: "vocab-10", name: "Word Collector", description: "Learn 10 vocabulary words", emoji: "📖", condition: "vocabLearned >= 10" },
  { id: "vocab-25", name: "Wordsmith", description: "Learn 25 vocabulary words", emoji: "📚", condition: "vocabLearned >= 25" },
  { id: "vocab-50", name: "Lexicon Legend", description: "Learn all 50 vocabulary words", emoji: "🏆", condition: "vocabLearned >= 50" },
  { id: "kana-hiragana", name: "Hiragana Hero", description: "Learn all hiragana characters", emoji: "🎌", condition: "hiraganaLearned >= 46" },
  { id: "kana-katakana", name: "Katakana King", description: "Learn all katakana characters", emoji: "👑", condition: "katakanaLearned >= 46" },
  { id: "kana-master", name: "Kana Master", description: "Master all kana", emoji: "🏯", condition: "kanaLearned >= 92" },
  { id: "grammar-5", name: "Grammar Guru", description: "Complete 5 grammar lessons", emoji: "📝", condition: "grammarCompleted >= 5" },
  { id: "grammar-all", name: "Grammar God", description: "Complete all grammar lessons", emoji: "🧠", condition: "grammarCompleted >= 10" },
  { id: "xp-100", name: "Centurion", description: "Earn 100 XP", emoji: "💎", condition: "totalXP >= 100" },
  { id: "xp-500", name: "Rising Star", description: "Earn 500 XP", emoji: "🌟", condition: "totalXP >= 500" },
  { id: "xp-1000", name: "Legendary", description: "Earn 1000 XP", emoji: "🐉", condition: "totalXP >= 1000" },
  { id: "reviews-50", name: "Dedicated Learner", description: "Complete 50 reviews", emoji: "🎯", condition: "totalReviews >= 50" },
  { id: "reviews-100", name: "Review Machine", description: "Complete 100 reviews", emoji: "⚡", condition: "totalReviews >= 100" },
  { id: "level-5", name: "Level 5", description: "Reach level 5", emoji: "🥉", condition: "level >= 5" },
  { id: "level-10", name: "Level 10", description: "Reach level 10", emoji: "🥈", condition: "level >= 10" },
];

interface DailyLog {
  date: string;
  timeSpent: number; // minutes
  xpEarned: number;
  reviewsDone: number;
  lessonsCompleted: number;
}

interface ProgressState {
  // XP & Levels
  totalXP: number;
  level: number;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;

  // Stats
  totalReviews: number;
  totalStudyMinutes: number;

  // Daily logs
  dailyLogs: DailyLog[];

  // Badges
  unlockedBadges: string[];
  newBadgeId: string | null; // for toast notification

  // Actions
  addXP: (amount: number) => void;
  recordStudySession: (minutes: number) => void;
  recordReview: () => void;
  recordLessonComplete: () => void;
  checkBadges: (stats: BadgeCheckStats) => void;
  dismissBadgeNotification: () => void;
  getTodayLog: () => DailyLog;
  getWeeklyActivity: () => DailyLog[];
  getXPForNextLevel: () => number;
}

export interface BadgeCheckStats {
  totalReviews: number;
  streak: number;
  vocabLearned: number;
  hiraganaLearned: number;
  katakanaLearned: number;
  kanaLearned: number;
  grammarCompleted: number;
  totalXP: number;
  level: number;
}

function getLevel(xp: number): number {
  // Each level requires progressively more XP
  // Level 1: 0, Level 2: 50, Level 3: 120, Level 4: 210...
  let level = 1;
  let threshold = 0;
  while (threshold <= xp) {
    level++;
    threshold += level * 30;
  }
  return level - 1;
}

function getXPForLevel(level: number): number {
  let total = 0;
  for (let i = 2; i <= level + 1; i++) {
    total += i * 30;
  }
  return total;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      totalReviews: 0,
      totalStudyMinutes: 0,
      dailyLogs: [],
      unlockedBadges: [],
      newBadgeId: null,

      addXP: (amount) => {
        set((s) => {
          const newXP = s.totalXP + amount;
          const newLevel = getLevel(newXP);

          // Update today's log
          const today = getToday();
          const logs = [...s.dailyLogs];
          const todayIdx = logs.findIndex((l) => l.date === today);
          if (todayIdx >= 0) {
            logs[todayIdx] = { ...logs[todayIdx], xpEarned: logs[todayIdx].xpEarned + amount };
          } else {
            logs.push({ date: today, timeSpent: 0, xpEarned: amount, reviewsDone: 0, lessonsCompleted: 0 });
          }

          return { totalXP: newXP, level: newLevel, dailyLogs: logs };
        });
      },

      recordStudySession: (minutes) => {
        const today = getToday();
        set((s) => {
          let { currentStreak, longestStreak, lastStudyDate } = s;

          if (lastStudyDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];

            if (lastStudyDate === yesterdayStr) {
              currentStreak += 1;
            } else if (lastStudyDate !== today) {
              currentStreak = 1;
            }
            longestStreak = Math.max(longestStreak, currentStreak);
            lastStudyDate = today;
          }

          // Update today's log
          const logs = [...s.dailyLogs];
          const todayIdx = logs.findIndex((l) => l.date === today);
          if (todayIdx >= 0) {
            logs[todayIdx] = { ...logs[todayIdx], timeSpent: logs[todayIdx].timeSpent + minutes };
          } else {
            logs.push({ date: today, timeSpent: minutes, xpEarned: 0, reviewsDone: 0, lessonsCompleted: 0 });
          }

          return {
            currentStreak,
            longestStreak,
            lastStudyDate,
            totalStudyMinutes: s.totalStudyMinutes + minutes,
            dailyLogs: logs,
          };
        });
      },

      recordReview: () => {
        const today = getToday();
        set((s) => {
          const logs = [...s.dailyLogs];
          const todayIdx = logs.findIndex((l) => l.date === today);
          if (todayIdx >= 0) {
            logs[todayIdx] = { ...logs[todayIdx], reviewsDone: logs[todayIdx].reviewsDone + 1 };
          } else {
            logs.push({ date: today, timeSpent: 0, xpEarned: 0, reviewsDone: 1, lessonsCompleted: 0 });
          }
          return { totalReviews: s.totalReviews + 1, dailyLogs: logs };
        });
      },

      recordLessonComplete: () => {
        const today = getToday();
        set((s) => {
          const logs = [...s.dailyLogs];
          const todayIdx = logs.findIndex((l) => l.date === today);
          if (todayIdx >= 0) {
            logs[todayIdx] = { ...logs[todayIdx], lessonsCompleted: logs[todayIdx].lessonsCompleted + 1 };
          } else {
            logs.push({ date: today, timeSpent: 0, xpEarned: 0, reviewsDone: 0, lessonsCompleted: 1 });
          }
          return { dailyLogs: logs };
        });
      },

      checkBadges: (stats) => {
        set((s) => {
          const newBadges: string[] = [];

          for (const badge of ALL_BADGES) {
            if (s.unlockedBadges.includes(badge.id)) continue;

            let unlocked = false;
            switch (badge.id) {
              case "first-review": unlocked = stats.totalReviews >= 1; break;
              case "streak-3": unlocked = stats.streak >= 3; break;
              case "streak-7": unlocked = stats.streak >= 7; break;
              case "streak-30": unlocked = stats.streak >= 30; break;
              case "vocab-10": unlocked = stats.vocabLearned >= 10; break;
              case "vocab-25": unlocked = stats.vocabLearned >= 25; break;
              case "vocab-50": unlocked = stats.vocabLearned >= 50; break;
              case "kana-hiragana": unlocked = stats.hiraganaLearned >= 46; break;
              case "kana-katakana": unlocked = stats.katakanaLearned >= 46; break;
              case "kana-master": unlocked = stats.kanaLearned >= 92; break;
              case "grammar-5": unlocked = stats.grammarCompleted >= 5; break;
              case "grammar-all": unlocked = stats.grammarCompleted >= 10; break;
              case "xp-100": unlocked = stats.totalXP >= 100; break;
              case "xp-500": unlocked = stats.totalXP >= 500; break;
              case "xp-1000": unlocked = stats.totalXP >= 1000; break;
              case "reviews-50": unlocked = stats.totalReviews >= 50; break;
              case "reviews-100": unlocked = stats.totalReviews >= 100; break;
              case "level-5": unlocked = stats.level >= 5; break;
              case "level-10": unlocked = stats.level >= 10; break;
            }

            if (unlocked) newBadges.push(badge.id);
          }

          if (newBadges.length > 0) {
            return {
              unlockedBadges: [...s.unlockedBadges, ...newBadges],
              newBadgeId: newBadges[0],
            };
          }
          return {};
        });
      },

      dismissBadgeNotification: () => set({ newBadgeId: null }),

      getTodayLog: () => {
        const today = getToday();
        const log = get().dailyLogs.find((l) => l.date === today);
        return log || { date: today, timeSpent: 0, xpEarned: 0, reviewsDone: 0, lessonsCompleted: 0 };
      },

      getWeeklyActivity: () => {
        const logs = get().dailyLogs;
        const result: DailyLog[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          const existing = logs.find((l) => l.date === dateStr);
          result.push(existing || { date: dateStr, timeSpent: 0, xpEarned: 0, reviewsDone: 0, lessonsCompleted: 0 });
        }
        return result;
      },

      getXPForNextLevel: () => {
        const state = get();
        return getXPForLevel(state.level + 1) - state.totalXP;
      },
    }),
    { name: "nihongood-progress" }
  )
);
