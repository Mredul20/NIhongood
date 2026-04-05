import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "@/lib/database";

interface LearningState {
  // Kana progress
  learnedKana: Record<string, boolean>; // char -> learned
  kanaQuizScores: Record<string, number>; // char -> best score

  // Vocab progress
  learnedVocab: Record<string, boolean>; // id -> learned
  vocabQuizScores: Record<string, number>;

  // Grammar progress
  completedGrammar: Record<string, boolean>; // id -> completed
  grammarQuizScores: Record<string, number>;

  // Actions
  markKanaLearned: (char: string) => void;
  setKanaQuizScore: (char: string, score: number) => void;
  markVocabLearned: (id: string) => void;
  setVocabQuizScore: (id: string, score: number) => void;
  markGrammarCompleted: (id: string) => void;
  setGrammarQuizScore: (id: string, score: number) => void;

  // Computed helpers
  getKanaMastery: () => number;
  getVocabProgress: () => number;
  getGrammarProgress: () => number;
  
  // Sync methods
  loadFromSupabase: (userId: string) => Promise<void>;
  syncToSupabase: (userId: string) => Promise<void>;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      learnedKana: {},
      kanaQuizScores: {},
      learnedVocab: {},
      vocabQuizScores: {},
      completedGrammar: {},
      grammarQuizScores: {},

      markKanaLearned: (char) =>
        set((s) => ({ learnedKana: { ...s.learnedKana, [char]: true } })),

      setKanaQuizScore: (char, score) =>
        set((s) => ({
          kanaQuizScores: {
            ...s.kanaQuizScores,
            [char]: Math.max(s.kanaQuizScores[char] || 0, score),
          },
        })),

      markVocabLearned: (id) =>
        set((s) => ({ learnedVocab: { ...s.learnedVocab, [id]: true } })),

      setVocabQuizScore: (id, score) =>
        set((s) => ({
          vocabQuizScores: {
            ...s.vocabQuizScores,
            [id]: Math.max(s.vocabQuizScores[id] || 0, score),
          },
        })),

      markGrammarCompleted: (id) =>
        set((s) => ({ completedGrammar: { ...s.completedGrammar, [id]: true } })),

      setGrammarQuizScore: (id, score) =>
        set((s) => ({
          grammarQuizScores: {
            ...s.grammarQuizScores,
            [id]: Math.max(s.grammarQuizScores[id] || 0, score),
          },
        })),

      getKanaMastery: () => {
        // 46 hiragana + 46 katakana — keep in sync with kana data file
        const TOTAL_KANA = 92;
        const learned = Object.values(get().learnedKana).filter(Boolean).length;
        return Math.round((learned / TOTAL_KANA) * 100);
      },

      getVocabProgress: () => {
        // Matches VOCABULARY array length in src/data/vocabulary.ts
        const TOTAL_VOCAB = 50;
        const learned = Object.values(get().learnedVocab).filter(Boolean).length;
        return Math.round((learned / TOTAL_VOCAB) * 100);
      },

      getGrammarProgress: () => {
        // Matches grammar lessons count in src/data/grammar.ts
        const TOTAL_GRAMMAR = 10;
        const completed = Object.values(get().completedGrammar).filter(Boolean).length;
        return Math.round((completed / TOTAL_GRAMMAR) * 100);
      },

      loadFromSupabase: async (userId: string) => {
        try {
          const learning = await db.getLearningProgress(userId);

          if (learning) {
            const learnedKana: Record<string, boolean> = {};
            const learnedVocab: Record<string, boolean> = {};
            const completedGrammar: Record<string, boolean> = {};

            // Convert arrays to objects
            (learning.learned_kana || []).forEach((item) => {
              learnedKana[item] = true;
            });
            (learning.learned_vocab || []).forEach((item) => {
              learnedVocab[item] = true;
            });
            (learning.completed_grammar || []).forEach((item) => {
              completedGrammar[item] = true;
            });

            set({
              learnedKana,
              learnedVocab,
              completedGrammar,
            });
          }
        } catch (error) {
          console.error("Error loading learning progress from Supabase:", error);
        }
      },

      syncToSupabase: async (userId: string) => {
        try {
          const state = get();

          await db.updateLearningProgress(userId, {
            learned_kana: Object.keys(state.learnedKana).filter((k) => state.learnedKana[k]),
            learned_vocab: Object.keys(state.learnedVocab).filter((k) => state.learnedVocab[k]),
            completed_grammar: Object.keys(state.completedGrammar).filter((k) => state.completedGrammar[k]),
          });
        } catch (error) {
          console.error("Error syncing learning progress to Supabase:", error);
        }
      },
    }),
    { name: "nihongood-learning" }
  )
);
