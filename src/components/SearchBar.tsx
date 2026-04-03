"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { VOCABULARY } from "@/data/vocabulary";
import { KANJI_N5 } from "@/data/kanji";
import { GRAMMAR_POINTS as GRAMMAR } from "@/data/grammar";

type ResultType = "vocab" | "kanji" | "grammar";

interface SearchResult {
  id: string;
  type: ResultType;
  primary: string;
  secondary: string;
  meaning: string;
  href: string;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  VOCABULARY.forEach((v) => {
    results.push({
      id: `vocab-${v.id}`,
      type: "vocab",
      primary: v.kanji,
      secondary: v.hiragana,
      meaning: v.english,
      href: "/learn/vocab",
    });
  });

  KANJI_N5.forEach((k) => {
    results.push({
      id: `kanji-${k.id}`,
      type: "kanji",
      primary: k.kanji,
      secondary: k.onyomi[0] || k.kunyomi[0] || "",
      meaning: k.meaning.join(", "),
      href: "/learn/kanji",
    });
  });

  GRAMMAR.forEach((g) => {
    results.push({
      id: `grammar-${g.id}`,
      type: "grammar",
      primary: g.titleJa,
      secondary: g.level,
      meaning: g.title,
      href: "/learn/grammar",
    });
  });

  return results;
}

const TYPE_COLORS: Record<ResultType, { bg: string; text: string; label: string }> = {
  vocab:   { bg: "rgba(206,130,255,0.12)", text: "#a560d8", label: "Vocab"   },
  kanji:   { bg: "rgba(255,150,0,0.12)",   text: "#e08000", label: "Kanji"   },
  grammar: { bg: "rgba(28,176,246,0.12)",  text: "#0a91d1", label: "Grammar" },
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [index] = useState(() => buildIndex());
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    const q = query.toLowerCase();
    const filtered = index.filter((r) =>
      r.primary.includes(query) ||
      r.secondary.toLowerCase().includes(q) ||
      r.meaning.toLowerCase().includes(q)
    ).slice(0, 8);
    setResults(filtered);
    setOpen(filtered.length > 0);
    setSelected(0);
  }, [query, index]);

  // Keyboard shortcut: Ctrl/Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") { setOpen(false); setQuery(""); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && results[selected]) {
      router.push(results[selected].href);
      setOpen(false); setQuery("");
    }
  };

  const handleSelect = (r: SearchResult) => {
    router.push(r.href);
    setOpen(false); setQuery("");
  };

  return (
    <div className="relative w-full max-w-sm">
      {/* Input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-secondary)" }}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search vocab, kanji, grammar… (⌘K)"
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm font-semibold border-2 outline-none transition-all"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-2xl border-2 overflow-hidden z-50 animate-fade-in"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
        >
          {results.map((r, i) => {
            const col = TYPE_COLORS[r.type];
            return (
              <button
                key={r.id}
                onMouseDown={() => handleSelect(r)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                style={{ background: i === selected ? "var(--bg-secondary)" : "transparent" }}
              >
                <span className="text-2xl font-japanese font-bold w-8 text-center flex-shrink-0" style={{ color: "var(--text-primary)" }}>
                  {r.primary}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: col.bg, color: col.text }}>
                      {col.label}
                    </span>
                    <span className="text-xs font-semibold truncate" style={{ color: "var(--text-secondary)" }}>{r.secondary}</span>
                  </div>
                  <p className="text-sm font-bold truncate mt-0.5" style={{ color: "var(--text-primary)" }}>{r.meaning}</p>
                </div>
              </button>
            );
          })}
          <div className="px-4 py-2 text-xs font-semibold" style={{ color: "var(--text-secondary)", borderTop: "1px solid var(--border-color)" }}>
            ↑↓ navigate · Enter to go · Esc to close
          </div>
        </div>
      )}
    </div>
  );
}
