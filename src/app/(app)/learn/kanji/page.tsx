"use client";

import { useState, useEffect } from "react";
import { KANJI_N5, KANJI_CATEGORIES, KanjiChar } from "@/data/kanji";
import { useLearningStore } from "@/store/learningStore";
import { useProgressStore } from "@/store/progressStore";
import { useSRSStore } from "@/store/srsStore";
import { normalizeJapaneseTTS, speak } from "@/lib/speak";

type Mode = "browse" | "quiz" | "detail";

function getPreferredKanjiReading(kanji: KanjiChar) {
  return normalizeJapaneseTTS(kanji.kunyomi[0] || kanji.onyomi[0] || kanji.kanji);
}

export default function KanjiPage() {
  const [mode, setMode] = useState<Mode>("browse");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedKanji, setSelectedKanji] = useState<KanjiChar | null>(null);
  const [mounted, setMounted] = useState(false);

  const learning = useLearningStore();
  const progress = useProgressStore();
  const srs = useSRSStore();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="animate-pulse duo-card h-96" />;

  const filtered = selectedCategory === "all"
    ? KANJI_N5
    : KANJI_N5.filter((k) => k.category === selectedCategory);

  const learnedCount = KANJI_N5.filter((k) => learning.learnedKana[`kanji-${k.id}`]).length;
  const masteryPct = Math.round((learnedCount / KANJI_N5.length) * 100);

  const markLearnedKanji = (k: KanjiChar) => {
    learning.markKanaLearned(`kanji-${k.id}`);
    if (!srs.hasCard(`kanji-${k.id}`)) {
      srs.addCard({
        id: `kanji-${k.id}`,
        front: k.kanji,
        back: `${k.meaning.join(", ")} (${k.kunyomi[0] || k.onyomi[0]})`,
        type: "vocab",
      });
    }
    progress.addXP(5);
  };

  if (mode === "quiz") {
    return (
      <KanjiQuiz
        kanjiSet={filtered.length > 0 ? filtered : KANJI_N5}
        onComplete={(score) => {
          progress.addXP(score * 8);
          progress.recordStudySession(5);
          setMode("browse");
        }}
        markLearned={markLearnedKanji}
        onExit={() => setMode("browse")}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#ff9600" }}>漢字</p>
          <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>Kanji</h1>
          <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Learn N5 kanji — {learnedCount}/{KANJI_N5.length} learned
          </p>
        </div>
        <button
          onClick={() => setMode("quiz")}
          className="btn-primary w-fit"
          id="kanji-quiz-btn"
        >
          🧠 Quiz Mode
        </button>
      </div>

      {/* XP / Progress bar */}
      <div className="duo-card p-4 flex items-center gap-4">
        <span className="text-3xl">漢</span>
        <div className="flex-1">
          <div className="flex justify-between mb-1.5">
            <span className="text-sm font-black" style={{ color: "var(--text-primary)" }}>Kanji Mastery</span>
            <span className="text-sm font-black" style={{ color: "#ff9600" }}>{masteryPct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${masteryPct}%`, background: "linear-gradient(90deg,#ff9600,#ffc800)" }} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black" style={{ color: "#ff9600" }}>{learnedCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>Learned</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
            selectedCategory === "all" ? "border-[#ff9600] bg-[#ff960015] text-[#ff9600]" : "border-[var(--border-color)] text-[var(--text-secondary)]"
          }`}
          style={selectedCategory === "all" ? { boxShadow: "0 3px 0 #e0800080" } : { boxShadow: "0 3px 0 var(--border-color)" }}
        >
          All ({KANJI_N5.length})
        </button>
        {KANJI_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
              selectedCategory === cat.id ? "border-[#ff9600] bg-[#ff960015] text-[#ff9600]" : "border-[var(--border-color)] text-[var(--text-secondary)]"
            }`}
            style={selectedCategory === cat.id ? { boxShadow: "0 3px 0 #e0800080" } : { boxShadow: "0 3px 0 var(--border-color)" }}
          >
            {cat.emoji} {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Kanji Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {filtered.map((k) => {
          const isLearned = !!learning.learnedKana[`kanji-${k.id}`];
          return (
            <button
              key={k.id}
              onClick={() => setSelectedKanji(k)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all hover:translate-y-[-2px] active:translate-y-[1px] group"
              style={{
                background: isLearned ? "rgba(88,204,2,0.07)" : "var(--bg-card)",
                borderColor: isLearned ? "rgba(88,204,2,0.4)" : "var(--border-color)",
                boxShadow: isLearned ? "0 4px 0 rgba(88,204,2,0.3)" : "0 4px 0 var(--border-color)",
              }}
            >
              <span
                className="text-3xl font-japanese font-bold mb-1 transition-transform group-hover:scale-110"
                style={{ color: isLearned ? "#e0357a" : "var(--text-primary)" }}
              >
                {k.kanji}
              </span>
              <span className="text-[10px] font-bold" style={{ color: "var(--text-secondary)" }}>
                {k.meaning[0]}
              </span>
              {isLearned && <span className="text-xs mt-0.5">✅</span>}
            </button>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedKanji && (
        <KanjiDetailModal
          kanji={selectedKanji}
          isLearned={!!learning.learnedKana[`kanji-${selectedKanji.id}`]}
          onLearn={() => { markLearnedKanji(selectedKanji); }}
          onClose={() => setSelectedKanji(null)}
        />
      )}
    </div>
  );
}

/* ─── Kanji Detail Modal ─── */
function KanjiDetailModal({ kanji, isLearned, onLearn, onClose }: {
  kanji: KanjiChar;
  isLearned: boolean;
  onLearn: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 border-2 animate-scale-in"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", boxShadow: "0 8px 0 var(--border-color)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl font-japanese font-bold border-2 cursor-pointer hover:scale-110 transition-transform"
              style={{ background: "rgba(255,150,0,0.1)", borderColor: "rgba(255,150,0,0.3)", color: "#ff9600" }}
              onClick={() => speak(getPreferredKanjiReading(kanji))}
              title="Click to hear pronunciation"
            >
              {kanji.kanji}
            </div>
            <div>
              <p className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{kanji.meaning.join(", ")}</p>
              <p className="text-xs font-bold mt-0.5" style={{ color: "var(--text-secondary)" }}>{kanji.strokes} strokes · N5</p>
              <button
                onClick={() => speak(getPreferredKanjiReading(kanji))}
                className="mt-1.5 flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border-2 transition-all hover:translate-y-[-1px]"
                style={{ color: "#1cb0f6", borderColor: "rgba(28,176,246,0.3)", background: "rgba(28,176,246,0.08)" }}
              >
                🔊 Hear it
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color: "var(--text-secondary)" }}>×</button>
        </div>

        {/* Readings */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl border-2" style={{ background: "rgba(28,176,246,0.06)", borderColor: "rgba(28,176,246,0.2)" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "#1cb0f6" }}>On-yomi</p>
            <div className="flex flex-wrap gap-1">
              {kanji.onyomi.length > 0 ? kanji.onyomi.map((r) => (
                <button key={r} onClick={() => speak(r)} className="px-2 py-0.5 rounded-full text-sm font-bold" style={{ background: "rgba(28,176,246,0.15)", color: "#0a91d1" }}>
                  {r} 🔊
                </button>
              )) : <span className="text-xs" style={{ color: "var(--text-secondary)" }}>—</span>}
            </div>
          </div>
          <div className="p-3 rounded-xl border-2" style={{ background: "rgba(88,204,2,0.06)", borderColor: "rgba(88,204,2,0.2)" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "#ff4b8b" }}>Kun-yomi</p>
            <div className="flex flex-wrap gap-1">
              {kanji.kunyomi.length > 0 ? kanji.kunyomi.map((r) => (
                <button key={r} onClick={() => speak(r)} className="px-2 py-0.5 rounded-full text-sm font-bold" style={{ background: "rgba(88,204,2,0.12)", color: "#e0357a" }}>
                  {r} 🔊
                </button>
              )) : <span className="text-xs" style={{ color: "var(--text-secondary)" }}>—</span>}
            </div>
          </div>
        </div>

        {/* Mnemonic */}
        <div className="p-3 rounded-xl border-2 mb-4" style={{ background: "rgba(206,130,255,0.06)", borderColor: "rgba(206,130,255,0.2)" }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#ce82ff" }}>💡 Memory Trick</p>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{kanji.mnemonic}</p>
        </div>

        {/* Examples */}
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>Examples</p>
          <div className="space-y-2">
            {kanji.examples.map((ex, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border-2" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
                <div>
                  <button
                    onClick={() => speak(normalizeJapaneseTTS(ex.reading))}
                    className="text-base font-bold font-japanese hover:scale-105 transition-transform inline-block"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {ex.word}
                  </button>
                  <span className="text-xs ml-2" style={{ color: "var(--text-secondary)" }}>{ex.reading}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{ex.meaning}</span>
                  <button onClick={() => speak(normalizeJapaneseTTS(ex.reading))} className="text-sm">🔊</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => { onLearn(); }}
            className={`flex-1 font-black py-3 rounded-xl border-2 text-sm uppercase tracking-wide transition-all ${
              isLearned
                ? "border-[rgba(88,204,2,0.4)] bg-[rgba(88,204,2,0.1)] text-[#e0357a]"
                : "btn-primary"
            }`}
            style={!isLearned ? {} : { boxShadow: "0 3px 0 rgba(88,204,2,0.3)" }}
          >
            {isLearned ? "✅ Learned!" : "📚 Mark as Learned"}
          </button>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Kanji Quiz ─── */
function KanjiQuiz({ kanjiSet, onComplete, markLearned, onExit }: {
  kanjiSet: KanjiChar[];
  onComplete: (score: number, total: number) => void;
  markLearned: (k: KanjiChar) => void;
  onExit: () => void;
}) {
  const COUNT = Math.min(10, kanjiSet.length);
  const [questions, setQuestions] = useState<{ kanji: KanjiChar; options: string[]; correct: number }[]>([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizType, setQuizType] = useState<"meaning" | "reading">("meaning");

  useEffect(() => {
    const shuffled = [...kanjiSet].sort(() => Math.random() - 0.5).slice(0, COUNT);
    const qs = shuffled.map((k) => {
      const answer = quizType === "meaning" ? k.meaning[0] : (k.kunyomi[0] || k.onyomi[0]);
      const wrongPool = kanjiSet.filter((x) => x.id !== k.id);
      const wrongs = wrongPool.sort(() => Math.random() - 0.5).slice(0, 3)
        .map((x) => quizType === "meaning" ? x.meaning[0] : (x.kunyomi[0] || x.onyomi[0]));
      const options = [...wrongs, answer].sort(() => Math.random() - 0.5);
      return { kanji: k, options, correct: options.indexOf(answer) };
    });
    setQuestions(qs);
    setQi(0); setScore(0); setSelected(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizType]); // kanjiSet/COUNT intentionally excluded: reshuffle on type change only

  if (questions.length === 0) return null;
  const finished = qi >= questions.length;

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-lg mx-auto animate-scale-in pb-8">
        <div className="duo-card p-8 text-center">
          <div className="text-6xl mb-3">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
          <h2 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>Quiz Complete!</h2>
          <p className="text-5xl font-black my-4" style={{ color: pct >= 80 ? "#ff4b8b" : pct >= 50 ? "#ff9600" : "#ff4b4b" }}>
            {score}/{questions.length}
          </p>
          <p className="font-bold mb-6" style={{ color: "var(--text-secondary)" }}>
            {pct >= 80 ? "Excellent! You really know your kanji!" : pct >= 50 ? "Good job! Keep practicing!" : "Don't give up! Review and try again!"}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { onComplete(score, questions.length); }} className="btn-primary">🔄 Again</button>
            <button onClick={onExit} className="btn-secondary">← Back</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[qi];

  return (
    <div className="max-w-lg mx-auto space-y-5 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>← Exit</button>
        <div className="flex gap-2">
          {(["meaning","reading"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setQuizType(t)}
              className="px-3 py-1.5 rounded-xl border-2 text-xs font-black uppercase tracking-wide transition-all"
              style={quizType === t
                ? { background: "rgba(255,150,0,0.12)", borderColor: "rgba(255,150,0,0.4)", color: "#ff9600", boxShadow: "0 2px 0 #e0800080" }
                : { background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
            >
              {t === "meaning" ? "📖 Meaning" : "🔤 Reading"}
            </button>
          ))}
        </div>
        <span className="text-sm font-black" style={{ color: "#ff9600" }}>⭐ {score}</span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${(qi / questions.length) * 100}%`, background: "linear-gradient(90deg,#ff9600,#ffc800)" }} />
      </div>
      <p className="text-center text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
        {qi + 1} / {questions.length}
      </p>

      {/* Card */}
      <div className="duo-card p-8 text-center">
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "var(--text-secondary)" }}>
          {quizType === "meaning" ? "What does this kanji mean?" : "What is the reading?"}
        </p>
        <button
          onClick={() => speak(getPreferredKanjiReading(q.kanji))}
          className="text-8xl font-japanese font-bold hover:scale-110 transition-transform cursor-pointer"
          style={{ color: "var(--text-primary)" }}
          title="Click to hear"
        >
          {q.kanji.kanji}
        </button>
        <p className="text-xs font-semibold mt-3" style={{ color: "var(--text-secondary)" }}>
          Tap kanji to hear · {q.kanji.strokes} strokes
        </p>
        <button onClick={() => speak(getPreferredKanjiReading(q.kanji))} className="mt-2 text-sm font-bold" style={{ color: "#1cb0f6" }}>🔊 Play audio</button>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, i) => {
          let bg = "var(--bg-card)", border = "var(--border-color)", color = "var(--text-primary)", shadow = "var(--border-color)";
          if (selected !== null) {
            if (i === q.correct) { bg = "rgba(88,204,2,0.1)"; border = "#ff4b8b"; color = "#e0357a"; shadow = "rgba(88,204,2,0.4)"; }
            else if (i === selected) { bg = "rgba(255,75,75,0.1)"; border = "#ff4b4b"; color = "#d93636"; shadow = "rgba(255,75,75,0.4)"; }
          }
          return (
            <button
              key={i}
              disabled={selected !== null}
              onClick={() => {
                if (selected !== null) return;
                setSelected(i);
                if (i === q.correct) { setScore((s) => s + 1); markLearned(q.kanji); }
                setTimeout(() => { setSelected(null); setQi((n) => n + 1); }, 1200);
              }}
              className="p-4 rounded-2xl border-2 font-bold text-base transition-all"
              style={{ background: bg, borderColor: border, color, boxShadow: `0 4px 0 ${shadow}` }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
