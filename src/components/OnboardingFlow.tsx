"use client";

import { useState } from "react";
import { 
  useUserPreferencesStore, 
  ExperienceLevel,
  FEATURE_UNLOCKS 
} from "@/store/userPreferencesStore";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>("beginner");
  const { setExperienceLevel, completeOnboarding } = useUserPreferencesStore();

  const handleComplete = () => {
    setExperienceLevel(selectedLevel);
    completeOnboarding();
    onComplete();
  };

  const steps = [
    <WelcomeStep key="welcome" onNext={() => setStep(1)} />,
    <ExperienceLevelStep 
      key="level" 
      selected={selectedLevel} 
      onSelect={setSelectedLevel}
      onNext={() => setStep(2)} 
      onBack={() => setStep(0)}
    />,
    <SRSExplanationStep 
      key="srs" 
      level={selectedLevel}
      onNext={() => setStep(3)} 
      onBack={() => setStep(1)}
    />,
    <FeaturePreviewStep 
      key="features" 
      level={selectedLevel}
      onComplete={handleComplete}
      onBack={() => setStep(2)}
    />,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step
                  ? "w-6 bg-sakura-400"
                  : i < step
                  ? "bg-sakura-400/50"
                  : "bg-navy-700"
              }`}
            />
          ))}
        </div>

        {/* Current step */}
        <div className="animate-fade-in">
          {steps[step]}
        </div>
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="glass-card p-8 text-center">
      <div className="text-7xl mb-6 animate-float">🎌</div>
      <h1 className="text-3xl font-bold text-slate-100 mb-3">
        Welcome to NIhongood!
      </h1>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">
        Your personal Japanese learning companion. Let&apos;s set up your learning 
        experience in just a few steps.
      </p>
      <button onClick={onNext} className="btn-primary px-8 py-3 text-lg">
        Get Started
      </button>
    </div>
  );
}

function ExperienceLevelStep({
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  selected: ExperienceLevel;
  onSelect: (level: ExperienceLevel) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const levels: { id: ExperienceLevel; title: string; description: string; icon: string }[] = [
    {
      id: "beginner",
      title: "Beginner",
      description: "New to Japanese or SRS flashcards. Simplified interface with helpful guidance.",
      icon: "🌱",
    },
    {
      id: "intermediate",
      title: "Intermediate",
      description: "Familiar with flashcards. Standard features with some customization.",
      icon: "🌿",
    },
    {
      id: "advanced",
      title: "Advanced",
      description: "Experienced with SRS systems like Anki. Full control and all features unlocked.",
      icon: "🌳",
    },
  ];

  return (
    <div className="glass-card p-8">
      <h2 className="text-2xl font-bold text-slate-100 mb-2 text-center">
        Choose Your Experience Level
      </h2>
      <p className="text-slate-400 text-center mb-6">
        This helps us show you the right amount of information.
      </p>

      <div className="space-y-3 mb-8">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selected === level.id
                ? "border-sakura-400 bg-sakura-500/10"
                : "border-white/10 hover:border-white/20 bg-white/5"
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{level.icon}</span>
              <div>
                <p className={`font-bold ${
                  selected === level.id ? "text-sakura-400" : "text-slate-200"
                }`}>
                  {level.title}
                </p>
                <p className="text-sm text-slate-400 mt-1">{level.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1">
          Back
        </button>
        <button onClick={onNext} className="btn-primary flex-1">
          Continue
        </button>
      </div>
    </div>
  );
}

function SRSExplanationStep({
  level,
  onNext,
  onBack,
}: {
  level: ExperienceLevel;
  onNext: () => void;
  onBack: () => void;
}) {
  // Different explanations based on experience level
  const content = {
    beginner: {
      title: "How Learning Works",
      points: [
        {
          icon: "📚",
          title: "Add cards as you learn",
          description: "When you learn new words, they become flashcards automatically.",
        },
        {
          icon: "🔄",
          title: "Review at the right time",
          description: "We'll remind you to review cards just before you'd forget them.",
        },
        {
          icon: "✅",
          title: "Rate how well you remember",
          description: "After seeing the answer, tell us if it was hard or easy.",
        },
      ],
    },
    intermediate: {
      title: "Spaced Repetition System",
      points: [
        {
          icon: "📊",
          title: "Smart scheduling",
          description: "Cards you know well appear less often. Difficult cards appear more.",
        },
        {
          icon: "📈",
          title: "Track your progress",
          description: "See your retention rate, card distribution, and upcoming reviews.",
        },
        {
          icon: "🎯",
          title: "Four rating levels",
          description: "Again, Hard, Good, Easy - each affects how soon you'll see the card.",
        },
      ],
    },
    advanced: {
      title: "SM-2 Algorithm",
      points: [
        {
          icon: "🧠",
          title: "Ease factor adjustment",
          description: "Each card has an ease factor (1.3-2.5+) that multiplies the interval.",
        },
        {
          icon: "⚙️",
          title: "Full customization",
          description: "Adjust new cards/day, review limits, and interface preferences.",
        },
        {
          icon: "📉",
          title: "Interval progression",
          description: "New → 1d → 6d → interval × ease factor. 'Again' resets to 1d.",
        },
      ],
    },
  };

  const { title, points } = content[level];

  return (
    <div className="glass-card p-8">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">
        {title}
      </h2>

      <div className="space-y-4 mb-8">
        {points.map((point, i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center text-2xl flex-shrink-0">
              {point.icon}
            </div>
            <div>
              <p className="font-semibold text-slate-200">{point.title}</p>
              <p className="text-sm text-slate-400 mt-0.5">{point.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1">
          Back
        </button>
        <button onClick={onNext} className="btn-primary flex-1">
          Continue
        </button>
      </div>
    </div>
  );
}

interface FeatureItem {
  name: string;
  available: boolean;
  unlockAt?: number;
}

function FeaturePreviewStep({
  level,
  onComplete,
  onBack,
}: {
  level: ExperienceLevel;
  onComplete: () => void;
  onBack: () => void;
}) {
  const features: Record<ExperienceLevel, FeatureItem[]> = {
    beginner: [
      { name: "Simplified review buttons", available: true },
      { name: "Clear progress tracking", available: true },
      { name: "Helpful tips and guidance", available: true },
      { name: "SRS Insights Panel", available: false, unlockAt: FEATURE_UNLOCKS.srsInsights.reviews },
      { name: "Ease Factor Display", available: false, unlockAt: FEATURE_UNLOCKS.easeFactorDisplay.reviews },
    ],
    intermediate: [
      { name: "Full rating buttons (Again/Hard/Good/Easy)", available: true },
      { name: "Card status bar", available: true },
      { name: "\"Why this card?\" explanations", available: true },
      { name: "SRS Insights Panel", available: true },
      { name: "Advanced settings", available: false, unlockAt: FEATURE_UNLOCKS.advancedSettings.reviews },
    ],
    advanced: [
      { name: "All features unlocked", available: true },
      { name: "Compact interface mode", available: true },
      { name: "Full SRS customization", available: true },
      { name: "Auto-advance after rating", available: true },
      { name: "Algorithm explanations", available: true },
    ],
  };

  const featureList = features[level];

  return (
    <div className="glass-card p-8">
      <h2 className="text-2xl font-bold text-slate-100 mb-2 text-center">
        Your Experience
      </h2>
      <p className="text-slate-400 text-center mb-6">
        {level === "beginner" 
          ? "Start simple. More features unlock as you learn!"
          : level === "intermediate"
          ? "A balanced experience with room to grow."
          : "Full control from the start."}
      </p>

      <div className="space-y-2 mb-8">
        {featureList.map((feature, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              feature.available ? "bg-teal-500/10" : "bg-navy-800/50"
            }`}
          >
            <span className={feature.available ? "text-teal-400" : "text-slate-500"}>
              {feature.available ? "✓" : "🔒"}
            </span>
            <span className={feature.available ? "text-slate-200" : "text-slate-500"}>
              {feature.name}
            </span>
            {!feature.available && feature.unlockAt && (
              <span className="text-xs text-slate-600 ml-auto">
                {feature.unlockAt} reviews
              </span>
            )}
          </div>
        ))}
      </div>

      {level === "beginner" && (
        <div className="glass-card p-4 mb-6 border border-sakura-500/20">
          <p className="text-sm text-slate-300 text-center">
            <span className="text-sakura-400 font-semibold">Tip:</span> You can always 
            change your experience level later in Settings.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1">
          Back
        </button>
        <button onClick={onComplete} className="btn-primary flex-1">
          Start Learning
        </button>
      </div>
    </div>
  );
}

// Feature unlock notification component
export function FeatureUnlockNotification({
  featureName,
  onDismiss,
  onExplore,
}: {
  featureName: string;
  onDismiss: () => void;
  onExplore?: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="glass-card p-4 border border-gold-500/30 max-w-sm">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🎉</span>
          <div className="flex-1">
            <p className="font-bold text-slate-100">New Feature Unlocked!</p>
            <p className="text-sm text-slate-400 mt-1">{featureName}</p>
            <div className="flex gap-2 mt-3">
              {onExplore && (
                <button
                  onClick={onExplore}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-colors"
                >
                  Explore
                </button>
              )}
              <button
                onClick={onDismiss}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contextual help tooltip component
export function HelpTooltip({
  content,
  position = "top",
  children,
}: {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div
          className={`absolute ${positionClasses[position]} z-50 px-3 py-2 text-xs text-slate-200 bg-navy-800 border border-white/10 rounded-lg shadow-xl max-w-xs animate-fade-in`}
        >
          {content}
        </div>
      )}
    </div>
  );
}

// Progress indicator for feature unlocks
export function UnlockProgress({ className = "" }: { className?: string }) {
  const { onboarding, getNextUnlock } = useUserPreferencesStore();
  const nextUnlock = getNextUnlock();

  if (!nextUnlock) return null;

  const progress = (onboarding.totalReviewsCompleted / 
    (onboarding.totalReviewsCompleted + nextUnlock.reviewsNeeded)) * 100;

  return (
    <div className={`glass-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400">Next unlock</span>
        <span className="text-xs text-gold-400">{nextUnlock.feature}</span>
      </div>
      <div className="progress-bar h-2">
        <div 
          className="progress-bar-fill bg-gradient-to-r from-gold-500 to-gold-400"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-1 text-right">
        {nextUnlock.reviewsNeeded} reviews to unlock
      </p>
    </div>
  );
}
