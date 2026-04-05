"use client";

import { useEffect } from "react";
import { getIntervalPreview } from "@/lib/srs";

interface AnswerButtonsProps {
  onAnswer: (quality: 0 | 1 | 2 | 3) => void;
  disabled?: boolean;
  currentProgress?: {
    ease_factor: number;
    interval: number;
    repetitions: number;
  };
}

export default function AnswerButtons({
  onAnswer,
  disabled = false,
  currentProgress,
}: AnswerButtonsProps) {
  // Calculate interval previews based on current progress
  let againInterval = "< 10m";
  let hardInterval = "1 day";
  let goodInterval = "3 days";
  let easyInterval = "7 days";

  if (currentProgress) {
    againInterval = getIntervalPreview(0, currentProgress);
    hardInterval = getIntervalPreview(1, currentProgress);
    goodInterval = getIntervalPreview(2, currentProgress);
    easyInterval = getIntervalPreview(3, currentProgress);
  }

  // Keyboard event listener
  useEffect(() => {
    if (disabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent if typing in input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case "1":
          event.preventDefault();
          onAnswer(0);
          break;
        case "2":
          event.preventDefault();
          onAnswer(1);
          break;
        case "3":
          event.preventDefault();
          onAnswer(2);
          break;
        case "4":
          event.preventDefault();
          onAnswer(3);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [disabled, onAnswer]);

  const buttons = [
    {
      label: "Again",
      quality: 0 as const,
      keyboard: "1",
      interval: againInterval,
      bgColor: "#dc2626",
    },
    {
      label: "Hard",
      quality: 1 as const,
      keyboard: "2",
      interval: hardInterval,
      bgColor: "#f59e0b",
    },
    {
      label: "Good",
      quality: 2 as const,
      keyboard: "3",
      interval: goodInterval,
      bgColor: "#16a34a",
    },
    {
      label: "Easy",
      quality: 3 as const,
      keyboard: "4",
      interval: easyInterval,
      bgColor: "#1cb0f6",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl">
      {buttons.map((button) => (
        <button
          key={button.quality}
          onClick={() => onAnswer(button.quality)}
          disabled={disabled}
          className="duo-button flex flex-col items-center justify-center py-4 px-6 min-h-[100px] transition-all"
          style={{
            backgroundColor: disabled
              ? "rgba(200, 200, 200, 0.5)"
              : button.bgColor,
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          aria-label={`Rate as ${button.label} - Next review in ${button.interval} - Press ${button.keyboard}`}
        >
          <span className="font-bold text-lg text-white">{button.label}</span>
          <span className="text-sm opacity-75 text-white">
            Press {button.keyboard}
          </span>
          <span className="text-xs font-semibold text-white mt-1">
            {button.interval}
          </span>
        </button>
      ))}
    </div>
  );
}
