"use client";

import { useState, useEffect } from "react";
import { VOCABULARY, VOCAB_CATEGORIES, VocabWord } from "@/data/vocabulary";
import { useLearningStore } from "@/store/learningStore";
import { useProgressStore } from "@/store/progressStore";
import { useSRSStore } from "@/store/srsStore";

export default function VocabPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWord, setSelectedWord] = useState<VocabWord | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const learning = useLearningStore();
  const progress = useProgressStore();
  const srs = useSRSStore();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="animate-pulse glass-card h-96" />;

  const filteredWords = VOCABULARY.filter((w) => {
    const matchesCategory = selectedCategory === "all" || w.category === selectedCategory;
    const matchesSearch = searchQuery === "" ||
      w.kanji.includes(searchQuery) ||
      w.hiragana.includes(searchQuery) ||
      w.english.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const learnedCount = Object.keys(learning.learnedVocab).length;

  if (quizMode) {
    return (
      <VocabQuiz
        words={filteredWords.length >= 4 ? filteredWords : VOCABULARY}
        onComplete={(score, total) => {
          progress.addXP(score * 10);
          progress.recordStudySession(3);
          progress.recordLessonComplete();
        }}
        markLearned={(id) => learning.markVocabLearned(id)}
        onExit={() => setQuizMode(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <span>📖</span> Vocabulary
          </h1>
          <p className="text-slate-400 mt-1">N5 vocabulary — {learnedCount}/{VOCABULARY.length} learned</p>
        </div>
        <button onClick={() => setQuizMode(true)} className="btn-primary text-sm w-fit" id="start-vocab-quiz">
          🧠 Start Quiz
        </button>
      </div>

      {/* Search + Filter */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search words..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field flex-1"
          id="vocab-search"
        />
        <div className="progress-bar flex-1 self-center hidden sm:block">
          <div className="progress-bar-fill bg-teal-400" style={{ width: `${(learnedCount / VOCABULARY.length) * 100}%` }} />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedCategory === "all" ? "bg-sakura-500/20 text-sakura-400 border border-sakura-500/20" : "bg-navy-800/40 text-slate-400 border border-white/5 hover:border-white/10"
          }`}
        >
          All ({VOCABULARY.length})
        </button>
        {VOCAB_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === cat.id ? "bg-sakura-500/20 text-sakura-400 border border-sakura-500/20" : "bg-navy-800/40 text-slate-400 border border-white/5 hover:border-white/10"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Word Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredWords.map((word) => {
          const isLearned = learning.learnedVocab[word.id];
          const inSRS = srs.hasCard(`vocab-${word.id}`);
          return (
            <button
              key={word.id}
              onClick={() => setSelectedWord(word)}
              className={`glass-card-hover p-4 text-left ${isLearned ? "border-teal-500/20" : ""}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xl font-japanese font-bold text-slate-100">{word.kanji}</p>
                  <p className="text-sm text-sakura-400 font-japanese">{word.hiragana}</p>
                </div>
                <div className="flex gap-1">
                  {isLearned && <span className="text-xs">✅</span>}
                  {inSRS && <span className="text-xs">🔄</span>}
                </div>
              </div>
              <p className="text-sm text-slate-300">{word.english}</p>
              <p className="text-xs text-slate-500 mt-1">{word.partOfSpeech}</p>
            </button>
          );
        })}
      </div>

      {/* Word Detail Modal */}
      {selectedWord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedWord(null)}>
          <div className="glass-card p-8 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <p className="text-5xl font-japanese font-bold mb-2">{selectedWord.kanji}</p>
              <p className="text-xl text-sakura-400 font-japanese">{selectedWord.hiragana}</p>
              <p className="text-lg text-slate-200 mt-2">{selectedWord.english}</p>
              <span className="badge-teal mt-2 inline-block">{selectedWord.partOfSpeech}</span>
            </div>

            <div className="bg-navy-800/40 rounded-xl p-4 mb-6">
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Example</p>
              <p className="text-lg font-japanese text-slate-200">{selectedWord.example.ja}</p>
              <p className="text-sm text-slate-400 mt-1">{selectedWord.example.en}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  learning.markVocabLearned(selectedWord.id);
                  if (!srs.hasCard(`vocab-${selectedWord.id}`)) {
                    srs.addCard({
                      id: `vocab-${selectedWord.id}`,
                      front: selectedWord.kanji,
                      back: selectedWord.english,
                      reading: selectedWord.hiragana,
                      type: "vocab",
                    });
                  }
                  progress.addXP(5);
                  setSelectedWord(null);
                }}
                className={learning.learnedVocab[selectedWord.id] ? "btn-success flex-1 text-sm" : "btn-primary flex-1 text-sm"}
              >
                {learning.learnedVocab[selectedWord.id] ? "✅ Learned" : "📚 Learn & Add to SRS"}
              </button>
              <button onClick={() => setSelectedWord(null)} className="btn-secondary text-sm">
                Close
              </button>
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
    onComplete(score, questions.length);
    return (
      <div className="glass-card p-8 text-center max-w-lg mx-auto animate-scale-in">
        <div className="text-6xl mb-4">{score >= 8 ? "🎉" : score >= 5 ? "👍" : "💪"}</div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Quiz Complete!</h2>
        <p className="text-4xl font-bold text-gradient-sakura mb-6">{score}/{questions.length}</p>
        <button onClick={onExit} className="btn-primary">Back to Vocabulary</button>
      </div>
    );
  }

  const q = questions[qi];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">📖 Vocabulary Quiz</h1>
        <button onClick={onExit} className="btn-secondary text-sm">Exit Quiz</button>
      </div>
      <div className="glass-card p-8 max-w-lg mx-auto">
        <div className="flex justify-between mb-4 text-sm text-slate-400">
          <span>Question {qi + 1}/{questions.length}</span>
          <span className="text-teal-400">Score: {score}</span>
        </div>
        <div className="progress-bar mb-8">
          <div className="progress-bar-fill bg-teal-400" style={{ width: `${((qi + 1) / questions.length) * 100}%` }} />
        </div>
        <div className="text-center mb-8">
          <p className="text-sm text-slate-400 mb-3">What does this word mean?</p>
          <p className="text-5xl font-japanese font-bold">{q.word.kanji}</p>
          <p className="text-lg text-sakura-400 font-japanese mt-2">{q.word.hiragana}</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
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
                    markLearned(q.word.id);
                  }
                  setTimeout(() => { setSelected(null); setQi((q) => q + 1); }, 1000);
                }}
                className={`p-4 rounded-xl border text-left font-medium transition-all ${style}`}
                disabled={selected !== null}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
