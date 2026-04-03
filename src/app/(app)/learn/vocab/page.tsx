"use client";

import { useState, useEffect } from "react";
import { VOCABULARY, VOCAB_CATEGORIES, VocabWord } from "@/data/vocabulary";
import { useLearningStore } from "@/store/learningStore";
import { useProgressStore } from "@/store/progressStore";
import { useSRSStore } from "@/store/srsStore";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";
import { speak } from "@/lib/speak";

export default function VocabPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const learning = useLearningStore();
  const progress = useProgressStore();
  const srs = useSRSStore();
  const { uiPreferences } = useUserPreferencesStore();
  const showFurigana = uiPreferences.showFurigana;

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="animate-pulse duo-card h-96" />;

  const filteredWords = VOCABULARY.filter((w) => {
    const matchesCategory = selectedCategory === "all" || w.category === selectedCategory;
    const matchesSearch = searchQuery === "" ||
      w.kanji.includes(searchQuery) ||
      w.hiragana.includes(searchQuery) ||
      w.english.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const learnedCount = Object.keys(learning.learnedVocab).length;
  const masteryPct = Math.round((learnedCount / VOCABULARY.length) * 100);

  if (quizMode) {
    return (
      <VocabQuiz
        words={filteredWords.length >= 4 ? filteredWords : VOCABULARY}
        onComplete={(score, total) => { progress.addXP(score * 10); progress.recordStudySession(3); progress.recordLessonComplete(); setQuizMode(false); }}
        markLearned={(id) => learning.markVocabLearned(id)}
        onExit={() => setQuizMode(false)}
      />
    );
  }

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#ce82ff" }}>語彙</p>
          <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>Vocabulary</h1>
          <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--text-secondary)" }}>
            N5 words — {learnedCount}/{VOCABULARY.length} learned
          </p>
        </div>
        <button onClick={() => setQuizMode(true)} className="btn-primary w-fit" id="start-vocab-quiz">🧠 Start Quiz</button>
      </div>

      {/* Progress bar */}
      <div className="duo-card p-4 flex items-center gap-4">
        <span className="text-3xl">📖</span>
        <div className="flex-1">
          <div className="flex justify-between mb-1.5">
            <span className="text-sm font-black" style={{ color: "var(--text-primary)" }}>Vocabulary Progress</span>
            <span className="text-sm font-black" style={{ color: "#ce82ff" }}>{masteryPct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${masteryPct}%`, background: "linear-gradient(90deg,#ce82ff,#a560d8)" }} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-black" style={{ color: "#ce82ff" }}>{learnedCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>Learned</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍  Search words in Japanese or English..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input-field"
        id="vocab-search"
      />

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className="px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all"
          style={selectedCategory === "all"
            ? { background: "rgba(206,130,255,0.12)", borderColor: "rgba(206,130,255,0.4)", color: "#ce82ff", boxShadow: "0 3px 0 rgba(165,96,216,0.3)" }
            : { background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)", boxShadow: "0 3px 0 var(--border-color)" }}
        >
          All ({VOCABULARY.length})
        </button>
        {VOCAB_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all"
            style={selectedCategory === cat.id
              ? { background: "rgba(206,130,255,0.12)", borderColor: "rgba(206,130,255,0.4)", color: "#ce82ff", boxShadow: "0 3px 0 rgba(165,96,216,0.3)" }
              : { background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)", boxShadow: "0 3px 0 var(--border-color)" }}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Word Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredWords.map((word) => {
          const isLearned = !!learning.learnedVocab[word.id];
          return (
            <div
              key={word.id}
              onClick={() => setSelectedWord(word)}
              className="p-4 rounded-2xl border-2 text-left transition-all hover:translate-y-[-2px] active:translate-y-[1px] cursor-pointer"
              style={{
                background: isLearned ? "rgba(88,204,2,0.06)" : "var(--bg-card)",
                borderColor: isLearned ? "rgba(88,204,2,0.35)" : "var(--border-color)",
                boxShadow: isLearned ? "0 4px 0 rgba(88,204,2,0.25)" : "0 4px 0 var(--border-color)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  {/* Furigana above kanji */}
                  {showFurigana && word.hiragana !== word.kanji ? (
                    <ruby className="text-2xl font-japanese font-bold" style={{ color: isLearned ? "#e0357a" : "var(--text-primary)" }}>
                      {word.kanji}
                      <rt className="text-xs font-normal" style={{ color: "#ce82ff" }}>{word.hiragana}</rt>
                    </ruby>
                  ) : (
                    <p className="text-2xl font-japanese font-bold" style={{ color: isLearned ? "#e0357a" : "var(--text-primary)" }}>
                      {word.kanji}
                    </p>
                  )}
                  {!showFurigana && (
                    <p className="text-sm font-japanese font-semibold" style={{ color: "#ce82ff" }}>{word.hiragana}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(word.hiragana.split("/")[0]); }}
                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm hover:scale-110 transition-transform"
                    style={{ borderColor: "rgba(28,176,246,0.3)", background: "rgba(28,176,246,0.08)", color: "#1cb0f6" }}
                    title="Hear pronunciation"
                  >
                    🔊
                  </button>
                  {isLearned && <span className="text-sm">✅</span>}
                </div>
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{word.english}</p>
              <p className="text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block"
                style={{ background: "rgba(206,130,255,0.1)", color: "#a560d8" }}>
                {word.partOfSpeech}
              </p>
            </div>
          );
        })}
      </div>

      {/* Word Detail Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setSelectedWord(null)}>
          <div
            className="w-full max-w-md rounded-2xl p-6 border-2 animate-scale-in"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", boxShadow: "0 8px 0 var(--border-color)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Word display */}
            <div className="text-center mb-5">
              <button
                onClick={() => speak(selectedWord.hiragana.split("/")[0])}
                className="text-5xl font-japanese font-bold hover:scale-110 transition-transform cursor-pointer block mx-auto mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {selectedWord.kanji}
              </button>
              <p className="text-lg font-japanese font-semibold mb-1" style={{ color: "#ce82ff" }}>{selectedWord.hiragana}</p>
              <p className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{selectedWord.english}</p>
              <span className="inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "rgba(206,130,255,0.12)", color: "#a560d8" }}>
                {selectedWord.partOfSpeech}
              </span>
            </div>

            {/* Audio buttons */}
            <div className="flex justify-center gap-3 mb-5">
              <button
                onClick={() => speak(selectedWord.hiragana.split("/")[0])}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all hover:translate-y-[-1px]"
                style={{ background: "rgba(28,176,246,0.08)", borderColor: "rgba(28,176,246,0.3)", color: "#1cb0f6", boxShadow: "0 3px 0 rgba(28,176,246,0.2)" }}
              >
                🔊 Hear Japanese
              </button>
              <button
                onClick={() => speak(selectedWord.english, "en-US")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all hover:translate-y-[-1px]"
                style={{ background: "rgba(88,204,2,0.08)", borderColor: "rgba(88,204,2,0.3)", color: "#e0357a", boxShadow: "0 3px 0 rgba(88,204,2,0.2)" }}
              >
                🔊 Hear English
              </button>
            </div>

            {/* Example */}
            <div className="p-4 rounded-xl border-2 mb-5"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>Example Sentence</p>
              <button
                onClick={() => speak(selectedWord.example.ja)}
                className="text-base font-japanese font-semibold block text-left hover:opacity-75 transition-opacity w-full"
                style={{ color: "var(--text-primary)" }}
              >
                {selectedWord.example.ja} 🔊
              </button>
              <p className="text-sm font-semibold mt-1" style={{ color: "var(--text-secondary)" }}>{selectedWord.example.en}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  learning.markVocabLearned(selectedWord.id);
                  if (!srs.hasCard(`vocab-${selectedWord.id}`)) {
                    srs.addCard({ id: `vocab-${selectedWord.id}`, front: selectedWord.kanji, back: selectedWord.english, reading: selectedWord.hiragana, type: "vocab" });
                  }
                  progress.addXP(5);
                  setSelectedWord(null);
                }}
                className={`flex-1 font-black py-3 rounded-xl border-2 text-sm uppercase tracking-wide transition-all ${learning.learnedVocab[selectedWord.id] ? "" : "btn-primary"}`}
                style={learning.learnedVocab[selectedWord.id]
                  ? { background: "rgba(88,204,2,0.1)", borderColor: "rgba(88,204,2,0.4)", color: "#e0357a", boxShadow: "0 3px 0 rgba(88,204,2,0.3)" }
                  : {}}
              >
                {learning.learnedVocab[selectedWord.id] ? "✅ Learned!" : "📚 Learn + Add to SRS"}
              </button>
              <button onClick={() => setSelectedWord(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VocabQuiz({ words, onComplete, markLearned, onExit }: {
  words: VocabWord[];
  onComplete: (score: number, total: number) => void;
  markLearned: (id: string) => void;
  onExit: () => void;
}) {
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [questions, setQuestions] = useState<{ word: VocabWord; options: string[]; correct: number }[]>([]);

  useEffect(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 10);
    const qs = shuffled.map((word) => {
      const wrong = words.filter((w) => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3).map((w) => w.english);
      const options = [...wrong, word.english].sort(() => Math.random() - 0.5);
      return { word, options, correct: options.indexOf(word.english) };
    });
    setQuestions(qs);
  }, []);

  if (questions.length === 0) return null;

  if (qi >= questions.length) {
    const pct = Math.round((score / questions.length) * 100);
    onComplete(score, questions.length);
    return (
      <div className="duo-card p-8 text-center max-w-lg mx-auto animate-scale-in">
        <div className="text-6xl mb-3">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
        <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Quiz Complete!</h2>
        <p className="text-5xl font-black my-4" style={{ color: pct >= 80 ? "#ff4b8b" : pct >= 50 ? "#ff9600" : "#ff4b4b" }}>
          {score}/{questions.length}
        </p>
        <button onClick={onExit} className="btn-primary">Back to Vocabulary</button>
      </div>
    );
  }

  const q = questions[qi];
  return (
    <div className="max-w-lg mx-auto space-y-5 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>📖 Vocab Quiz</h1>
        <button onClick={onExit} className="btn-secondary text-sm">Exit</button>
      </div>

      <div className="flex justify-between text-sm font-bold mb-1" style={{ color: "var(--text-secondary)" }}>
        <span>{qi + 1}/{questions.length}</span>
        <span style={{ color: "#ce82ff" }}>⭐ {score}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${((qi + 1) / questions.length) * 100}%`, background: "linear-gradient(90deg,#ce82ff,#a560d8)" }} />
      </div>

      <div className="duo-card p-8 text-center">
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "var(--text-secondary)" }}>What does this mean?</p>
        <button
          onClick={() => speak(q.word.hiragana.split("/")[0])}
          className="text-6xl font-japanese font-bold hover:scale-110 transition-transform cursor-pointer block mx-auto"
          style={{ color: "var(--text-primary)" }}
        >
          {q.word.kanji}
        </button>
        <p className="text-lg font-japanese font-semibold mt-2" style={{ color: "#ce82ff" }}>{q.word.hiragana}</p>
        <button onClick={() => speak(q.word.hiragana.split("/")[0])} className="mt-3 text-sm font-bold" style={{ color: "#1cb0f6" }}>🔊 Play audio</button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {q.options.map((opt, i) => {
          let bg = "var(--bg-card)", border = "var(--border-color)", color = "var(--text-primary)", sh = "var(--border-color)";
          if (selected !== null) {
            if (i === q.correct) { bg = "rgba(88,204,2,0.1)"; border = "#ff4b8b"; color = "#e0357a"; sh = "rgba(88,204,2,0.4)"; }
            else if (i === selected) { bg = "rgba(255,75,75,0.1)"; border = "#ff4b4b"; color = "#d93636"; sh = "rgba(255,75,75,0.4)"; }
          }
          return (
            <button
              key={i}
              onClick={() => {
                if (selected !== null) return;
                setSelected(i);
                if (i === q.correct) { setScore((s) => s + 1); markLearned(q.word.id); speak(q.word.hiragana.split("/")[0]); }
                setTimeout(() => { setSelected(null); setQi((n) => n + 1); }, 1100);
              }}
              className="p-4 rounded-2xl border-2 font-bold text-base text-left transition-all"
              style={{ background: bg, borderColor: border, color, boxShadow: `0 4px 0 ${sh}` }}
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
