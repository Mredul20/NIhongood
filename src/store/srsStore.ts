import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SRSCard {
  id: string;
  front: string;       // Japanese
  back: string;        // English meaning
  reading?: string;    // Hiragana reading
  type: "kana" | "vocab" | "grammar";
  interval: number;    // days until next review
  easeFactor: number;  // multiplier (starts at 2.5)
  nextReview: string;  // ISO date string
  repetitions: number;
  lastReview?: string;
  createdAt?: string;  // When the card was added
  reviewCount?: number; // Total number of reviews
  lapseCount?: number;  // Number of times "Again" was pressed
}

type Rating = "again" | "hard" | "good" | "easy";

export interface SRSInsights {
  totalCards: number;
  matureCards: number;      // interval >= 21 days
  youngCards: number;       // interval 1-20 days
  newCards: number;         // never reviewed
  averageEase: number;
  averageInterval: number;
  retentionRate: number;    // % of reviews that weren't "again"
  upcomingReviews: { date: string; count: number }[];
  cardsByType: { kana: number; vocab: number; grammar: number };
  strugglingCards: SRSCard[]; // Cards with low ease factor
}

interface SRSState {
  cards: SRSCard[];
  reviewHistory: { date: string; correct: number; total: number }[];

  // Actions
  addCard: (card: Omit<SRSCard, "interval" | "easeFactor" | "nextReview" | "repetitions">) => void;
  removeCard: (id: string) => void;
  reviewCard: (id: string, rating: Rating) => void;
  getDueCards: () => SRSCard[];
  getCardCount: () => { total: number; due: number; learned: number; new: number };
  hasCard: (id: string) => boolean;
  
  // New insight methods
  getInsights: () => SRSInsights;
  getCardExplanation: (card: SRSCard) => CardExplanation;
}

export interface CardExplanation {
  whyDue: string;
  currentStatus: string;
  easeDescription: string;
  intervalHistory: string;
  nextSteps: { rating: Rating; interval: number; explanation: string }[];
}

function getEaseDescription(ease: number): string {
  if (ease >= 2.5) return "Easy - You're doing great with this card!";
  if (ease >= 2.0) return "Normal - This card is progressing well";
  if (ease >= 1.7) return "Challenging - You've had some difficulty here";
  return "Difficult - This card needs more attention";
}

function getWhyDue(card: SRSCard): string {
  if (card.repetitions === 0) {
    return "This is a new card you haven't reviewed yet.";
  }
  
  if (card.lastReview) {
    const lastReviewDate = new Date(card.lastReview);
    const daysSince = Math.floor((Date.now() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince === 0) {
      return "You reviewed this today, but it was marked for immediate review.";
    } else if (daysSince === 1) {
      return `Scheduled after your review yesterday (${card.interval} day interval).`;
    } else {
      return `Scheduled ${card.interval} days after your last review on ${lastReviewDate.toLocaleDateString()}.`;
    }
  }
  
  return "This card is due for review based on the SRS algorithm.";
}

function getCurrentStatus(card: SRSCard): string {
  if (card.repetitions === 0) return "New";
  if (card.interval >= 21) return "Mature";
  if (card.interval >= 7) return "Learning (intermediate)";
  return "Learning (early)";
}

function calculateNextReview(card: SRSCard, rating: Rating): Partial<SRSCard> {
  let { interval, easeFactor, repetitions } = card;

  switch (rating) {
    case "again":
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      repetitions = 0;
      break;
    case "hard":
      interval = Math.max(1, Math.round(interval * 1.2));
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      repetitions += 1;
      break;
    case "good":
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
      break;
    case "easy":
      if (repetitions === 0) {
        interval = 4;
      } else {
        interval = Math.round(interval * easeFactor * 1.3);
      }
      easeFactor += 0.15;
      repetitions += 1;
      break;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    interval,
    easeFactor,
    repetitions,
    nextReview: nextReview.toISOString(),
    lastReview: new Date().toISOString(),
  };
}

export const useSRSStore = create<SRSState>()(
  persist(
    (set, get) => ({
      cards: [],
      reviewHistory: [],

      addCard: (cardData) => {
        const newCard: SRSCard = {
          ...cardData,
          interval: 0,
          easeFactor: 2.5,
          nextReview: new Date().toISOString(),
          repetitions: 0,
        };
        set((s) => ({ cards: [...s.cards, newCard] }));
      },

      removeCard: (id) => {
        set((s) => ({ cards: s.cards.filter((c) => c.id !== id) }));
      },

      reviewCard: (id, rating) => {
        const today = new Date().toISOString().split("T")[0];
        set((s) => {
          const updatedCards = s.cards.map((card) => {
            if (card.id !== id) return card;
            return { ...card, ...calculateNextReview(card, rating) };
          });

          // Update review history
          const existingEntry = s.reviewHistory.find((h) => h.date === today);
          let reviewHistory: typeof s.reviewHistory;
          const isCorrect = rating !== "again";

          if (existingEntry) {
            reviewHistory = s.reviewHistory.map((h) =>
              h.date === today
                ? { ...h, correct: h.correct + (isCorrect ? 1 : 0), total: h.total + 1 }
                : h
            );
          } else {
            reviewHistory = [
              ...s.reviewHistory,
              { date: today, correct: isCorrect ? 1 : 0, total: 1 },
            ];
          }

          return { cards: updatedCards, reviewHistory };
        });
      },

      getDueCards: () => {
        const now = new Date();
        return get().cards.filter((card) => new Date(card.nextReview) <= now);
      },

      getCardCount: () => {
        const cards = get().cards;
        const now = new Date();
        const due = cards.filter((c) => new Date(c.nextReview) <= now).length;
        const newCards = cards.filter((c) => c.repetitions === 0).length;
        const learned = cards.filter((c) => c.repetitions > 0).length;
        return { total: cards.length, due, learned, new: newCards };
      },

      hasCard: (id) => get().cards.some((c) => c.id === id),

      getInsights: () => {
        const cards = get().cards;
        const reviewHistory = get().reviewHistory;
        
        const totalCards = cards.length;
        const matureCards = cards.filter(c => c.interval >= 21).length;
        const youngCards = cards.filter(c => c.repetitions > 0 && c.interval < 21).length;
        const newCards = cards.filter(c => c.repetitions === 0).length;
        
        const averageEase = totalCards > 0 
          ? cards.reduce((sum, c) => sum + c.easeFactor, 0) / totalCards 
          : 2.5;
        
        const reviewedCards = cards.filter(c => c.repetitions > 0);
        const averageInterval = reviewedCards.length > 0
          ? reviewedCards.reduce((sum, c) => sum + c.interval, 0) / reviewedCards.length
          : 0;
        
        // Calculate retention rate from history
        const totalReviews = reviewHistory.reduce((sum, h) => sum + h.total, 0);
        const correctReviews = reviewHistory.reduce((sum, h) => sum + h.correct, 0);
        const retentionRate = totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0;
        
        // Upcoming reviews for next 7 days
        const upcomingReviews: { date: string; count: number }[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split("T")[0];
          const count = cards.filter(c => {
            const reviewDate = new Date(c.nextReview).toISOString().split("T")[0];
            return reviewDate === dateStr;
          }).length;
          upcomingReviews.push({ date: dateStr, count });
        }
        
        // Cards by type
        const cardsByType = {
          kana: cards.filter(c => c.type === "kana").length,
          vocab: cards.filter(c => c.type === "vocab").length,
          grammar: cards.filter(c => c.type === "grammar").length,
        };
        
        // Struggling cards (low ease factor)
        const strugglingCards = cards
          .filter(c => c.easeFactor < 2.0 && c.repetitions > 0)
          .sort((a, b) => a.easeFactor - b.easeFactor)
          .slice(0, 5);
        
        return {
          totalCards,
          matureCards,
          youngCards,
          newCards,
          averageEase,
          averageInterval,
          retentionRate,
          upcomingReviews,
          cardsByType,
          strugglingCards,
        };
      },

      getCardExplanation: (card: SRSCard): CardExplanation => {
        const whyDue = getWhyDue(card);
        const currentStatus = getCurrentStatus(card);
        const easeDescription = getEaseDescription(card.easeFactor);
        
        let intervalHistory = "";
        if (card.repetitions === 0) {
          intervalHistory = "This card hasn't been reviewed yet.";
        } else {
          intervalHistory = `Reviewed ${card.repetitions} time${card.repetitions > 1 ? "s" : ""}. Current interval: ${card.interval} day${card.interval > 1 ? "s" : ""}.`;
        }
        
        // Calculate what each rating would do
        const nextSteps: CardExplanation["nextSteps"] = [
          {
            rating: "again",
            interval: 1,
            explanation: "Resets the card. You'll see it again tomorrow."
          },
          {
            rating: "hard",
            interval: Math.max(1, Math.round(card.interval * 1.2)),
            explanation: "Slightly increases interval but reduces ease factor."
          },
          {
            rating: "good",
            interval: card.repetitions === 0 ? 1 : card.repetitions === 1 ? 6 : Math.round(card.interval * card.easeFactor),
            explanation: "Standard progression. Multiplies interval by ease factor."
          },
          {
            rating: "easy",
            interval: card.repetitions === 0 ? 4 : Math.round(card.interval * card.easeFactor * 1.3),
            explanation: "Boosts interval by 1.3x and increases ease factor."
          }
        ];
        
        return {
          whyDue,
          currentStatus,
          easeDescription,
          intervalHistory,
          nextSteps,
        };
      },
    }),
    { name: "nihongood-srs" }
  )
);
