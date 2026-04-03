"use client";

import { useState, useEffect, useCallback } from "react";
import { HIRAGANA, KATAKANA } from "@/data/kana";
import { VOCABULARY } from "@/data/vocabulary";
import { KANJI_N5 } from "@/data/kanji";
import { speak } from "@/lib/speak";
import { useLearningStore } from "@/store/learningStore";
import { useProgressStore } from "@/store/progressStore";

type DeckType = "kana" | "vocab" | "kanji" | "all";
type CardState = "front" | "back";

interface FlashCard {
  id: string;
  front: string;
  frontSub?: string;
  back: string;
  backSub?: string;
  audio: string;       // text to speak (Japanese)
  audioBack?: string;  // text to speak on back
  type: DeckType;
  emoji?: string;
}

function buildDeck(type: DeckType): FlashCard[] {
  const kanaCards: FlashCard[] = [...HIRAGANA, ...KATAKANA].map((k) => ({
    id: `kana-${k.char}`,
    front: k.char,
    frontSub: k.type === "hiragana" ? "Hiragana" : "Katakana",
    back: k.romaji,
    backSub: k.type === "hiragana" ? "ひらがな" : "カタカナ",
    audio: k.char,
    type: "kana" as DeckType,
    emoji: "あ",
  }));

  const vocabCards: FlashCard[] = VOCABULARY.map((v) => ({
    id: `vocab-${v.id}`,
    front: v.kanji,
    frontSub: v.hiragana !== v.kanji ? v.hiragana : undefined,
    back: v.english,
    backSub: v.partOfSpeech,
    // Use hiragana for TTS — it's always pronounced correctly by the speech engine.
    // Kanji alone can be misread (e.g. 二 read as "ichi"). Strip any "/" alternatives
    // (e.g. "いい/よい") and use only the first reading.
    audio: v.hiragana.split("/")[0],
    audioBack: v.english,
    type: "vocab" as DeckType,
    emoji: "📖",
  }));

  const kanjiCards: FlashCard[] = KANJI_N5.map((k) => ({
    id: `kanji-${k.id}`,
    front: k.kanji,
    frontSub: `${k.strokes} strokes`,
    back: k.meaning.join(", "),
    backSub: [k.onyomi[0], k.kunyomi[0]].filter(Boolean).join(" · "),
    audio: k.kanji,
    audioBack: k.meaning[0],
    type: "kanji" as DeckType,
    emoji: "漢",
  }));

  if (type === "kana") return kanaCards;
  if (type === "vocab") return vocabCards;
  if (type === "kanji") return kanjiCards;
  return [...kanaCards, ...vocabCards, ...kanjiCards];
}

const DECK_OPTIONS = [
  { id: "kana" as DeckType,  label: "Kana",      emoji: "あ",  color: "#1cb0f6", shadow: "#0a91d1", count: HIRAGANA.length + KATAKANA.length },
  { id: "vocab" as DeckType, label: "Vocabulary", emoji: "📖", color: "#ce82ff", shadow: "#a560d8", count: VOCABULARY.length },
  { id: "kanji" as DeckType, label: "Kanji",      emoji: "漢", color: "#ff9600", shadow: "#e08000", count: KANJI_N5.length },
  { id: "all" as DeckType,   label: "All Cards",  emoji: "🌟", color: "#ff4b8b", shadow: "#e0357a", count: HIRAGANA.length + KATAKANA.length + VOCABULARY.length + KANJI_N5.length },
];

export default function FlashcardsPage() {
  const [mounted, setMounted] = useState(false);
  const [deckType, setDeckType] = useState<DeckType | null>(null);
  const [deck, setDeck] = useState<FlashCard[]>([]);
  const [index, setIndex] = useState(0);
  const [cardState, setCardState] = useState<CardState>("front");
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [unknown, setUnknown] = useState<Set<string>>(new Set());
  const [isFlipping, setIsFlipping] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const learning = useLearningStore();
  const progress = useProgressStore();

  useEffect(() => { setMounted(true); }, []);

  // Auto-play audio on card reveal
  useEffect(() => {
    if (!autoPlay || !deck[index]) return;
    const card = deck[index];
    if (cardState === "front") speak(card.audio);
    else if (card.audioBack) speak(card.audioBack, "en-US");
  }, [index, cardState, autoPlay, deck]);

  const startDeck = (type: DeckType) => {
    const cards = buildDeck(type).sort(() => Math.random() - 0.5);
    setDeck(cards);
    setDeckType(type);
    setIndex(0);
    setCardState("front");
    setKnown(new Set());
    setUnknown(new Set());
    setSessionDone(false);
  };

  const flip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    const card = deck[index];
    if (cardState === "front") {
      speak(card.audio);
    }
    setTimeout(() => {
      setCardState((s) => s === "front" ? "back" : "front");
      setIsFlipping(false);
    }, 150);
  };

  const rate = useCallback((knew: boolean) => {
    const card = deck[index];
    if (knew) {
      setKnown((s) => new Set([...s, card.id]));
      progress.addXP(2);
    } else {
      setUnknown((s) => new Set([...s, card.id]));
    }
    setCardState("front");
    if (index + 1 >= deck.length) {
      setSessionDone(true);
      progress.recordStudySession(5);
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, deck, progress]);

  if (!mounted) return null;

  // ── Deck selection screen ──
  if (!deckType) {
    return (
      <div className="space-y-6 animate-fade-in pb-8">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#ff4b8b" }}>Flashcards</p>
          <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>Choose a Deck</h1>
          <p className="text-sm font-semibold mt-1" style={{ color: "var(--text-secondary)" }}>
            Flip cards, rate yourself, and master Japanese faster
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {DECK_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => startDeck(opt.id)}
              className="duo-card-hover p-6 flex items-center gap-4 text-left"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
                style={{ background: `${opt.color}18`, color: opt.color, boxShadow: `0 4px 0 ${opt.shadow}40` }}
              >
                {opt.emoji}
              </div>
              <div>
                <p className="text-lg font-black" style={{ color: "var(--text-primary)" }}>{opt.label}</p>
                <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{opt.count} cards</p>
              </div>
              <div className="ml-auto text-2xl" style={{ color: opt.color }}>→</div>
            </button>
          ))}
        </div>

        {/* Tips */}
        <div className="duo-card p-5">
          <h2 className="section-title mb-3">💡 How to use flashcards</h2>
          <div className="space-y-2">
            {[
              ["👆", "Tap the card to flip it and reveal the answer"],
              ["🔊", "Audio plays automatically — hear the pronunciation"],
              ["✅", "Mark \"Got it!\" when you know it, \"Again\" when you don't"],
              ["🔁", "Unknown cards come back in the same session"],
            ].map(([emoji, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-xl">{emoji}</span>
                <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Session complete screen ──
  if (sessionDone) {
    const total = deck.length;
    const knownCount = known.size;
    const pct = Math.round((knownCount / total) * 100);
    return (
      <div className="max-w-md mx-auto animate-scale-in pb-8">
        <div className="duo-card p-8 text-center">
          <div className="text-6xl mb-3">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Session Complete!</h2>
          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="p-4 rounded-2xl border-2" style={{ background: "rgba(88,204,2,0.08)", borderColor: "rgba(88,204,2,0.3)" }}>
              <p className="text-3xl font-black" style={{ color: "#ff4b8b" }}>{knownCount}</p>
              <p className="text-xs font-black uppercase tracking-wide mt-1" style={{ color: "#e0357a" }}>Got it ✅</p>
            </div>
            <div className="p-4 rounded-2xl border-2" style={{ background: "rgba(255,75,75,0.08)", borderColor: "rgba(255,75,75,0.3)" }}>
              <p className="text-3xl font-black" style={{ color: "#ff4b4b" }}>{unknown.size}</p>
              <p className="text-xs font-black uppercase tracking-wide mt-1" style={{ color: "#d93636" }}>Review Again 🔁</p>
            </div>
          </div>
          <p className="font-bold mb-6" style={{ color: "var(--text-secondary)" }}>
            {pct >= 80 ? "Amazing! You're crushing it!" : pct >= 50 ? "Good progress! Keep going!" : "Practice makes perfect!"}
          </p>
          <div className="flex gap-3 justify-center">
            {unknown.size > 0 && (
              <button
                onClick={() => {
                  const retry = deck.filter((c) => unknown.has(c.id)).sort(() => Math.random() - 0.5);
                  setDeck(retry);
                  setIndex(0);
                  setCardState("front");
                  setKnown(new Set());
                  setUnknown(new Set());
                  setSessionDone(false);
                }}
                className="btn-primary"
              >
                🔁 Review Missed
              </button>
            )}
            <button onClick={() => startDeck(deckType)} className="btn-secondary">New Session</button>
            <button onClick={() => setDeckType(null)} className="btn-secondary">← Decks</button>
          </div>
        </div>
      </div>
    );
  }

  const card = deck[index];
  const deckOpt = DECK_OPTIONS.find((d) => d.id === deckType)!;

  return (
    <div className="max-w-lg mx-auto space-y-5 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setDeckType(null)} className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>← Decks</button>
        <p className="text-sm font-black" style={{ color: deckOpt.color }}>{deckOpt.emoji} {deckOpt.label}</p>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>🔊 Auto</span>
          <div
            onClick={() => setAutoPlay((a) => !a)}
            className="w-10 h-6 rounded-full relative transition-all cursor-pointer"
            style={{ background: autoPlay ? "#ff4b8b" : "var(--border-color)" }}
          >
            <div
              className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all"
              style={{ left: autoPlay ? "22px" : "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
            />
          </div>
        </label>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>
          <span>{index + 1} / {deck.length}</span>
          <span>✅ {known.size} &nbsp; 🔁 {unknown.size}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${((index + 1) / deck.length) * 100}%`, background: `linear-gradient(90deg, ${deckOpt.color}, ${deckOpt.color}bb)` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flashcard" style={{ minHeight: "260px" }}>
        <div
          onClick={flip}
          className="w-full min-h-[260px] rounded-2xl border-2 p-8 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer relative"
          style={{
            background: "var(--bg-card)",
            borderColor: cardState === "back" ? deckOpt.color : "var(--border-color)",
            boxShadow: cardState === "back" ? `0 6px 0 ${deckOpt.shadow}60` : "0 6px 0 var(--border-color)",
            opacity: isFlipping ? 0 : 1,
            transform: isFlipping ? "scale(0.97)" : "scale(1)",
            transition: "opacity 0.15s, transform 0.15s, border-color 0.2s, box-shadow 0.2s",
          }}
        >
          {/* Card type label */}
          <span
            className="absolute top-4 left-4 text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: `${deckOpt.color}18`, color: deckOpt.color }}
          >
            {cardState === "front" ? "?" : "✓"}
          </span>

          {/* Audio button */}
          <span
            onClick={(e) => { e.stopPropagation(); speak(cardState === "front" ? card.audio : (card.audioBack || card.audio), cardState === "back" && card.audioBack ? "en-US" : "ja-JP"); }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all hover:scale-110 cursor-pointer"
            style={{ background: `${deckOpt.color}15`, borderColor: `${deckOpt.color}40`, color: deckOpt.color }}
          >
            🔊
          </span>

          {cardState === "front" ? (
            <>
              <p className="text-7xl font-japanese font-black mb-3" style={{ color: "var(--text-primary)" }}>{card.front}</p>
              {card.frontSub && <p className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>{card.frontSub}</p>}
              <p className="text-xs font-semibold mt-4 opacity-60" style={{ color: "var(--text-secondary)" }}>Tap to reveal →</p>
            </>
          ) : (
            <>
              <p className="text-4xl font-black mb-2" style={{ color: deckOpt.color }}>{card.back}</p>
              {card.backSub && <p className="text-base font-bold" style={{ color: "var(--text-secondary)" }}>{card.backSub}</p>}
              <p className="text-3xl font-japanese mt-3" style={{ color: "var(--text-primary)", opacity: 0.5 }}>{card.front}</p>
            </>
          )}
        </div>
      </div>

      {/* Rating buttons — only show after flip */}
      {cardState === "back" ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => rate(false)}
            className="py-4 rounded-2xl border-2 font-black text-base uppercase tracking-wide transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
            style={{ background: "rgba(255,75,75,0.1)", borderColor: "#ff4b4b", color: "#d93636", boxShadow: "0 4px 0 rgba(255,75,75,0.3)" }}
          >
            🔁 Again
          </button>
          <button
            onClick={() => rate(true)}
            className="py-4 rounded-2xl border-2 font-black text-base uppercase tracking-wide transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
            style={{ background: "rgba(88,204,2,0.1)", borderColor: "#ff4b8b", color: "#e0357a", boxShadow: "0 4px 0 rgba(88,204,2,0.3)" }}
          >
            ✅ Got it!
          </button>
        </div>
      ) : (
        <button
          onClick={flip}
          className="btn-primary w-full py-4 text-base"
        >
          👁️ Reveal Answer
        </button>
      )}

      {/* Skip */}
      <button
        onClick={() => {
          if (index + 1 >= deck.length) {
            setSessionDone(true);
          } else {
            setCardState("front");
            setIndex((i) => i + 1);
          }
        }}
        className="w-full text-sm font-bold py-2"
        style={{ color: "var(--text-secondary)" }}
      >
        Skip →
      </button>
    </div>
  );
}
