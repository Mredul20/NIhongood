"use client";

import { useState, useEffect, useCallback } from "react";
import { useSRSStore, SRSCard } from "@/store/srsStore";
import { useProgressStore } from "@/store/progressStore";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";
import { CardInfoModal, SRSInsightsPanel } from "@/components/SRSInsights";
import { HelpTooltip, UnlockProgress, FeatureUnlockNotification } from "@/components/OnboardingFlow";
import Link from "next/link";
import { getJapaneseTTSText, speak } from "@/lib/speak";

type Rating = "again" | "hard" | "good" | "easy";
type ReviewMode = "normal" | "reverse" | "listening";

export default function ReviewPage() {
  const srs = useSRSStore();
  const progress = useProgressStore();
  const { 
    srsSettings, 
    uiPreferences, 
    experienceLevel,
    onboarding,
    recordReviewForUnlocks,
    recordSessionForUnlocks,
    isFeatureUnlocked,
    getNextUnlock,
  } = useUserPreferencesStore();
  
  const [mounted, setMounted] = useState(false);
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [sessionDone, setSessionDone] = useState(false);
  const [startTime] = useState(Date.now());
  const [showCardInfo, setShowCardInfo] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [newUnlock, setNewUnlock] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState<ReviewMode>("normal");
  const [listeningAnswer, setListeningAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState<"correct" | "wrong" | null>(null);

  // Check if features should be shown based on experience level and unlocks
  const showCardStatusBar = uiPreferences.showCardStatusBar && 
    (experienceLevel !== "beginner" || isFeatureUnlocked("easeFactorDisplay"));
  const showWhyThisCard = uiPreferences.showWhyThisCard && 
    (experienceLevel !== "beginner" || isFeatureUnlocked("srsInsights"));
  const showInsightsButton = experienceLevel !== "beginner" || isFeatureUnlocked("srsInsights");
  const showEasyButton = srsSettings.enableEasyButton;
  const showIntervalPredictions = srsSettings.showIntervalPredictions && experienceLevel !== "beginner";

  useEffect(() => {
    setMounted(true);
    recordSessionForUnlocks();
    const cards = srs.getDueCards();
    
    // Apply max reviews limit if set
    const maxReviews = srsSettings.maxReviewsPerDay;
    const limitedCards = maxReviews > 0 ? cards.slice(0, maxReviews) : cards;
    
    setDueCards(limitedCards);
    if (limitedCards.length === 0) setSessionDone(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally run once on mount — due cards are snapshot at session start

  const handleRate = useCallback((rating: Rating) => {
    if (currentIndex >= dueCards.length) return;

    const card = dueCards[currentIndex];
    srs.reviewCard(card.id, rating);
    progress.recordReview();
    progress.addXP(rating === "again" ? 2 : rating === "hard" ? 5 : rating === "good" ? 8 : 12);
    
    // Track for feature unlocks
    const previousReviews = onboarding.totalReviewsCompleted;
    recordReviewForUnlocks();
    
    // Check if a feature was just unlocked
    const nextUnlock = getNextUnlock();
    if (nextUnlock && previousReviews < 10 && previousReviews + 1 >= 10) {
      setNewUnlock("SRS Insights Panel");
    } else if (nextUnlock && previousReviews < 25 && previousReviews + 1 >= 25) {
      setNewUnlock("Ease Factor Display");
    } else if (nextUnlock && previousReviews < 50 && previousReviews + 1 >= 50) {
      setNewUnlock("Advanced SRS Settings");
    }

    setAnswerFeedback(rating !== "again" ? "correct" : "wrong");
    setTimeout(() => setAnswerFeedback(null), 600);

    setSessionStats((prev) => ({
      correct: prev.correct + (rating !== "again" ? 1 : 0),
      total: prev.total + 1,
    }));

    setFlipped(false);

    if (currentIndex + 1 >= dueCards.length) {
      const elapsedMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      progress.recordStudySession(elapsedMinutes);
      setTimeout(() => setSessionDone(true), 300);
    } else {
      const delay = srsSettings.autoAdvance ? srsSettings.autoAdvanceDelay : 300;
      setTimeout(() => setCurrentIndex((i) => i + 1), delay);
    }
  }, [currentIndex, dueCards, srs, progress, startTime, srsSettings, onboarding.totalReviewsCompleted, recordReviewForUnlocks, getNextUnlock]);

  if (!mounted) return <div className="animate-pulse glass-card h-96" />;

  // No cards state
  if (dueCards.length === 0 && !sessionDone) {
    const insights = srs.getInsights();
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="text-8xl mb-6 animate-float">🎌</div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">No Cards Due!</h1>
        <p className="text-slate-400 max-w-md mb-8">
          All caught up! Learn new words in the vocabulary section or wait for your cards to become due.
        </p>
        <div className="flex gap-3">
          <Link href="/learn/vocab" className="btn-primary">📖 Learn Vocabulary</Link>
          <Link href="/learn/kana" className="btn-secondary">あ Learn Kana</Link>
        </div>

        {/* Card stats with insights button */}
        {srs.cards.length > 0 && (
          <div className="mt-8 glass-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Your Deck</h3>
              {showInsightsButton && (
                <button 
                  onClick={() => setShowInsights(true)}
                  className="text-xs text-sakura-400 hover:text-sakura-300 flex items-center gap-1"
                >
                  <span>📊</span> View Insights
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-slate-100">{srs.getCardCount().total}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-400">{srs.getCardCount().learned}</p>
                <p className="text-xs text-slate-500">Reviewed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-sakura-400">{srs.getCardCount().new}</p>
                <p className="text-xs text-slate-500">New</p>
              </div>
            </div>
            
            {/* Upcoming reviews preview */}
            {insights.upcomingReviews.some(d => d.count > 0) && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-slate-500 mb-2">Upcoming reviews:</p>
                <div className="flex gap-1">
                  {insights.upcomingReviews.slice(0, 5).map((day, i) => (
                    <div key={day.date} className="flex-1 text-center">
                      <div className={`text-xs font-bold ${i === 0 ? "text-sakura-400" : "text-slate-400"}`}>
                        {day.count}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        {i === 0 ? "Today" : new Date(day.date).toLocaleDateString("en", { weekday: "short" }).charAt(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Beginner unlock progress */}
            {experienceLevel === "beginner" && !isFeatureUnlocked("srsInsights") && (
              <UnlockProgress className="mt-4" />
            )}
          </div>
        )}
        
        {/* Insights Modal */}
        {showInsights && (
          <SRSInsightsPanel 
            insights={srs.getInsights()} 
            onClose={() => setShowInsights(false)} 
          />
        )}
      </div>
    );
  }

  // Session complete
  if (sessionDone) {
    const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-scale-in">
        <div className="text-8xl mb-6">{accuracy >= 80 ? "🎉" : accuracy >= 50 ? "👍" : "💪"}</div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Session Complete!</h1>
        <div className="glass-card p-8 w-full max-w-md mt-4">
          <div className="grid grid-cols-3 gap-6 text-center mb-6">
            <div>
              <p className="text-3xl font-bold text-gradient-sakura">{sessionStats.total}</p>
              <p className="text-xs text-slate-500 mt-1">Reviewed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gradient-teal">{sessionStats.correct}</p>
              <p className="text-xs text-slate-500 mt-1">Correct</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gradient-gold">{accuracy}%</p>
              <p className="text-xs text-slate-500 mt-1">Accuracy</p>
            </div>
          </div>
          
          {/* Beginner encouragement */}
          {experienceLevel === "beginner" && (
            <div className="mb-6 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20">
              <p className="text-sm text-teal-400">
                {accuracy >= 80 
                  ? "Excellent! You're mastering these cards!" 
                  : accuracy >= 50 
                  ? "Good progress! Keep practicing the difficult ones."
                  : "Don't worry! Difficult cards will appear more often to help you learn."}
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Link href="/dashboard" className="btn-secondary flex-1 text-center text-sm">Dashboard</Link>
            <Link href="/learn/vocab" className="btn-primary flex-1 text-center text-sm">Learn More</Link>
          </div>
        </div>
        
        {/* Feature unlock notification */}
        {newUnlock && (
          <FeatureUnlockNotification
            featureName={newUnlock}
            onDismiss={() => setNewUnlock(null)}
            onExplore={() => {
              setNewUnlock(null);
              if (newUnlock === "SRS Insights Panel") {
                setShowInsights(true);
              }
            }}
          />
        )}
      </div>
    );
  }

  const currentCard = dueCards[currentIndex];
  const cardExplanation = srs.getCardExplanation(currentCard);
  const reviewAudio = getJapaneseTTSText(currentCard.front, currentCard.reading);

  // Determine what to show as front/back based on mode
  const displayFront = reviewMode === "reverse" ? currentCard.back : currentCard.front;
  const displayBack  = reviewMode === "reverse" ? currentCard.front : currentCard.back;

  return (
    <div className={`space-y-6 animate-fade-in ${uiPreferences.compactMode ? "space-y-4" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
            <span>🔄</span> Review Session
            {experienceLevel === "beginner" && (
              <HelpTooltip content="Review your flashcards to strengthen your memory. Cards you find difficult will appear more often.">
                <span className="cursor-help text-base" style={{ color: "var(--text-secondary)" }}>ℹ️</span>
              </HelpTooltip>
            )}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Card {currentIndex + 1} of {dueCards.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Mode selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "var(--bg-secondary)", border: "2px solid var(--border-color)" }}>
            {([
              { mode: "normal" as ReviewMode,    icon: "🃏", label: "Normal"   },
              { mode: "reverse" as ReviewMode,   icon: "🔃", label: "Reverse"  },
              { mode: "listening" as ReviewMode, icon: "🔊", label: "Listen"   },
            ] as const).map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => { setReviewMode(mode); setFlipped(false); setListeningAnswer(""); }}
                title={label}
                className="px-2 py-1 rounded-lg text-xs font-bold transition-all"
                style={reviewMode === mode
                  ? { background: "rgba(255,75,139,0.15)", color: "#ff4b8b" }
                  : { color: "var(--text-secondary)" }
                }
              >{icon} {label}</button>
            ))}
          </div>
          {showInsightsButton && (
            <button onClick={() => setShowInsights(true)} className="text-xs hover:text-sakura-400 transition-colors" title="View SRS Insights" style={{ color: "var(--text-secondary)" }}>📊</button>
          )}
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="text-teal-400">✓ {sessionStats.correct}</span>
            <span className="text-red-400">✗ {sessionStats.total - sessionStats.correct}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar">
        <div
          className="progress-bar-fill bg-gradient-to-r from-sakura-400 to-teal-400"
          style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
        />
      </div>

      {/* Card Status Info Bar - Progressive Disclosure */}
      {showCardStatusBar && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded-full ${
              cardExplanation.currentStatus === "New" ? "bg-blue-500/20 text-blue-400" :
              cardExplanation.currentStatus === "Mature" ? "bg-teal-500/20 text-teal-400" :
              "bg-gold-500/20 text-gold-400"
            }`}>
              {cardExplanation.currentStatus}
            </span>
            {srsSettings.showEaseFactor && (
              <span className="text-slate-500">
                Ease: {(currentCard.easeFactor * 100).toFixed(0)}%
              </span>
            )}
            {currentCard.interval > 0 && experienceLevel !== "beginner" && (
              <span className="text-slate-500">
                Interval: {currentCard.interval}d
              </span>
            )}
          </div>
          {showWhyThisCard && (
            <button
              onClick={() => setShowCardInfo(true)}
              className="text-slate-400 hover:text-sakura-400 flex items-center gap-1 transition-colors"
            >
              <span>ℹ️</span> Why this card?
            </button>
          )}
        </div>
      )}

      {/* Listening Mode */}
      {reviewMode === "listening" ? (
        <div className="duo-card p-8 text-center space-y-6">
          <span className={`badge ${currentCard.type === "kana" ? "badge-sakura" : currentCard.type === "vocab" ? "badge-teal" : "badge-gold"}`}>
            {currentCard.type} · Listening
          </span>
          <div>
            <button
              onClick={() => speak(reviewAudio)}
              className="text-7xl hover:scale-110 transition-transform active:scale-95"
              title="Play audio"
            >🔊</button>
            <p className="text-sm font-semibold mt-3" style={{ color: "var(--text-secondary)" }}>
              Tap to hear · Type what you think it means
            </p>
          </div>
          <div className="relative max-w-xs mx-auto">
            <input
              type="text"
              value={listeningAnswer}
              onChange={(e) => setListeningAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setFlipped(true); }}
              placeholder="Type the meaning..."
              className="w-full px-4 py-3 rounded-xl border-2 text-center font-bold outline-none transition-all"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              autoFocus
            />
          </div>
          {!flipped ? (
            <button onClick={() => setFlipped(true)} className="btn-primary px-8">Check Answer</button>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <p className="text-3xl font-japanese font-black" style={{ color: "var(--text-primary)" }}>{currentCard.front}</p>
              <p className="text-xl font-bold text-teal-400">{currentCard.back}</p>
              {listeningAnswer.trim() && (
                <p className="text-sm font-semibold" style={{ color: listeningAnswer.toLowerCase().trim() === currentCard.back.toLowerCase().trim() ? "#58cc02" : "#ff4b4b" }}>
                  Your answer: {listeningAnswer}
                  {listeningAnswer.toLowerCase().trim() === currentCard.back.toLowerCase().trim() ? " ✓" : " ✗"}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
      /* Normal / Reverse Flashcard */
      <div className="flashcard" style={{ minHeight: uiPreferences.compactMode ? "280px" : "320px" }}>
        <div
          className={`flashcard-inner cursor-pointer ${flipped ? "flipped" : ""}`}
          onClick={() => !flipped && setFlipped(true)}
          style={{ minHeight: uiPreferences.compactMode ? "280px" : "320px" }}
        >
          {/* Front */}
          <div className="flashcard-face" style={{ position: flipped ? "absolute" : "relative" }}>
            <span className={`badge mb-4 ${currentCard.type === "kana" ? "badge-sakura" : currentCard.type === "vocab" ? "badge-teal" : "badge-gold"}`}>
              {currentCard.type}{reviewMode === "reverse" ? " · Reverse" : ""}
            </span>
            <p className={`font-japanese font-bold mb-4 ${reviewMode === "reverse" ? "text-3xl" : "text-6xl"}`} style={{ color: "var(--text-primary)" }}>{displayFront}</p>
            {reviewMode === "normal" && currentCard.reading && (
              <p className="text-lg text-sakura-400/60 font-japanese">{currentCard.reading}</p>
            )}
            <p className="text-sm mt-6" style={{ color: "var(--text-secondary)" }}>Tap to reveal answer</p>
          </div>

          {/* Back */}
          <div className="flashcard-face flashcard-back" style={{ position: !flipped ? "absolute" : "relative" }}>
            <span className={`badge mb-4 ${currentCard.type === "kana" ? "badge-sakura" : currentCard.type === "vocab" ? "badge-teal" : "badge-gold"}`}>
              {currentCard.type}{reviewMode === "reverse" ? " · Reverse" : ""}
            </span>
            <p className="text-3xl font-japanese font-bold mb-2" style={{ color: "var(--text-secondary)" }}>{displayFront}</p>
            {reviewMode === "normal" && currentCard.reading && (
              <p className="text-lg text-sakura-400/60 font-japanese mb-2">{currentCard.reading}</p>
            )}
            <div className="w-16 h-0.5 my-4" style={{ background: "var(--border-color)" }} />
            <p className={`font-bold text-teal-400 ${reviewMode === "reverse" ? "text-4xl font-japanese" : "text-2xl"}`}>{displayBack}</p>
          </div>
        </div>
      </div>
      )}

      {/* Rating Buttons - Progressive Disclosure */}
      {flipped && (
        <div className={`grid ${showEasyButton ? "grid-cols-4" : "grid-cols-3"} gap-3 max-w-lg mx-auto animate-slide-up`}>
          <RatingButton 
            rating="again" 
            label="Again" 
            sub={showIntervalPredictions ? "1d" : ""}
            color="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30" 
            onClick={() => handleRate("again")} 
            tooltip={experienceLevel === "beginner" ? "I don't remember this" : undefined}
          />
          <RatingButton 
            rating="hard" 
            label="Hard" 
            sub={showIntervalPredictions ? `${Math.max(1, Math.round(currentCard.interval * 1.2))}d` : ""}
            color="bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30" 
            onClick={() => handleRate("hard")} 
            tooltip={experienceLevel === "beginner" ? "I struggled but got it" : undefined}
          />
          <RatingButton 
            rating="good" 
            label="Good" 
            sub={showIntervalPredictions ? `${currentCard.repetitions === 0 ? 1 : currentCard.repetitions === 1 ? 6 : Math.round(currentCard.interval * currentCard.easeFactor)}d` : ""}
            color="bg-teal-500/20 border-teal-500/30 text-teal-400 hover:bg-teal-500/30" 
            onClick={() => handleRate("good")} 
            tooltip={experienceLevel === "beginner" ? "I remembered correctly" : undefined}
          />
          {showEasyButton && (
            <RatingButton 
              rating="easy" 
              label="Easy" 
              sub={showIntervalPredictions ? `${currentCard.repetitions === 0 ? 4 : Math.round(currentCard.interval * currentCard.easeFactor * 1.3)}d` : ""}
              color="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30" 
              onClick={() => handleRate("easy")} 
              tooltip={experienceLevel === "beginner" ? "Too easy! Show less often" : undefined}
            />
          )}
        </div>
      )}

      {/* Beginner tip */}
      {experienceLevel === "beginner" && flipped && (
        <p className="text-center text-xs text-slate-500 mt-2">
          Rate how well you remembered. &quot;Again&quot; cards will appear sooner.
        </p>
      )}

      {/* Card Info Modal */}
      {showCardInfo && (
        <CardInfoModal
          card={currentCard}
          explanation={cardExplanation}
          onClose={() => setShowCardInfo(false)}
        />
      )}

      {/* SRS Insights Modal */}
      {showInsights && (
        <SRSInsightsPanel
          insights={srs.getInsights()}
          onClose={() => setShowInsights(false)}
        />
      )}
      
      {/* Feature unlock notification */}
      {newUnlock && (
        <FeatureUnlockNotification
          featureName={newUnlock}
          onDismiss={() => setNewUnlock(null)}
          onExplore={() => {
            setNewUnlock(null);
            if (newUnlock === "SRS Insights Panel") {
              setShowInsights(true);
            }
          }}
        />
      )}

      {/* Answer feedback flash */}
      {answerFeedback && (
        <div className={`fixed inset-0 pointer-events-none z-50 ${answerFeedback === "correct" ? "animate-flash-correct" : "animate-flash-wrong"}`} />
      )}
    </div>
  );
}

function RatingButton({ label, sub, color, onClick, tooltip }: {
  rating: Rating; 
  label: string; 
  sub: string; 
  color: string; 
  onClick: () => void;
  tooltip?: string;
}) {
  const button = (
    <button
      onClick={onClick}
      className={`py-4 px-2 rounded-xl border-2 text-center transition-all active:scale-95 hover:translate-y-[-2px] ${color}`}
      style={{ minHeight: "64px", boxShadow: "0 4px 0 rgba(0,0,0,0.15)" }}
    >
      <p className="font-black text-sm">{label}</p>
      {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
    </button>
  );

  if (tooltip) {
    return (
      <HelpTooltip content={tooltip} position="top">
        {button}
      </HelpTooltip>
    );
  }

  return button;
}
