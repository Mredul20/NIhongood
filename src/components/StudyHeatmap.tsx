"use client";

import { useProgressStore } from "@/store/progressStore";
import { useMemo } from "react";

const WEEKS = 26; // ~6 months
const DAYS = 7;

function getDateStr(date: Date) {
  return date.toISOString().split("T")[0];
}

function getIntensity(xp: number): 0 | 1 | 2 | 3 | 4 {
  if (xp === 0) return 0;
  if (xp < 20)  return 1;
  if (xp < 50)  return 2;
  if (xp < 100) return 3;
  return 4;
}

const INTENSITY_COLORS: Record<number, string> = {
  0: "var(--border-color)",
  1: "rgba(255,75,139,0.25)",
  2: "rgba(255,75,139,0.45)",
  3: "rgba(255,75,139,0.70)",
  4: "#ff4b8b",
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function StudyHeatmap() {
  const { dailyLogs } = useProgressStore();

  // Build a lookup map: dateStr -> xpEarned
  const logMap = useMemo(() => {
    const map: Record<string, number> = {};
    dailyLogs.forEach((l) => { map[l.date] = l.xpEarned; });
    return map;
  }, [dailyLogs]);

  // Build grid: WEEKS columns × 7 rows, starting from Sunday of (WEEKS) weeks ago
  const grid = useMemo(() => {
    const today = new Date();
    // Start from the Sunday of the week that was (WEEKS-1) weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (WEEKS * 7 - 1));
    // Rewind to the nearest Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const weeks: { date: Date; dateStr: string; xp: number; intensity: 0|1|2|3|4 }[][] = [];
    const cursor = new Date(startDate);

    for (let w = 0; w < WEEKS; w++) {
      const week: typeof weeks[0] = [];
      for (let d = 0; d < DAYS; d++) {
        const dateStr = getDateStr(cursor);
        const xp = logMap[dateStr] || 0;
        week.push({ date: new Date(cursor), dateStr, xp, intensity: getIntensity(xp) });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  }, [logMap]);

  // Month labels
  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIdx: number }[] = [];
    let lastMonth = -1;
    grid.forEach((week, wi) => {
      const month = week[0].date.getMonth();
      if (month !== lastMonth) {
        labels.push({ label: week[0].date.toLocaleDateString("en", { month: "short" }), weekIdx: wi });
        lastMonth = month;
      }
    });
    return labels;
  }, [grid]);

  const totalXPInPeriod = useMemo(() =>
    grid.flat().reduce((sum, d) => sum + d.xp, 0), [grid]);

  const activeDays = useMemo(() =>
    grid.flat().filter((d) => d.xp > 0).length, [grid]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title text-base">📅 Study Heatmap</h2>
        <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
          <span>{activeDays} active days</span>
          <span>{totalXPInPeriod} XP earned</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: "fit-content" }}>
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {grid.map((_, wi) => {
              const label = monthLabels.find((m) => m.weekIdx === wi);
              return (
                <div key={wi} style={{ width: 14, marginRight: 2, flexShrink: 0 }}>
                  {label && (
                    <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                      {label.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAY_LABELS.map((d, i) => (
                <div key={d} className="text-[10px] font-bold flex items-center" style={{ height: 14, color: i % 2 === 0 ? "transparent" : "var(--text-secondary)" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day) => (
                  <div
                    key={day.dateStr}
                    title={`${day.dateStr}: ${day.xp} XP`}
                    className="rounded-sm transition-transform hover:scale-125 cursor-default"
                    style={{
                      width: 14,
                      height: 14,
                      background: INTENSITY_COLORS[day.intensity],
                      border: day.intensity === 0 ? "1px solid var(--border-color)" : "none",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 ml-8">
            <span className="text-[10px] font-semibold" style={{ color: "var(--text-secondary)" }}>Less</span>
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="rounded-sm" style={{ width: 14, height: 14, background: INTENSITY_COLORS[i], border: i === 0 ? "1px solid var(--border-color)" : "none" }} />
            ))}
            <span className="text-[10px] font-semibold" style={{ color: "var(--text-secondary)" }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
