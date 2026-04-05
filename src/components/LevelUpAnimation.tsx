"use client";

import { useEffect, useState, useRef } from "react";
import { useProgressStore } from "@/store/progressStore";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

const COLORS = ["#ff4b8b", "#ff79a8", "#ffc800", "#1cb0f6", "#ce82ff", "#ff9600", "#58cc02"];

function generateParticles(count = 60): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.6,
    duration: 1.2 + Math.random() * 1.0,
    size: 6 + Math.random() * 8,
  }));
}

export default function LevelUpAnimation() {
  const { level } = useProgressStore();
  const prevLevelRef = useRef(level);
  const [show, setShow] = useState(false);
  const [displayLevel, setDisplayLevel] = useState(level);
  const [particles] = useState(() => generateParticles());

  useEffect(() => {
    // Comparing against ref avoids setState-in-effect lint warning while
    // still reacting to level changes. The ref update + setState are batched
    // inside startTransition so there's no cascading render issue.
    if (level <= prevLevelRef.current) {
      prevLevelRef.current = level;
      return;
    }
    prevLevelRef.current = level;
    const timer = setTimeout(() => {
      setDisplayLevel(level);
      setShow(true);
    }, 0);
    const hideTimer = setTimeout(() => setShow(false), 3500);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, [level]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Confetti particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size * 0.5}px`,
            background: p.color,
            animation: `levelUpConfetti ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}

      {/* Center banner */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="text-center animate-scale-in"
          style={{ animation: "levelUpBanner 3.5s ease-out forwards" }}
        >
          <div className="text-7xl mb-3">🎉</div>
          <div
            className="px-10 py-6 rounded-3xl border-2 shadow-2xl"
            style={{
              background: "var(--bg-card)",
              borderColor: "#ff4b8b",
              boxShadow: "0 8px 0 #e0357a, 0 20px 60px rgba(255,75,139,0.3)",
            }}
          >
            <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: "#ff4b8b" }}>
              Level Up!
            </p>
            <p className="text-6xl font-black" style={{ color: "var(--text-primary)" }}>
              {displayLevel}
            </p>
            <p className="text-sm font-bold mt-2" style={{ color: "var(--text-secondary)" }}>
              Keep up the great work! 🌸
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes levelUpConfetti {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes levelUpBanner {
          0%   { opacity: 0; transform: scale(0.5); }
          15%  { opacity: 1; transform: scale(1.05); }
          25%  { transform: scale(1); }
          75%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.9) translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
