"use client";

import { useEffect } from "react";

interface FlashcardProps {
  frontText: string;
  backText: string;
  reading: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({
  frontText,
  backText,
  reading,
  isFlipped,
  onFlip,
}: FlashcardProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        onFlip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onFlip]);

  return (
    <div className="flashcard">
      <div className={`flashcard-inner ${isFlipped ? "flipped" : ""}`}>
        {/* Front face - Japanese text */}
        <div
          className="flashcard-face min-h-80"
          onClick={onFlip}
          role="button"
          tabIndex={0}
          aria-label="Flashcard, press space to flip"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onFlip();
            }
          }}
        >
          <p className="text-6xl font-black" style={{ color: "var(--text-primary)" }}>
            {frontText}
          </p>
        </div>

        {/* Back face - English + reading */}
        <div
          className="flashcard-face flashcard-back min-h-80"
          onClick={onFlip}
          role="button"
          tabIndex={0}
          aria-label="Flashcard back, press space to flip"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onFlip();
            }
          }}
        >
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {backText}
            </p>
            <p className="text-lg font-semibold" style={{ color: "var(--text-secondary)" }}>
              {reading}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
