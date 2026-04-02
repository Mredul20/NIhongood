import { create } from "zustand";
import { persist } from "zustand/middleware";

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
        const total = 92; // 46 hiragana + 46 katakana
        const learned = Object.keys(get().learnedKana).length;
        return Math.round((learned / total) * 100);
      },

      getVocabProgress: () => {
        const total = 50;
        const learned = Object.keys(get().learnedVocab).length;
        return Math.round((learned / total) * 100);
      },

      getGrammarProgress: () => {
        const total = 10;
        const completed = Object.keys(get().completedGrammar).length;
        return Math.round((completed / total) * 100);
      },
    }),
    { name: "nihongood-learning" }
  )
);
