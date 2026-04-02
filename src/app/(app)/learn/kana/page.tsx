"use client";

import { useState, useEffect } from "react";
import { HIRAGANA, KATAKANA, KANA_GROUPS, KanaChar } from "@/data/kana";
import { useLearningStore } from "@/store/learningStore";
import { useProgressStore } from "@/store/progressStore";
import { useSRSStore } from "@/store/srsStore";

type Tab = "hiragana" | "katakana";
type Mode = "chart" | "quiz";

export default function KanaPage() {
  const [tab, setTab] = useState<Tab>("hiragana");
  const [mode, setMode] = useState<Mode>("chart");
  const [selectedChar, setSelectedChar] = useState<KanaChar | null>(null);
  const [mounted, setMounted] = useState(false);

  const learning = useLearningStore();
  const progress = useProgressStore();
  const srs = useSRSStore();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="animate-pulse glass-card h-96" />;

  const kanaSet = tab === "hiragana" ? HIRAGANA : KATAKANA;
  const learnedCount = Object.keys(learning.learnedKana).filter((k) => {
    const code = k.charCodeAt(0);
    return tab === "hiragana"
      ? code >= 0x3040 && code <= 0x309f
      : code >= 0x30a0 && code <= 0x30ff;
  }).length;
  const totalCount = kanaSet.length;
  const mastery = Math.round((learnedCount / totalCount) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <span className="text-4xl font-japanese">あ</span> Kana Learning
          </h1>
          <p className="text-slate-400 mt-1">Master hiragana and katakana characters</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("chart")}
            className={mode === "chart" ? "btn-primary text-sm" : "btn-secondary text-sm"}
            id="mode-chart"
          >
            📊 Chart
          </button>
          <button
            onClick={() => setMode("quiz")}
            className={mode === "quiz" ? "btn-primary text-sm" : "btn-secondary text-sm"}
            id="mode-quiz"
          >
            🧠 Quiz
          </button>
        </div>
      </div>

      {/* Tabs + Progress */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-1 p-1 bg-navy-800/60 rounded-xl">
          <button
            onClick={() => setTab("hiragana")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "hiragana" ? "bg-sakura-500/20 text-sakura-400" : "text-slate-400"
            }`}
            id="tab-hiragana"
          >
            ひらがな Hiragana
          </button>
          <button
            onClick={() => setTab("katakana")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "katakana" ? "bg-sakura-500/20 text-sakura-400" : "text-slate-400"
            }`}
            id="tab-katakana"
          >
            カタカナ Katakana
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="progress-bar w-32">
            <div className="progress-bar-fill bg-sakura-400" style={{ width: `${mastery}%` }} />
          </div>
          <span className="text-sm text-slate-400 font-medium">{learnedCount}/{totalCount}</span>
        </div>
      </div>

      {mode === "chart" ? (
        <KanaChart
          kanaSet={kanaSet}
          learnedKana={learning.learnedKana}
          onSelect={(char) => setSelectedChar(char)}
        />
      ) : (
        <KanaQuiz
          kanaSet={kanaSet}
          tab={tab}
          onComplete={(score, total) => {
            progress.addXP(score * 5);
            progress.recordStudySession(2);
            progress.recordLessonComplete();
          }}
          markLearned={(char) => {
            learning.markKanaLearned(char);
            if (!srs.hasCard(`kana-${char}`)) {
              const kanaChar = kanaSet.find((k) => k.char === char);
              if (kanaChar) {
                srs.addCard({
                  id: `kana-${char}`,
                  front: kanaChar.char,
                  back: kanaChar.romaji,
                  type: "kana",
                });
              }
            }
          }}
        />
      )}

      {/* Character Detail Modal */}
      {selectedChar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedChar(null)}>
          <div className="glass-card p-8 max-w-sm w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-8xl font-japanese mb-4">{selectedChar.char}</div>
              <div className="text-2xl text-sakura-400 font-bold mb-2">{selectedChar.romaji}</div>
              <div className="text-sm text-slate-400 mb-6">
                {tab === "hiragana" ? "Hiragana" : "Katakana"} · {KANA_GROUPS.find((g) => g.id === selectedChar.group)?.label}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    learning.markKanaLearned(selectedChar.char);
                    if (!srs.hasCard(`kana-${selectedChar.char}`)) {
                      srs.addCard({
                        id: `kana-${selectedChar.char}`,
                        front: selectedChar.char,
                        back: selectedChar.romaji,
                        type: "kana",
                      });
                    }
                    progress.addXP(2);
                    setSelectedChar(null);
                  }}
                  className={learning.learnedKana[selectedChar.char] ? "btn-success text-sm" : "btn-primary text-sm"}
                >
                  {learning.learnedKana[selectedChar.char] ? "✅ Learned" : "📚 Mark as Learned"}
                </button>
                <button onClick={() => setSelectedChar(null)} className="btn-secondary text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KanaChart({ kanaSet, learnedKana, onSelect }: {
  kanaSet: KanaChar[];
  learnedKana: Record<string, boolean>;
  onSelect: (char: KanaChar) => void;
}) {
  return (
    <div className="glass-card p-6">
      <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-xl mx-auto">
        {KANA_GROUPS.map((group) => {
          const chars = kanaSet.filter((k) => k.group === group.id);
          return chars.map((char) => (
            <button
              key={char.char}
              onClick={() => onSelect(char)}
              className={`kana-cell ${learnedKana[char.char] ? "kana-cell-learned" : ""}`}
              style={{ gridColumn: char.col + 1 }}
            >
              <span className="text-xl sm:text-2xl font-japanese group-hover:scale-110 transition-transform">
                {char.char}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">{char.romaji}</span>
            </button>
          ));
        })}
      </div>
    </div>
  );
}

function KanaQuiz({ kanaSet, tab, onComplete, markLearned }: {
  kanaSet: KanaChar[];
  tab: Tab;
  onComplete: (score: number, total: number) => void;
  markLearned: (char: string) => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [questions, setQuestions] = useState<{ char: KanaChar; options: string[]; correct: number }[]>([]);

  useEffect(() => {
    // Generate 10 random questions
    const shuffled = [...kanaSet].sort(() => Math.random() - 0.5).slice(0, 10);
    const qs = shuffled.map((char) => {
      const wrongOptions = kanaSet
        .filter((k) => k.romaji !== char.romaji)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((k) => k.romaji);
      const options = [...wrongOptions, char.romaji].sort(() => Math.random() - 0.5);
      return { char, options, correct: options.indexOf(char.romaji) };
    });
    setQuestions(qs);
    setQuestionIndex(0);
    setScore(0);
    setSelected(null);
  }, [tab]);

  if (questions.length === 0) return null;

  const isFinished = questionIndex >= questions.length;

  if (isFinished) {
    return (
      <div className="glass-card p-8 text-center animate-scale-in">
        <div className="text-6xl mb-4">{score >= 8 ? "🎉" : score >= 5 ? "👍" : "💪"}</div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Quiz Complete!</h2>
        <p className="text-4xl font-bold text-gradient-sakura mb-4">{score}/{questions.length}</p>
        <p className="text-slate-400 mb-6">
          {score >= 8 ? "Excellent work!" : score >= 5 ? "Good job! Keep practicing!" : "Don't give up! Try again!"}
        </p>
        <button
          onClick={() => {
            onComplete(score, questions.length);
            const shuffled = [...kanaSet].sort(() => Math.random() - 0.5).slice(0, 10);
            const qs = shuffled.map((char) => {
              const wrongOptions = kanaSet.filter((k) => k.romaji !== char.romaji).sort(() => Math.random() - 0.5).slice(0, 3).map((k) => k.romaji);
              const options = [...wrongOptions, char.romaji].sort(() => Math.random() - 0.5);
              return { char, options, correct: options.indexOf(char.romaji) };
            });
            setQuestions(qs);
            setQuestionIndex(0);
            setScore(0);
            setSelected(null);
          }}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const q = questions[questionIndex];

  return (
    <div className="glass-card p-8 max-w-lg mx-auto animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-slate-400">Question {questionIndex + 1}/{questions.length}</span>
        <span className="text-sm text-teal-400 font-medium">Score: {score}</span>
      </div>
      <div className="progress-bar mb-8">
        <div className="progress-bar-fill bg-sakura-400" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <p className="text-sm text-slate-400 mb-4">What is the reading of this character?</p>
        <div className="text-8xl font-japanese animate-bounce-in">{q.char.char}</div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, i) => {
          let style = "bg-navy-800/60 border-white/10 hover:border-sakura-400/30 text-slate-200";
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
                if (i === q.correct) {
                  setScore((s) => s + 1);
                  markLearned(q.char.char);
                }
                setTimeout(() => {
                  setSelected(null);
                  setQuestionIndex((idx) => idx + 1);
                }, 1000);
              }}
              className={`p-4 rounded-xl border font-bold text-lg transition-all ${style}`}
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
