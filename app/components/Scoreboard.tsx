"use client";

import { useEffect, useState } from "react";

type Score = {
  agentId: string;
  name: string;
  completed: number;
  total: number;
};

export default function Scoreboard() {
  const [scores, setScores] = useState<Score[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/missions/scoreboard");
        if (!response.ok) throw new Error("load failed");
        const data = await response.json();
        if (!cancelled) setScores(data.scores ?? []);
      } catch {
        if (!cancelled) setScores([]);
      }
    };

    void load();
    const interval = setInterval(() => void load(), 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative z-10 text-left max-w-xl mx-auto w-full">
      <div className="text-green-600 text-xs uppercase tracking-widest mb-4 text-center">
        Udførte missioner
      </div>
      {!scores ? (
        <div className="text-green-800 text-sm text-center animate-pulse">INDLÆSER...</div>
      ) : (
        <div className="space-y-3">
          {scores.map((score, index) => (
            <div
              key={score.agentId}
              className="flex items-baseline justify-between gap-4 border-b border-green-900 pb-2"
            >
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="text-green-800 text-xs w-4 shrink-0">{index + 1}</span>
                <span className="text-green-300 text-lg md:text-2xl font-bold truncate">
                  {score.name}
                </span>
              </div>
              <div className="shrink-0 tabular-nums">
                <span className="text-3xl md:text-5xl font-bold text-green-400">
                  {String(score.completed).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
