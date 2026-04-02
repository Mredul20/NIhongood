import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "@/lib/database";

// User experience levels for progressive disclosure
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

// SRS automation levels - how much control the user wants
export type AutomationLevel = "automatic" | "guided" | "manual";

export interface SRSSettings {
  // New card limits
  newCardsPerDay: number;
  // Review limits (0 = unlimited)
  maxReviewsPerDay: number;
  // Show interval predictions on rating buttons
  showIntervalPredictions: boolean;
  // Show ease factor in card info
  showEaseFactor: boolean;
  // Enable "easy" button (some users prefer simpler 3-button)
  enableEasyButton: boolean;
  // Auto-advance after rating (vs manual flip)
  autoAdvance: boolean;
  // Time to auto-advance (ms)
  autoAdvanceDelay: number;
}

export interface UIPreferences {
  // Show detailed stats or simplified view
  showDetailedStats: boolean;
  // Show SRS algorithm explanations
  showAlgorithmExplanations: boolean;
  // Enable card status bar during reviews
  showCardStatusBar: boolean;
  // Show "Why this card?" button
  showWhyThisCard: boolean;
  // Compact mode for experienced users
  compactMode: boolean;
  // Animation level: full, reduced, none
  animationLevel: "full" | "reduced" | "none";
}

export interface OnboardingState {
  // Has completed initial onboarding
  hasCompletedOnboarding: boolean;
  // Which features have been introduced
  introducedFeatures: string[];
  // Total reviews completed (for unlocking features)
  totalReviewsCompleted: number;
  // Days active (for unlocking features)
  daysActive: number;
  // First session date
  firstSessionDate: string | null;
  // Last session date (for calculating days active)
  lastSessionDate: string | null;
}

// Feature unlock thresholds
export const FEATURE_UNLOCKS = {
  srsInsights: { reviews: 10, description: "SRS Insights Panel" },
  easeFactorDisplay: { reviews: 25, description: "Ease Factor Display" },
  advancedSettings: { reviews: 50, description: "Advanced SRS Settings" },
  manualMode: { reviews: 100, description: "Manual Control Mode" },
} as const;

interface UserPreferencesState {
  experienceLevel: ExperienceLevel;
  automationLevel: AutomationLevel;
  srsSettings: SRSSettings;
  uiPreferences: UIPreferences;
  onboarding: OnboardingState;

  // Actions
  setExperienceLevel: (level: ExperienceLevel) => void;
  setAutomationLevel: (level: AutomationLevel) => void;
  updateSRSSettings: (settings: Partial<SRSSettings>) => void;
  updateUIPreferences: (prefs: Partial<UIPreferences>) => void;
  completeOnboarding: () => void;
  introduceFeature: (featureId: string) => void;
  recordReviewForUnlocks: () => void;
  recordSessionForUnlocks: () => void;
  
  // Computed helpers
  isFeatureUnlocked: (featureId: keyof typeof FEATURE_UNLOCKS) => boolean;
  isFeatureIntroduced: (featureId: string) => boolean;
  getUnlockedFeatures: () => string[];
  getNextUnlock: () => { feature: string; reviewsNeeded: number } | null;
  shouldShowFeature: (featureId: string) => boolean;
  
  // Presets
  applyBeginnerPreset: () => void;
  applyIntermediatePreset: () => void;
  applyAdvancedPreset: () => void;
  
  // Sync methods
  loadFromSupabase: (userId: string) => Promise<void>;
  syncToSupabase: (userId: string) => Promise<void>;
}

const DEFAULT_SRS_SETTINGS: SRSSettings = {
  newCardsPerDay: 10,
  maxReviewsPerDay: 0, // unlimited
  showIntervalPredictions: true,
  showEaseFactor: false,
  enableEasyButton: true,
  autoAdvance: false,
  autoAdvanceDelay: 1000,
};

const DEFAULT_UI_PREFERENCES: UIPreferences = {
  showDetailedStats: false,
  showAlgorithmExplanations: false,
  showCardStatusBar: false,
  showWhyThisCard: false,
  compactMode: false,
  animationLevel: "full",
};

const DEFAULT_ONBOARDING: OnboardingState = {
  hasCompletedOnboarding: false,
  introducedFeatures: [],
  totalReviewsCompleted: 0,
  daysActive: 0,
  firstSessionDate: null,
  lastSessionDate: null,
};

// Presets for different experience levels
const BEGINNER_PRESET = {
  srsSettings: {
    ...DEFAULT_SRS_SETTINGS,
    newCardsPerDay: 5,
    showIntervalPredictions: false,
    showEaseFactor: false,
    enableEasyButton: false, // Simpler 3-button interface
  },
  uiPreferences: {
    ...DEFAULT_UI_PREFERENCES,
    showDetailedStats: false,
    showAlgorithmExplanations: false,
    showCardStatusBar: false,
    showWhyThisCard: false,
    compactMode: false,
    animationLevel: "full" as const,
  },
};

const INTERMEDIATE_PRESET = {
  srsSettings: {
    ...DEFAULT_SRS_SETTINGS,
    newCardsPerDay: 10,
    showIntervalPredictions: true,
    showEaseFactor: false,
    enableEasyButton: true,
  },
  uiPreferences: {
    ...DEFAULT_UI_PREFERENCES,
    showDetailedStats: true,
    showAlgorithmExplanations: false,
    showCardStatusBar: true,
    showWhyThisCard: true,
    compactMode: false,
    animationLevel: "full" as const,
  },
};

const ADVANCED_PRESET = {
  srsSettings: {
    ...DEFAULT_SRS_SETTINGS,
    newCardsPerDay: 20,
    showIntervalPredictions: true,
    showEaseFactor: true,
    enableEasyButton: true,
    autoAdvance: true,
    autoAdvanceDelay: 800,
  },
  uiPreferences: {
    ...DEFAULT_UI_PREFERENCES,
    showDetailedStats: true,
    showAlgorithmExplanations: true,
    showCardStatusBar: true,
    showWhyThisCard: true,
    compactMode: true,
    animationLevel: "reduced" as const,
  },
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set, get) => ({
      experienceLevel: "beginner",
      automationLevel: "automatic",
      srsSettings: DEFAULT_SRS_SETTINGS,
      uiPreferences: DEFAULT_UI_PREFERENCES,
      onboarding: DEFAULT_ONBOARDING,

      setExperienceLevel: (level) => {
        set({ experienceLevel: level });
        // Auto-apply preset when changing levels
        if (level === "beginner") get().applyBeginnerPreset();
        else if (level === "intermediate") get().applyIntermediatePreset();
        else get().applyAdvancedPreset();
      },

      setAutomationLevel: (level) => set({ automationLevel: level }),

      updateSRSSettings: (settings) =>
        set((s) => ({
          srsSettings: { ...s.srsSettings, ...settings },
        })),

      updateUIPreferences: (prefs) =>
        set((s) => ({
          uiPreferences: { ...s.uiPreferences, ...prefs },
        })),

      completeOnboarding: () =>
        set((s) => ({
          onboarding: { ...s.onboarding, hasCompletedOnboarding: true },
        })),

      introduceFeature: (featureId) =>
        set((s) => ({
          onboarding: {
            ...s.onboarding,
            introducedFeatures: s.onboarding.introducedFeatures.includes(featureId)
              ? s.onboarding.introducedFeatures
              : [...s.onboarding.introducedFeatures, featureId],
          },
        })),

      recordReviewForUnlocks: () =>
        set((s) => ({
          onboarding: {
            ...s.onboarding,
            totalReviewsCompleted: s.onboarding.totalReviewsCompleted + 1,
          },
        })),

      recordSessionForUnlocks: () => {
        const today = new Date().toISOString().split("T")[0];
        const state = get();
        const { firstSessionDate, lastSessionDate, daysActive } = state.onboarding;
        
        let newDaysActive = daysActive;
        if (lastSessionDate !== today) {
          newDaysActive = daysActive + 1;
        }
        
        set({
          onboarding: {
            ...state.onboarding,
            firstSessionDate: firstSessionDate || today,
            lastSessionDate: today,
            daysActive: newDaysActive,
          },
        });
      },

      isFeatureUnlocked: (featureId) => {
        const { totalReviewsCompleted } = get().onboarding;
        const unlock = FEATURE_UNLOCKS[featureId];
        return totalReviewsCompleted >= unlock.reviews;
      },

      isFeatureIntroduced: (featureId) => {
        return get().onboarding.introducedFeatures.includes(featureId);
      },

      getUnlockedFeatures: () => {
        const { totalReviewsCompleted } = get().onboarding;
        return Object.entries(FEATURE_UNLOCKS)
          .filter(([, config]) => totalReviewsCompleted >= config.reviews)
          .map(([id]) => id);
      },

      getNextUnlock: () => {
        const { totalReviewsCompleted } = get().onboarding;
        const nextUnlock = Object.entries(FEATURE_UNLOCKS)
          .filter(([, config]) => totalReviewsCompleted < config.reviews)
          .sort((a, b) => a[1].reviews - b[1].reviews)[0];
        
        if (!nextUnlock) return null;
        
        return {
          feature: nextUnlock[1].description,
          reviewsNeeded: nextUnlock[1].reviews - totalReviewsCompleted,
        };
      },

      shouldShowFeature: (featureId) => {
        const state = get();
        const { experienceLevel } = state;
        
        // Advanced users see everything
        if (experienceLevel === "advanced") return true;
        
        // Check if it's a locked feature
        const featureKey = featureId as keyof typeof FEATURE_UNLOCKS;
        if (featureKey in FEATURE_UNLOCKS) {
          return state.isFeatureUnlocked(featureKey);
        }
        
        // For intermediate, show most features
        if (experienceLevel === "intermediate") return true;
        
        // Beginners only see basic features
        return false;
      },

      applyBeginnerPreset: () =>
        set({
          srsSettings: BEGINNER_PRESET.srsSettings,
          uiPreferences: BEGINNER_PRESET.uiPreferences,
        }),

      applyIntermediatePreset: () =>
        set({
          srsSettings: INTERMEDIATE_PRESET.srsSettings,
          uiPreferences: INTERMEDIATE_PRESET.uiPreferences,
        }),

      applyAdvancedPreset: () =>
        set({
          srsSettings: ADVANCED_PRESET.srsSettings,
          uiPreferences: ADVANCED_PRESET.uiPreferences,
        }),

      loadFromSupabase: async (userId: string) => {
        try {
          const preferences = await db.getUserPreferences(userId);

          if (preferences) {
            const srsSettings = (preferences.srs_settings as Partial<SRSSettings>) || DEFAULT_SRS_SETTINGS;
            const uiPreferences = (preferences.ui_preferences as Partial<UIPreferences>) || DEFAULT_UI_PREFERENCES;

            set({
              experienceLevel: (preferences.experience_level as ExperienceLevel) || "beginner",
              automationLevel: "automatic", // Not stored yet, default to automatic
              srsSettings: { ...DEFAULT_SRS_SETTINGS, ...srsSettings },
              uiPreferences: { ...DEFAULT_UI_PREFERENCES, ...uiPreferences },
              onboarding: {
                hasCompletedOnboarding: preferences.onboarding_completed || false,
                introducedFeatures: preferences.introduced_features || [],
                totalReviewsCompleted: preferences.total_reviews_completed || 0,
                daysActive: 0, // Not tracked separately, calculate if needed
                firstSessionDate: null,
                lastSessionDate: null,
              },
            });
          }
        } catch (error) {
          console.error("Error loading user preferences from Supabase:", error);
        }
      },

      syncToSupabase: async (userId: string) => {
        try {
          const state = get();

          await db.updateUserPreferences(userId, {
            experience_level: state.experienceLevel,
            srs_settings: state.srsSettings as any,
            ui_preferences: state.uiPreferences as any,
            onboarding_completed: state.onboarding.hasCompletedOnboarding,
            introduced_features: state.onboarding.introducedFeatures,
            total_reviews_completed: state.onboarding.totalReviewsCompleted,
          });
        } catch (error) {
          console.error("Error syncing user preferences to Supabase:", error);
        }
      },
    }),
    { name: "nihongood-user-preferences" }
  )
);
