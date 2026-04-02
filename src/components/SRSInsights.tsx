"use client";

import { useState } from "react";
import { SRSCard, CardExplanation, SRSInsights } from "@/store/srsStore";

interface CardInfoProps {
  card: SRSCard;
  explanation: CardExplanation;
  onClose: () => void;
}

export function CardInfoModal({ card, explanation, onClose }: CardInfoProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card p-6 max-w-lg w-full relative z-10 animate-scale-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          ✕
        </button>

        {/* Card Header */}
        <div className="text-center mb-6">
          <span className={`badge mb-3 ${
            card.type === "kana" ? "badge-sakura" : card.type === "vocab" ? "badge-teal" : "badge-gold"
          }`}>
            {card.type}
          </span>
          <p className="text-4xl font-japanese font-bold">{card.front}</p>
          {card.reading && (
            <p className="text-sm text-sakura-400/70 font-japanese mt-1">{card.reading}</p>
          )}
          <p className="text-lg text-teal-400 mt-2">{card.back}</p>
        </div>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              explanation.currentStatus === "New" ? "bg-blue-500/20 text-blue-400" :
              explanation.currentStatus === "Mature" ? "bg-teal-500/20 text-teal-400" :
              "bg-gold-500/20 text-gold-400"
            }`}>
              {explanation.currentStatus}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-navy-800 text-slate-400">
              Ease: {(card.easeFactor * 100).toFixed(0)}%
            </span>
          </div>

          {/* Why Due */}
          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>📅</span> Why This Card?
            </h4>
            <p className="text-sm text-slate-300">{explanation.whyDue}</p>
          </div>

          {/* Learning Progress */}
          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>📊</span> Learning Progress
            </h4>
            <p className="text-sm text-slate-300 mb-2">{explanation.intervalHistory}</p>
            <p className="text-sm text-slate-400">{explanation.easeDescription}</p>
          </div>

          {/* Next Steps Preview */}
          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>🎯</span> What Each Rating Does
            </h4>
            <div className="space-y-2">
              {explanation.nextSteps.map((step) => (
                <div key={step.rating} className="flex items-start gap-3 text-sm">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    step.rating === "again" ? "bg-red-500/20 text-red-400" :
                    step.rating === "hard" ? "bg-orange-500/20 text-orange-400" :
                    step.rating === "good" ? "bg-teal-500/20 text-teal-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>
                    {step.rating}
                  </span>
                  <div className="flex-1">
                    <span className="text-slate-300">→ {step.interval}d</span>
                    <p className="text-xs text-slate-500 mt-0.5">{step.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Algorithm Explanation */}
          <details className="glass-card p-4 cursor-pointer group">
            <summary className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 list-none">
              <span>🧠</span> How SRS Works
              <span className="ml-auto text-slate-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-3 text-xs text-slate-400 space-y-2">
              <p>
                <strong className="text-slate-300">Spaced Repetition</strong> schedules reviews at optimal intervals 
                to maximize long-term memory retention while minimizing study time.
              </p>
              <p>
                <strong className="text-slate-300">Ease Factor</strong> adjusts how quickly intervals grow. 
                Cards you find easy will appear less frequently.
              </p>
              <p>
                <strong className="text-slate-300">Interval</strong> is the number of days until the next review. 
                It multiplies by your ease factor each time you answer &quot;Good&quot;.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

interface InsightsPanelProps {
  insights: SRSInsights;
  onClose: () => void;
}

export function SRSInsightsPanel({ insights, onClose }: InsightsPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "forecast" | "struggling">("overview");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card p-6 max-w-2xl w-full relative z-10 animate-scale-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-3">
          <span>📊</span> SRS Insights
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["overview", "forecast", "struggling"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-sakura-500/20 text-sakura-400"
                  : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {tab === "overview" ? "Overview" : tab === "forecast" ? "Forecast" : "Needs Work"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Card Distribution */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Card Distribution
              </h4>
              <div className="grid grid-cols-4 gap-3">
                <StatBox label="Total" value={insights.totalCards} color="text-slate-100" />
                <StatBox label="New" value={insights.newCards} color="text-blue-400" />
                <StatBox label="Learning" value={insights.youngCards} color="text-gold-400" />
                <StatBox label="Mature" value={insights.matureCards} color="text-teal-400" />
              </div>
            </div>

            {/* Visual Distribution Bar */}
            {insights.totalCards > 0 && (
              <div>
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${(insights.newCards / insights.totalCards) * 100}%` }}
                    title={`New: ${insights.newCards}`}
                  />
                  <div 
                    className="bg-gold-500" 
                    style={{ width: `${(insights.youngCards / insights.totalCards) * 100}%` }}
                    title={`Learning: ${insights.youngCards}`}
                  />
                  <div 
                    className="bg-teal-500" 
                    style={{ width: `${(insights.matureCards / insights.totalCards) * 100}%` }}
                    title={`Mature: ${insights.matureCards}`}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>New</span>
                  <span>Learning</span>
                  <span>Mature</span>
                </div>
              </div>
            )}

            {/* Cards by Type */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Cards by Type
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-card p-3 text-center">
                  <p className="text-2xl font-bold text-sakura-400">{insights.cardsByType.kana}</p>
                  <p className="text-xs text-slate-500">Kana</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-2xl font-bold text-teal-400">{insights.cardsByType.vocab}</p>
                  <p className="text-xs text-slate-500">Vocabulary</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-2xl font-bold text-gold-400">{insights.cardsByType.grammar}</p>
                  <p className="text-xs text-slate-500">Grammar</p>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Performance
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-card p-3 text-center">
                  <p className="text-2xl font-bold text-slate-100">
                    {insights.retentionRate.toFixed(0)}%
                  </p>
                  <p className="text-xs text-slate-500">Retention Rate</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-2xl font-bold text-slate-100">
                    {(insights.averageEase * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-slate-500">Avg Ease</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-2xl font-bold text-slate-100">
                    {insights.averageInterval.toFixed(1)}d
                  </p>
                  <p className="text-xs text-slate-500">Avg Interval</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Tab */}
        {activeTab === "forecast" && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Upcoming Reviews (Next 7 Days)
            </h4>
            <div className="space-y-2">
              {insights.upcomingReviews.map((day, i) => {
                const date = new Date(day.date);
                const isToday = i === 0;
                const dayName = isToday ? "Today" : date.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
                const maxCount = Math.max(...insights.upcomingReviews.map(d => d.count), 1);
                const width = (day.count / maxCount) * 100;
                
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className={`text-sm w-24 ${isToday ? "text-sakura-400 font-bold" : "text-slate-400"}`}>
                      {dayName}
                    </span>
                    <div className="flex-1 h-6 bg-navy-800 rounded-lg overflow-hidden">
                      <div 
                        className={`h-full rounded-lg transition-all duration-500 ${
                          isToday ? "bg-gradient-to-r from-sakura-500 to-sakura-400" : "bg-navy-600"
                        }`}
                        style={{ width: `${Math.max(width, day.count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                    <span className={`text-sm w-8 text-right ${isToday ? "text-sakura-400 font-bold" : "text-slate-400"}`}>
                      {day.count}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="glass-card p-4 mt-6">
              <p className="text-sm text-slate-400">
                <span className="text-teal-400 font-semibold">Tip:</span> Consistent daily reviews 
                help maintain optimal retention. Try to review cards when they&apos;re due to maximize 
                the effectiveness of spaced repetition.
              </p>
            </div>
          </div>
        )}

        {/* Struggling Cards Tab */}
        {activeTab === "struggling" && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cards That Need Extra Attention
            </h4>
            
            {insights.strugglingCards.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🎉</p>
                <p className="text-slate-300">No struggling cards!</p>
                <p className="text-sm text-slate-500 mt-1">
                  All your cards have healthy ease factors. Keep up the great work!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {insights.strugglingCards.map((card) => (
                  <div key={card.id} className="glass-card p-3 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-japanese text-lg">{card.front}</p>
                      <p className="text-sm text-teal-400">{card.back}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        card.easeFactor < 1.5 ? "text-red-400" : "text-orange-400"
                      }`}>
                        {(card.easeFactor * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-slate-500">ease</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="glass-card p-4 mt-4">
              <p className="text-sm text-slate-400">
                <span className="text-gold-400 font-semibold">Why does ease matter?</span> Cards with 
                low ease factors (below 200%) indicate items you&apos;ve found difficult. They&apos;ll appear 
                more frequently until you consistently answer &quot;Good&quot; or &quot;Easy&quot;.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass-card p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
