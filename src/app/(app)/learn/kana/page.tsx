"use client";

import { useState, useEffect } from "react";
import { HIRAGANA, KATAKANA, KANA_GROUPS, KanaChar } from "@/data/kana";
import { useLearningStore } from "@/store/learningStore";
import { useProgressStore } from "@/store/progressStore";
import { useSRSStore } from "@/store/srsStore";
import { speak } from "@/lib/speak";

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
  if (!mounted) return <div className="animate-pulse duo-card h-96" />;

  const kanaSet = tab === "hiragana" ? HIRAGANA : KATAKANA;
  const learnedCount = Object.keys(learning.learnedKana).filter((k) => {
    const code = k.charCodeAt(0);
    return tab === "hiragana" ? code >= 0x3040 && code <= 0x309f : code >= 0x30a0 && code <= 0x30ff;
  }).length;
  const mastery = Math.round((learnedCount / kanaSet.length) * 100);
  const color = tab === "hiragana" ? "#ff86d0" : "#1cb0f6";
  const shadow = tab === "hiragana" ? "#e060b0" : "#0a91d1";

  const addToSRS = (char: KanaChar) => {
    if (!srs.hasCard(`kana-${char.char}`)) {
      srs.addCard({ id: `kana-${char.char}`, front: char.char, back: char.romaji, type: "kana" });
    }
  };

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color }}>かな</p>
          <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>Kana</h1>
          <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--text-secondary)" }}>Master hiragana and katakana</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode("chart")} className={mode === "chart" ? "btn-primary text-sm" : "btn-secondary text-sm"} id="mode-chart">📊 Chart</button>
          <button onClick={() => setMode("quiz")}  className={mode === "quiz"  ? "btn-primary text-sm" : "btn-secondary text-sm"} id="mode-quiz">🧠 Quiz</button>
        </div>
      </div>

      {/* Tabs + progress */}
      <div className="duo-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          {(["hiragana","katakana"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-xl border-2 text-sm font-black transition-all"
              style={tab === t
                ? { background: `${color}15`, borderColor: `${color}50`, color, boxShadow: `0 3px 0 ${shadow}40` }
                : { background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
              id={`tab-${t}`}
            >
              {t === "hiragana" ? "ひらがな" : "カタカナ"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="progress-bar w-28">
            <div className="progress-bar-fill" style={{ width: `${mastery}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)` }} />
          </div>
          <span className="text-sm font-black" style={{ color }}>{learnedCount}/{kanaSet.length}</span>
        </div>
      </div>

      {mode === "chart" ? (
        <KanaChart kanaSet={kanaSet} learnedKana={learning.learnedKana} onSelect={setSelectedChar} color={color} />
      ) : (
        <KanaQuiz
          kanaSet={kanaSet}
          tab={tab}
          color={color}
          shadow={shadow}
          onComplete={(score) => { progress.addXP(score * 5); progress.recordStudySession(2); progress.recordLessonComplete(); }}
          markLearned={(char) => { learning.markKanaLearned(char); addToSRS(kanaSet.find((k) => k.char === char)!); }}
        />
      )}

      {/* Character detail modal */}
      {selectedChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setSelectedChar(null)}>
          <div
            className="w-full max-w-xs rounded-2xl p-6 border-2 animate-scale-in text-center"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", boxShadow: "0 8px 0 var(--border-color)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => speak(selectedChar.char)}
              className="text-8xl font-japanese font-bold hover:scale-110 transition-transform cursor-pointer block mx-auto mb-2"
              style={{ color: "var(--text-primary)" }}
              title="Click to hear"
            >
              {selectedChar.char}
            </button>
            <p className="text-2xl font-black mb-1" style={{ color }}>{selectedChar.romaji}</p>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
              {tab === "hiragana" ? "Hiragana" : "Katakana"} · {KANA_GROUPS.find((g) => g.id === selectedChar.group)?.label}
            </p>
            <button onClick={() => speak(selectedChar.char)} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border-2 mb-5 transition-all hover:translate-y-[-1px]"
              style={{ color: "#1cb0f6", borderColor: "rgba(28,176,246,0.3)", background: "rgba(28,176,246,0.08)" }}>
              🔊 Hear pronunciation
            </button>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  learning.markKanaLearned(selectedChar.char);
                  addToSRS(selectedChar);
                  progress.addXP(2);
                  setSelectedChar(null);
                }}
                className={learning.learnedKana[selectedChar.char] ? "btn-success text-sm" : "btn-primary text-sm"}
              >
                {learning.learnedKana[selectedChar.char] ? "✅ Learned!" : "📚 Mark Learned"}
              </button>
              <button onClick={() => setSelectedChar(null)} className="btn-secondary text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KanaChart({ kanaSet, learnedKana, onSelect, color }: {
  kanaSet: KanaChar[]; learnedKana: Record<string, boolean>; onSelect: (c: KanaChar) => void; color: string;
}) {
  return (
    <div className="duo-card p-5">
      <div className="grid grid-cols-5 gap-2 max-w-xl mx-auto">
        {KANA_GROUPS.map((group) =>
          kanaSet.filter((k) => k.group === group.id).map((char) => {
            const learned = !!learnedKana[char.char];
            return (
              <div
                key={char.char}
                onClick={() => onSelect(char)}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all hover:translate-y-[-2px] active:translate-y-[1px] group cursor-pointer"
                style={{
                  gridColumn: char.col + 1,
                  background: learned ? "rgba(88,204,2,0.07)" : "var(--bg-secondary)",
                  borderColor: learned ? "rgba(88,204,2,0.4)" : "var(--border-color)",
                  boxShadow: learned ? "0 3px 0 rgba(88,204,2,0.3)" : "0 3px 0 var(--border-color)",
                }}
              >
                <span
                  onClick={(e) => { e.stopPropagation(); speak(char.char); }}
                  className="text-2xl font-japanese font-bold transition-transform group-hover:scale-110 cursor-pointer"
                  style={{ color: learned ? "#e0357a" : "var(--text-primary)" }}
                  title={`Click to hear ${char.char}`}
                >
                  {char.char}
                </span>
                <span className="text-[10px] font-bold mt-0.5" style={{ color: learned ? "#ff4b8b" : "var(--text-secondary)" }}>
                  {char.romaji}
                </span>
                {learned && <span className="text-[10px]">✅</span>}
              </div>
            );
          })
        )}
      </div>
      <p className="text-center text-xs font-semibold mt-4" style={{ color: "var(--text-secondary)" }}>
        💡 Tap any character to see details · Click the character in the card to hear it
      </p>
    </div>
  );
}

function KanaQuiz({ kanaSet, tab, color, shadow, onComplete, markLearned }: {
  kanaSet: KanaChar[]; tab: Tab; color: string; shadow: string;
  onComplete: (score: number, total: number) => void;
  markLearned: (char: string) => void;
}) {
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [questions, setQuestions] = useState<{ char: KanaChar; options: string[]; correct: number }[]>([]);

  useEffect(() => {
    const shuffled = [...kanaSet].sort(() => Math.random() - 0.5).slice(0, 10);
    const qs = shuffled.map((char) => {
      const wrongs = kanaSet.filter((k) => k.romaji !== char.romaji).sort(() => Math.random() - 0.5).slice(0, 3).map((k) => k.romaji);
      const options = [...wrongs, char.romaji].sort(() => Math.random() - 0.5);
      return { char, options, correct: options.indexOf(char.romaji) };
    });
    setQuestions(qs); setQi(0); setScore(0); setSelected(null);
  }, [tab]);

  if (questions.length === 0) return null;

  if (qi >= questions.length) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="duo-card p-8 text-center max-w-lg mx-auto animate-scale-in">
        <div className="text-6xl mb-3">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
        <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Quiz Complete!</h2>
        <p className="text-5xl font-black my-4" style={{ color: pct >= 80 ? "#ff4b8b" : pct >= 50 ? "#ff9600" : "#ff4b4b" }}>
          {score}/{questions.length}
        </p>
        <p className="font-bold mb-6" style={{ color: "var(--text-secondary)" }}>
          {pct >= 80 ? "Excellent! You're mastering kana!" : pct >= 50 ? "Good job! Keep practicing!" : "Don't give up! Try again!"}
        </p>
        <button
          onClick={() => {
            onComplete(score, questions.length);
            const shuffled = [...kanaSet].sort(() => Math.random() - 0.5).slice(0, 10);
            const qs = shuffled.map((char) => {
              const wrongs = kanaSet.filter((k) => k.romaji !== char.romaji).sort(() => Math.random() - 0.5).slice(0, 3).map((k) => k.romaji);
              const options = [...wrongs, char.romaji].sort(() => Math.random() - 0.5);
              return { char, options, correct: options.indexOf(char.romaji) };
            });
            setQuestions(qs); setQi(0); setScore(0); setSelected(null);
          }}
          className="btn-primary"
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  const q = questions[qi];

  return (
    <div className="duo-card p-6 max-w-lg mx-auto animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>{qi + 1}/{questions.length}</span>
        <span className="text-sm font-black" style={{ color }}>{score} ⭐</span>
      </div>
      <div className="progress-bar mb-6">
        <div className="progress-bar-fill" style={{ width: `${((qi + 1) / questions.length) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)` }} />
      </div>

      {/* Question */}
      <div className="text-center mb-6">
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
          What is the reading?
        </p>
        <button
          onClick={() => speak(q.char.char)}
          className="text-8xl font-japanese font-bold hover:scale-110 transition-transform cursor-pointer"
          style={{ color: "var(--text-primary)" }}
          title="Tap to hear"
        >
          {q.char.char}
        </button>
        <div className="mt-2">
          <button onClick={() => speak(q.char.char)} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border-2"
            style={{ color: "#1cb0f6", borderColor: "rgba(28,176,246,0.3)", background: "rgba(28,176,246,0.08)" }}>
            🔊 Play audio
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, i) => {
          let bg = "var(--bg-secondary)", border = "var(--border-color)", txtColor = "var(--text-primary)", sh = "var(--border-color)";
          if (selected !== null) {
            if (i === q.correct) { bg = "rgba(88,204,2,0.1)"; border = "#ff4b8b"; txtColor = "#e0357a"; sh = "rgba(88,204,2,0.4)"; }
            else if (i === selected) { bg = "rgba(255,75,75,0.1)"; border = "#ff4b4b"; txtColor = "#d93636"; sh = "rgba(255,75,75,0.4)"; }
          }
          return (
            <button
              key={i}
              onClick={() => {
                if (selected !== null) return;
                setSelected(i);
                if (i === q.correct) { setScore((s) => s + 1); markLearned(q.char.char); speak(q.char.char); }
                setTimeout(() => { setSelected(null); setQi((n) => n + 1); }, 1100);
              }}
              className="p-4 rounded-2xl border-2 font-black text-lg transition-all"
              style={{ background: bg, borderColor: border, color: txtColor, boxShadow: `0 4px 0 ${sh}` }}
              disabled={selected !== null}
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
