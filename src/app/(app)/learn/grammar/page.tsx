"use client";

import { useState, useEffect } from "react";
import { GRAMMAR_POINTS, GrammarPoint } from "@/data/grammar";
import { useLearningStore } from "@/store/learningStore";
import { useProgressStore } from "@/store/progressStore";
import { useSRSStore } from "@/store/srsStore";

export default function GrammarPage() {
  const [selectedPoint, setSelectedPoint] = useState<GrammarPoint | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizPoint, setQuizPoint] = useState<GrammarPoint | null>(null);
  const [mounted, setMounted] = useState(false);

  const learning = useLearningStore();
  const progress = useProgressStore();
  const srs = useSRSStore();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="animate-pulse glass-card h-96" />;

  const completedCount = Object.keys(learning.completedGrammar).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <span>📝</span> Grammar
        </h1>
        <p className="text-slate-400 mt-1">N5 grammar points — {completedCount}/{GRAMMAR_POINTS.length} completed</p>
      </div>

      <div className="glass-card p-4">
        <div className="progress-bar">
          <div className="progress-bar-fill bg-gold-400" style={{ width: `${(completedCount / GRAMMAR_POINTS.length) * 100}%` }} />
        </div>
      </div>

      {/* Quiz Mode */}
      {quizMode && quizPoint && (
        <GrammarQuiz
          point={quizPoint}
          onComplete={(score) => {
            learning.setGrammarQuizScore(quizPoint.id, score);
            if (score >= quizPoint.quiz.length * 0.5) {
              learning.markGrammarCompleted(quizPoint.id);
              if (!srs.hasCard(`grammar-${quizPoint.id}`)) {
                srs.addCard({
                  id: `grammar-${quizPoint.id}`,
                  front: quizPoint.titleJa,
                  back: quizPoint.title,
                  type: "grammar",
                });
              }
            }
            progress.addXP(score * 15);
            progress.recordStudySession(5);
            progress.recordLessonComplete();
            setQuizMode(false);
            setQuizPoint(null);
          }}
          onExit={() => { setQuizMode(false); setQuizPoint(null); }}
        />
      )}

      {/* Grammar List */}
      {!quizMode && (
        <div className="space-y-4">
          {GRAMMAR_POINTS.map((point, index) => {
            const isCompleted = learning.completedGrammar[point.id];
            const isExpanded = selectedPoint?.id === point.id;
            return (
              <div key={point.id} className={`glass-card overflow-hidden transition-all duration-300 ${isCompleted ? "border-teal-500/20" : ""}`}>
                {/* Header */}
                <button
                  onClick={() => setSelectedPoint(isExpanded ? null : point)}
                  className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
                  id={`grammar-${point.id}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                    isCompleted
                      ? "bg-teal-500/20 text-teal-400"
                      : "bg-navy-800/60 text-slate-400"
                  }`}>
                    {isCompleted ? "✅" : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-100 truncate">{point.title}</p>
                    <p className="text-sm text-slate-400">{point.structure}</p>
                  </div>
                  <span className="badge-sakura shrink-0">{point.level}</span>
                  <span className={`text-slate-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-slide-up">
                    <p className="text-slate-300 mb-4 leading-relaxed">{point.explanation}</p>

                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Examples</h4>
                    <div className="space-y-3 mb-6">
                      {point.examples.map((ex, i) => (
                        <div key={i} className="bg-navy-800/40 rounded-xl p-4">
                          <p className="text-lg font-japanese text-slate-200">{ex.ja}</p>
                          <p className="text-sm text-slate-400 mt-1">{ex.en}</p>
                          {ex.breakdown && (
                            <p className="text-xs text-sakura-400/70 mt-2 font-mono">{ex.breakdown}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => { setQuizPoint(point); setQuizMode(true); }}
                      className="btn-primary text-sm"
                    >
                      🧠 Take Quiz
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GrammarQuiz({ point, onComplete, onExit }: {
  point: GrammarPoint;
  onComplete: (score: number) => void;
  onExit: () => void;
}) {
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  if (qi >= point.quiz.length) {
    return (
      <div className="glass-card p-8 text-center max-w-lg mx-auto animate-scale-in">
        <div className="text-6xl mb-4">{score >= point.quiz.length ? "🎉" : "👍"}</div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Quiz Complete!</h2>
        <p className="text-lg text-slate-300 mb-2">{point.title}</p>
        <p className="text-4xl font-bold text-gradient-gold mb-6">{score}/{point.quiz.length}</p>
        <button onClick={() => onComplete(score)} className="btn-primary">
          Continue
        </button>
      </div>
    );
  }

  const q = point.quiz[qi];

  return (
    <div className="glass-card p-8 max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-100">{point.titleJa} Quiz</h2>
        <button onClick={onExit} className="text-sm text-slate-400 hover:text-slate-200">✕ Exit</button>
      </div>
      <div className="progress-bar mb-6">
        <div className="progress-bar-fill bg-gold-400" style={{ width: `${((qi + 1) / point.quiz.length) * 100}%` }} />
      </div>
      <p className="text-lg text-slate-200 mb-6 font-medium">{q.question}</p>
      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let style = "bg-navy-800/60 border-white/10 hover:border-gold-400/30 text-slate-200";
          if (selected !== null) {
            if (i === q.correct) style = "bg-teal-500/20 border-teal-400/40 text-teal-300";
            else if (i === selected) style = "bg-red-500/20 border-red-400/40 text-red-300";
          }
          return (
            <button
              key={i}
              onClick={() => {
                if (selected !== null) return;
                setSelected(i);
                if (i === q.correct) setScore((s) => s + 1);
                setTimeout(() => { setSelected(null); setQi((q) => q + 1); }, 1000);
              }}
              className={`w-full p-4 rounded-xl border text-left transition-all ${style}`}
              disabled={selected !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
