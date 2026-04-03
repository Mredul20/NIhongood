"use client";

import { useState, useEffect, useCallback } from "react";
import { VOCABULARY } from "@/data/vocabulary";
import { KANJI_N5 } from "@/data/kanji";
import { useProgressStore } from "@/store/progressStore";
import { useLearningStore } from "@/store/learningStore";

const CHALLENGE_DURATION = 60; // seconds
const QUESTIONS_PER_CHALLENGE = 10;

type QuestionType = "vocab-meaning" | "kanji-meaning" | "vocab-reading";

interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  promptSub?: string;
  options: string[];
  correct: number;
  xp: number;
}

function generateQuestions(): Question[] {
  const questions: Question[] = [];

  // Vocab meaning questions
  const vocabPool = [...VOCABULARY].sort(() => Math.random() - 0.5).slice(0, 15);
  vocabPool.slice(0, 5).forEach((word) => {
    const wrong = VOCABULARY.filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.english);
    const options = [...wrong, word.english].sort(() => Math.random() - 0.5);
    questions.push({
      id: `v-${word.id}`,
      type: "vocab-meaning",
      prompt: word.kanji,
      promptSub: word.hiragana !== word.kanji ? word.hiragana : undefined,
      options,
      correct: options.indexOf(word.english),
      xp: 15,
    });
  });

  // Kanji meaning questions
  const kanjiPool = [...KANJI_N5].sort(() => Math.random() - 0.5).slice(0, 10);
  kanjiPool.slice(0, 3).forEach((k) => {
    const wrong = KANJI_N5.filter((x) => x.id !== k.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((x) => x.meaning[0]);
    const options = [...wrong, k.meaning[0]].sort(() => Math.random() - 0.5);
    questions.push({
      id: `k-${k.id}`,
      type: "kanji-meaning",
      prompt: k.kanji,
      promptSub: k.onyomi[0],
      options,
      correct: options.indexOf(k.meaning[0]),
      xp: 20,
    });
  });

  // Vocab reading questions
  vocabPool.slice(5, 7).forEach((word) => {
    if (word.hiragana === word.kanji) return;
    const wrong = VOCABULARY.filter((w) => w.id !== word.id && w.hiragana !== w.kanji)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.hiragana);
    const options = [...wrong, word.hiragana].sort(() => Math.random() - 0.5);
    questions.push({
      id: `r-${word.id}`,
      type: "vocab-reading",
      prompt: word.kanji,
      promptSub: word.english,
      options,
      correct: options.indexOf(word.hiragana),
      xp: 18,
    });
  });

  return questions.sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_CHALLENGE);
}

function getTypeLabel(type: QuestionType): string {
  if (type === "vocab-meaning") return "What does this mean?";
  if (type === "kanji-meaning") return "What is the meaning?";
  return "What is the reading?";
}

export default function ChallengePage() {
  const progress = useProgressStore();
  const learning = useLearningStore();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_DURATION);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { setPhase("done"); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const startChallenge = () => {
    const qs = generateQuestions();
    setQuestions(qs);
    setQi(0);
    setSelected(null);
    setScore(0);
    setXpEarned(0);
    setTimeLeft(CHALLENGE_DURATION);
    setStreak(0);
    setBestStreak(0);
    setPhase("playing");
  };

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const q = questions[qi];
    const correct = idx === q.correct;

    if (correct) {
      const newStreak = streak + 1;
      const bonus = newStreak >= 3 ? Math.floor(q.xp * 0.5) : 0;
      const earned = q.xp + bonus;
      setScore((s) => s + 1);
      setXpEarned((x) => x + earned);
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setSelected(null);
      if (qi + 1 >= questions.length) {
        setPhase("done");
      } else {
        setQi((i) => i + 1);
      }
    }, 900);
  }, [selected, questions, qi, streak]);

  // Save results when done
  useEffect(() => {
    if (phase === "done" && xpEarned > 0) {
      progress.addXP(xpEarned);
      progress.recordStudySession(2);
    }
  }, [phase]);

  if (!mounted) return <div className="animate-pulse duo-card h-96" />;

  // ── Intro ──
  if (phase === "intro") {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayLog = progress.dailyLogs.find((l) => l.date === todayStr);
    const alreadyDone = (todayLog?.xpEarned || 0) >= 50;

    return (
      <div className="max-w-lg mx-auto space-y-6 animate-fade-in pb-8">
        <div className="text-center pt-4">
          <div className="text-7xl mb-4">⚡</div>
          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Daily Challenge</h1>
          <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>
            {CHALLENGE_DURATION}s timed quiz · {QUESTIONS_PER_CHALLENGE} questions · Bonus XP for streaks!
          </p>
        </div>

        <div className="duo-card p-6 space-y-4">
          <h2 className="section-title text-base">📋 How it works</h2>
          {[
            ["⚡", "60 seconds to answer as many questions as possible"],
            ["🔥", "Answer in a row to build a streak for bonus XP"],
            ["🎯", "Mix of vocab, kanji, and reading questions"],
            ["🏆", "Up to 200+ bonus XP for a perfect run"],
          ].map(([icon, text]) => (
            <div key={text as string} className="flex items-center gap-3">
              <span className="text-xl">{icon}</span>
              <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{text as string}</p>
            </div>
          ))}
        </div>

        {alreadyDone && (
          <div className="p-4 rounded-2xl border-2 text-center" style={{ background: "rgba(255,75,139,0.06)", borderColor: "rgba(255,75,139,0.25)" }}>
            <p className="text-sm font-bold" style={{ color: "#ff4b8b" }}>✅ You've already earned challenge XP today!</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>You can still play for fun</p>
          </div>
        )}

        <button onClick={startChallenge} className="btn-primary w-full py-4 text-lg">
          ⚡ Start Challenge!
        </button>
      </div>
    );
  }

  // ── Done ──
  if (phase === "done") {
    const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    return (
      <div className="max-w-lg mx-auto animate-scale-in pb-8">
        <div className="duo-card p-8 text-center">
          <div className="text-6xl mb-4">{accuracy >= 80 ? "🏆" : accuracy >= 50 ? "🎯" : "💪"}</div>
          <h2 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>Challenge Complete!</h2>
          <p className="font-semibold mb-6" style={{ color: "var(--text-secondary)" }}>
            {accuracy >= 80 ? "Outstanding performance!" : accuracy >= 50 ? "Good effort!" : "Keep practicing!"}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "Score", value: `${score}/${questions.length}`, color: "#ff4b8b" },
              { label: "Accuracy", value: `${accuracy}%`, color: "#1cb0f6" },
              { label: "XP Earned", value: `+${xpEarned}`, color: "#ffc800" },
              { label: "Best Streak", value: `${bestStreak}🔥`, color: "#ff9600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-4 rounded-2xl border-2" style={{ background: `${color}08`, borderColor: `${color}30` }}>
                <p className="text-2xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs font-black uppercase tracking-wide mt-1" style={{ color: "var(--text-secondary)" }}>{label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={startChallenge} className="btn-primary flex-1">🔄 Play Again</button>
            <a href="/dashboard" className="btn-secondary flex-1 text-center">🏠 Dashboard</a>
          </div>
        </div>
      </div>
    );
  }

  // ── Playing ──
  const q = questions[qi];
  const timerPct = (timeLeft / CHALLENGE_DURATION) * 100;
  const timerColor = timeLeft > 30 ? "#58cc02" : timeLeft > 10 ? "#ff9600" : "#ff4b4b";

  return (
    <div className="max-w-lg mx-auto space-y-4 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black" style={{ color: timerColor }}>⏱ {timeLeft}s</div>
          {streak >= 2 && <div className="text-sm font-black text-orange-400">🔥 {streak} streak!</div>}
        </div>
        <div className="flex items-center gap-3 text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
          <span style={{ color: "#ff4b8b" }}>✓ {score}</span>
          <span>{qi + 1}/{questions.length}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="progress-bar h-3">
        <div className="progress-bar-fill transition-all duration-1000" style={{ width: `${timerPct}%`, background: timerColor }} />
      </div>

      {/* Question */}
      <div className="duo-card p-8 text-center">
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "var(--text-secondary)" }}>
          {getTypeLabel(q.type)}
        </p>
        <p className="text-6xl font-japanese font-black mb-2" style={{ color: "var(--text-primary)" }}>{q.prompt}</p>
        {q.promptSub && <p className="text-lg font-japanese font-semibold" style={{ color: "#ce82ff" }}>{q.promptSub}</p>}
        <p className="text-xs font-bold mt-2 px-2 py-0.5 rounded-full inline-block" style={{ background: "rgba(255,75,139,0.1)", color: "#ff4b8b" }}>
          +{q.xp} XP {streak >= 2 ? `(+${Math.floor(q.xp * 0.5)} streak bonus!)` : ""}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {q.options.map((opt, i) => {
          let bg = "var(--bg-card)", border = "var(--border-color)", color = "var(--text-primary)", shadow = "var(--border-color)";
          if (selected !== null) {
            if (i === q.correct)       { bg = "rgba(88,204,2,0.1)";  border = "#58cc02"; color = "#46a302"; shadow = "rgba(88,204,2,0.4)"; }
            else if (i === selected)   { bg = "rgba(255,75,75,0.1)"; border = "#ff4b4b"; color = "#d93636"; shadow = "rgba(255,75,75,0.3)"; }
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className="p-4 rounded-2xl border-2 font-bold text-left transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
              style={{ background: bg, borderColor: border, color, boxShadow: `0 4px 0 ${shadow}` }}
            >
              {opt}
              {selected !== null && i === q.correct && " ✓"}
              {selected !== null && i === selected && i !== q.correct && " ✗"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
