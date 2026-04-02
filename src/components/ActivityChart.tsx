"use client";

import { useState } from "react";

interface DailyData {
  date: string;
  xpEarned: number;
  reviewsDone: number;
  timeSpent: number;
  lessonsCompleted: number;
}

type ChartMetric = "xp" | "reviews" | "time";

interface ActivityChartProps {
  data: DailyData[];
  className?: string;
}

const METRICS: { key: ChartMetric; label: string; icon: string; color: string; unit: string }[] = [
  { key: "xp", label: "XP Earned", icon: "💎", color: "sakura", unit: "XP" },
  { key: "reviews", label: "Reviews", icon: "🔄", color: "teal", unit: "" },
  { key: "time", label: "Study Time", icon: "⏱️", color: "gold", unit: "min" },
];

export function ActivityChart({ data, className = "" }: ActivityChartProps) {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>("xp");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getValue = (day: DailyData, metric: ChartMetric): number => {
    switch (metric) {
      case "xp": return day.xpEarned;
      case "reviews": return day.reviewsDone;
      case "time": return day.timeSpent;
    }
  };

  const values = data.map((d) => getValue(d, activeMetric));
  const maxValue = Math.max(...values, 1);
  const totalValue = values.reduce((a, b) => a + b, 0);
  const avgValue = Math.round(totalValue / data.length);

  const currentMetric = METRICS.find((m) => m.key === activeMetric)!;

  const getBarColor = (isToday: boolean, hasValue: boolean) => {
    if (!hasValue) return "bg-navy-800/50";
    
    const colors = {
      sakura: isToday 
        ? "bg-gradient-to-t from-sakura-600 via-sakura-500 to-sakura-400" 
        : "bg-gradient-to-t from-sakura-600/60 to-sakura-500/60",
      teal: isToday 
        ? "bg-gradient-to-t from-teal-600 via-teal-500 to-teal-400" 
        : "bg-gradient-to-t from-teal-600/60 to-teal-500/60",
      gold: isToday 
        ? "bg-gradient-to-t from-gold-600 via-gold-500 to-gold-400" 
        : "bg-gradient-to-t from-gold-600/60 to-gold-500/60",
    };
    
    return colors[currentMetric.color as keyof typeof colors];
  };

  return (
    <div className={`glass-card p-6 ${className}`}>
      {/* Header with metric tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="section-title">
          <span>📈</span> Weekly Activity
        </h2>
        
        {/* Metric tabs */}
        <div className="flex gap-1 p-1 bg-navy-800/60 rounded-xl">
          {METRICS.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setActiveMetric(metric.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeMetric === metric.key
                  ? "bg-gradient-to-r from-sakura-500/20 to-sakura-600/20 text-sakura-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-300 hover:bg-navy-700/50"
              }`}
            >
              <span>{metric.icon}</span>
              <span className="hidden sm:inline">{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-${currentMetric.color}-400`} />
          <span className="text-xs text-slate-400">Total:</span>
          <span className="text-sm font-semibold text-slate-200">
            {totalValue}{currentMetric.unit && ` ${currentMetric.unit}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-500" />
          <span className="text-xs text-slate-400">Avg:</span>
          <span className="text-sm font-semibold text-slate-200">
            {avgValue}{currentMetric.unit && ` ${currentMetric.unit}`}/day
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-right pr-2">
          <span className="text-[10px] text-slate-500">{maxValue}</span>
          <span className="text-[10px] text-slate-500">{Math.round(maxValue / 2)}</span>
          <span className="text-[10px] text-slate-500">0</span>
        </div>

        {/* Bars container */}
        <div className="ml-10 flex items-end gap-2 h-44">
          {data.map((day, i) => {
            const value = getValue(day, activeMetric);
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const isToday = i === data.length - 1;
            const isHovered = hoveredIndex === i;
            const dayName = new Date(day.date).toLocaleDateString("en", { weekday: "short" });
            const fullDate = new Date(day.date).toLocaleDateString("en", { 
              month: "short", 
              day: "numeric" 
            });

            return (
              <div 
                key={day.date} 
                className="flex-1 flex flex-col items-center gap-2 relative group"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                <div
                  className={`absolute -top-16 left-1/2 -translate-x-1/2 z-10 transition-all duration-200 ${
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="bg-navy-700 border border-white/10 rounded-lg px-3 py-2 shadow-xl min-w-[100px]">
                    <p className="text-xs text-slate-400 mb-1">{fullDate}</p>
                    <p className="text-sm font-bold text-slate-100">
                      {value}{currentMetric.unit && ` ${currentMetric.unit}`}
                    </p>
                    {activeMetric === "xp" && day.reviewsDone > 0 && (
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {day.reviewsDone} reviews
                      </p>
                    )}
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-navy-700 border-r border-b border-white/10 transform rotate-45" />
                </div>

                {/* Bar */}
                <div className="w-full flex flex-col items-center justify-end h-32">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ease-out cursor-pointer ${
                      getBarColor(isToday, value > 0)
                    } ${isHovered ? "ring-2 ring-white/20 scale-105" : ""} ${
                      isToday ? "shadow-lg shadow-sakura-500/20" : ""
                    }`}
                    style={{ 
                      height: `${Math.max(height, 4)}%`, 
                      minHeight: "4px",
                      animationDelay: `${i * 50}ms`,
                    }}
                  />
                </div>

                {/* Day label */}
                <span 
                  className={`text-xs transition-colors ${
                    isToday 
                      ? "text-sakura-400 font-bold" 
                      : isHovered 
                        ? "text-slate-300" 
                        : "text-slate-500"
                  }`}
                >
                  {dayName}
                </span>
              </div>
            );
          })}
        </div>

        {/* Grid lines */}
        <div className="absolute left-10 right-0 top-0 bottom-8 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 border-t border-dashed border-white/5" />
          <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-white/5" />
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10" />
        </div>
      </div>

      {/* Empty state */}
      {totalValue === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy-900/80 rounded-2xl">
          <div className="text-center">
            <p className="text-4xl mb-2">📊</p>
            <p className="text-sm text-slate-400">No activity yet this week</p>
            <p className="text-xs text-slate-500 mt-1">Start studying to see your progress!</p>
          </div>
        </div>
      )}
    </div>
  );
}
