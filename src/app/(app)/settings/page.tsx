"use client";

import { useState, useEffect } from "react";
import { 
  useUserPreferencesStore, 
  ExperienceLevel,
  AutomationLevel,
  FEATURE_UNLOCKS 
} from "@/store/userPreferencesStore";
import { HelpTooltip, UnlockProgress } from "@/components/OnboardingFlow";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"experience" | "srs" | "interface">("experience");
  const prefs = useUserPreferencesStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse glass-card h-96" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <span>⚙️</span> Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your learning experience
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        {(["experience", "srs", "interface"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-sakura-500/20 text-sakura-400"
                : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            {tab === "experience" ? "Experience Level" : 
             tab === "srs" ? "SRS Settings" : "Interface"}
          </button>
        ))}
      </div>

      {/* Experience Level Tab */}
      {activeTab === "experience" && (
        <ExperienceLevelSettings />
      )}

      {/* SRS Settings Tab */}
      {activeTab === "srs" && (
        <SRSSettingsPanel />
      )}

      {/* Interface Tab */}
      {activeTab === "interface" && (
        <InterfaceSettings />
      )}

      {/* Feature Unlock Progress */}
      {prefs.experienceLevel !== "advanced" && (
        <UnlockProgress className="mt-8" />
      )}
    </div>
  );
}

function ExperienceLevelSettings() {
  const { experienceLevel, setExperienceLevel, onboarding } = useUserPreferencesStore();
  const [showConfirm, setShowConfirm] = useState<ExperienceLevel | null>(null);

  const levels: { id: ExperienceLevel; title: string; description: string; icon: string; features: string[] }[] = [
    {
      id: "beginner",
      title: "Beginner",
      description: "Simplified interface with helpful guidance",
      icon: "🌱",
      features: [
        "3-button rating (Again/Hard/Good)",
        "No ease factor display",
        "Guided tips and explanations",
        "Features unlock as you learn",
      ],
    },
    {
      id: "intermediate",
      title: "Intermediate",
      description: "Standard features with customization options",
      icon: "🌿",
      features: [
        "4-button rating (Again/Hard/Good/Easy)",
        "Card status bar",
        "\"Why this card?\" explanations",
        "SRS Insights panel",
      ],
    },
    {
      id: "advanced",
      title: "Advanced",
      description: "Full control and all features unlocked",
      icon: "🌳",
      features: [
        "All features immediately available",
        "Ease factor and interval display",
        "Advanced SRS customization",
        "Compact mode option",
      ],
    },
  ];

  const handleLevelChange = (level: ExperienceLevel) => {
    if (level !== experienceLevel) {
      setShowConfirm(level);
    }
  };

  const confirmChange = () => {
    if (showConfirm) {
      setExperienceLevel(showConfirm);
      setShowConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Experience Level</h2>
        <p className="text-sm text-slate-400 mb-6">
          Choose how much detail and control you want. This affects which features are visible 
          and how information is presented.
        </p>

        <div className="space-y-3">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelChange(level.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                experienceLevel === level.id
                  ? "border-sakura-400 bg-sakura-500/10"
                  : "border-white/10 hover:border-white/20 bg-white/5"
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{level.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold ${
                      experienceLevel === level.id ? "text-sakura-400" : "text-slate-200"
                    }`}>
                      {level.title}
                    </p>
                    {experienceLevel === level.id && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sakura-500/20 text-sakura-400">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{level.description}</p>
                  <ul className="mt-3 space-y-1">
                    {level.features.map((feature, i) => (
                      <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="text-teal-400">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Unlock Progress */}
      {experienceLevel === "beginner" && (
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Your Progress
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Reviews Completed</span>
              <span className="text-sm font-bold text-gold-400">{onboarding.totalReviewsCompleted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Days Active</span>
              <span className="text-sm font-bold text-teal-400">{onboarding.daysActive}</span>
            </div>
            <div className="border-t border-white/5 pt-4">
              <p className="text-xs text-slate-500 mb-3">Feature Unlocks:</p>
              {Object.entries(FEATURE_UNLOCKS).map(([id, config]) => {
                const unlocked = onboarding.totalReviewsCompleted >= config.reviews;
                return (
                  <div key={id} className="flex items-center justify-between py-1">
                    <span className={`text-sm ${unlocked ? "text-slate-300" : "text-slate-500"}`}>
                      {unlocked ? "✓" : "🔒"} {config.description}
                    </span>
                    <span className={`text-xs ${unlocked ? "text-teal-400" : "text-slate-600"}`}>
                      {config.reviews} reviews
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(null)} />
          <div className="glass-card p-6 max-w-md w-full relative z-10 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Change Experience Level?</h3>
            <p className="text-sm text-slate-400 mb-4">
              Switching to <span className="text-sakura-400 font-medium">{showConfirm}</span> will 
              update your interface settings to match that experience level.
            </p>
            {showConfirm === "beginner" && experienceLevel !== "beginner" && (
              <p className="text-xs text-gold-400 mb-4">
                Note: Some features you&apos;ve unlocked will be hidden until you unlock them again 
                through reviews, or you can switch back to a higher level anytime.
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={confirmChange} className="btn-primary flex-1">
                Change Level
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SRSSettingsPanel() {
  const { srsSettings, updateSRSSettings, experienceLevel, isFeatureUnlocked } = useUserPreferencesStore();
  const canAccessAdvanced = experienceLevel === "advanced" || isFeatureUnlocked("advancedSettings");

  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Review Settings</h2>
        
        <div className="space-y-6">
          {/* New Cards Per Day */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-300 flex items-center gap-2">
                New Cards Per Day
                <HelpTooltip content="How many new cards to introduce each day. Lower numbers help prevent overwhelm.">
                  <span className="text-slate-500 cursor-help">ℹ️</span>
                </HelpTooltip>
              </label>
              <span className="text-sm font-bold text-sakura-400">{srsSettings.newCardsPerDay}</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={srsSettings.newCardsPerDay}
              onChange={(e) => updateSRSSettings({ newCardsPerDay: Number(e.target.value) })}
              className="w-full accent-sakura-400"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1</span>
              <span>Conservative: 5-10</span>
              <span>50</span>
            </div>
          </div>

          {/* Max Reviews Per Day */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-300 flex items-center gap-2">
                Max Reviews Per Day
                <HelpTooltip content="Limit daily reviews to prevent burnout. 0 means unlimited.">
                  <span className="text-slate-500 cursor-help">ℹ️</span>
                </HelpTooltip>
              </label>
              <span className="text-sm font-bold text-teal-400">
                {srsSettings.maxReviewsPerDay === 0 ? "Unlimited" : srsSettings.maxReviewsPerDay}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={srsSettings.maxReviewsPerDay}
              onChange={(e) => updateSRSSettings({ maxReviewsPerDay: Number(e.target.value) })}
              className="w-full accent-teal-400"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Unlimited</span>
              <span>Recommended: 50-100</span>
              <span>200</span>
            </div>
          </div>

          {/* Easy Button Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-white/5">
            <div>
              <p className="text-sm text-slate-300">Enable &quot;Easy&quot; Button</p>
              <p className="text-xs text-slate-500 mt-0.5">Show 4 rating buttons instead of 3</p>
            </div>
            <ToggleSwitch
              enabled={srsSettings.enableEasyButton}
              onChange={(enabled) => updateSRSSettings({ enableEasyButton: enabled })}
            />
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className={`glass-card p-6 ${!canAccessAdvanced ? "opacity-50" : ""}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100">Advanced Settings</h2>
          {!canAccessAdvanced && (
            <span className="text-xs px-2 py-1 rounded-full bg-navy-800 text-slate-500">
              🔒 {FEATURE_UNLOCKS.advancedSettings.reviews} reviews to unlock
            </span>
          )}
        </div>

        <div className="space-y-4">
          {/* Show Interval Predictions */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-slate-300">Show Interval Predictions</p>
              <p className="text-xs text-slate-500 mt-0.5">Display next review date on rating buttons</p>
            </div>
            <ToggleSwitch
              enabled={srsSettings.showIntervalPredictions}
              onChange={(enabled) => updateSRSSettings({ showIntervalPredictions: enabled })}
              disabled={!canAccessAdvanced}
            />
          </div>

          {/* Show Ease Factor */}
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <p className="text-sm text-slate-300">Show Ease Factor</p>
              <p className="text-xs text-slate-500 mt-0.5">Display card difficulty percentage</p>
            </div>
            <ToggleSwitch
              enabled={srsSettings.showEaseFactor}
              onChange={(enabled) => updateSRSSettings({ showEaseFactor: enabled })}
              disabled={!canAccessAdvanced}
            />
          </div>

          {/* Auto Advance */}
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <p className="text-sm text-slate-300">Auto-Advance After Rating</p>
              <p className="text-xs text-slate-500 mt-0.5">Automatically move to next card</p>
            </div>
            <ToggleSwitch
              enabled={srsSettings.autoAdvance}
              onChange={(enabled) => updateSRSSettings({ autoAdvance: enabled })}
              disabled={!canAccessAdvanced}
            />
          </div>

          {/* Auto Advance Delay */}
          {srsSettings.autoAdvance && canAccessAdvanced && (
            <div className="pl-4 border-l-2 border-sakura-500/30">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-400">Delay (ms)</label>
                <span className="text-sm font-bold text-sakura-400">{srsSettings.autoAdvanceDelay}ms</span>
              </div>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={srsSettings.autoAdvanceDelay}
                onChange={(e) => updateSRSSettings({ autoAdvanceDelay: Number(e.target.value) })}
                className="w-full accent-sakura-400"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InterfaceSettings() {
  const { uiPreferences, updateUIPreferences, experienceLevel } = useUserPreferencesStore();

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Interface Preferences</h2>
        
        <div className="space-y-4">
          {/* Show Detailed Stats */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-slate-300">Show Detailed Statistics</p>
              <p className="text-xs text-slate-500 mt-0.5">Display comprehensive learning metrics</p>
            </div>
            <ToggleSwitch
              enabled={uiPreferences.showDetailedStats}
              onChange={(enabled) => updateUIPreferences({ showDetailedStats: enabled })}
            />
          </div>

          {/* Show Card Status Bar */}
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <p className="text-sm text-slate-300">Card Status Bar</p>
              <p className="text-xs text-slate-500 mt-0.5">Show card status during reviews</p>
            </div>
            <ToggleSwitch
              enabled={uiPreferences.showCardStatusBar}
              onChange={(enabled) => updateUIPreferences({ showCardStatusBar: enabled })}
            />
          </div>

          {/* Show Why This Card */}
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <p className="text-sm text-slate-300">&quot;Why This Card?&quot; Button</p>
              <p className="text-xs text-slate-500 mt-0.5">Explain why each card appears</p>
            </div>
            <ToggleSwitch
              enabled={uiPreferences.showWhyThisCard}
              onChange={(enabled) => updateUIPreferences({ showWhyThisCard: enabled })}
            />
          </div>

          {/* Show Algorithm Explanations */}
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <p className="text-sm text-slate-300">Algorithm Explanations</p>
              <p className="text-xs text-slate-500 mt-0.5">Show how SRS decisions are made</p>
            </div>
            <ToggleSwitch
              enabled={uiPreferences.showAlgorithmExplanations}
              onChange={(enabled) => updateUIPreferences({ showAlgorithmExplanations: enabled })}
            />
          </div>

          {/* Compact Mode */}
          {experienceLevel === "advanced" && (
            <div className="flex items-center justify-between py-2 border-t border-white/5">
              <div>
                <p className="text-sm text-slate-300">Compact Mode</p>
                <p className="text-xs text-slate-500 mt-0.5">Reduce spacing for experienced users</p>
              </div>
              <ToggleSwitch
                enabled={uiPreferences.compactMode}
                onChange={(enabled) => updateUIPreferences({ compactMode: enabled })}
              />
            </div>
          )}

          {/* Animation Level */}
          <div className="pt-4 border-t border-white/5">
            <label className="text-sm text-slate-300 block mb-3">Animation Level</label>
            <div className="grid grid-cols-3 gap-2">
              {(["full", "reduced", "none"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => updateUIPreferences({ animationLevel: level })}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    uiPreferences.animationLevel === level
                      ? "bg-sakura-500/20 text-sakura-400 border border-sakura-500/30"
                      : "bg-white/5 text-slate-400 border border-transparent hover:bg-white/10"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reset to Defaults */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Reset Options
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Reset interface settings to the defaults for your experience level.
        </p>
        <button
          onClick={() => {
            const store = useUserPreferencesStore.getState();
            if (store.experienceLevel === "beginner") store.applyBeginnerPreset();
            else if (store.experienceLevel === "intermediate") store.applyIntermediatePreset();
            else store.applyAdvancedPreset();
          }}
          className="btn-secondary text-sm"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

function ToggleSwitch({ 
  enabled, 
  onChange, 
  disabled = false 
}: { 
  enabled: boolean; 
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-all ${
        disabled 
          ? "bg-navy-800 cursor-not-allowed" 
          : enabled 
          ? "bg-sakura-500" 
          : "bg-navy-700 hover:bg-navy-600"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
          enabled ? "left-7" : "left-1"
        }`}
      />
    </button>
  );
}
