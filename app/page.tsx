"use client";

import { useState, useEffect } from "react";

// September 3rd - use next occurrence if we've passed it this year
function getTargetDate() {
  const now = new Date();
  const year = now.getFullYear();
  const sep3 = new Date(year, 8, 3); // month 8 = September
  return sep3 > now ? sep3 : new Date(year + 1, 8, 3);
}

function getTimeLeft() {
  const now = new Date();
  const target = getTargetDate();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isComplete: false };
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden flex items-center justify-center">
      {/* Scanline effect */}
      <div className="cryptic-scanline"></div>

      {/* Animated background - code lines */}
      {isMounted && (
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 50 }).map((_, i) => {
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = 2 + Math.random() * 3;
            const text = Array.from({ length: 20 })
              .map(() => Math.random().toString(36).charAt(2))
              .join("");
            return (
              <div
                key={i}
                className="absolute text-xs text-green-400 animate-pulse"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              >
                {text}
              </div>
            );
          })}
        </div>
      )}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16 text-center">
        <div className="bg-black border-2 border-green-500 rounded-lg p-12 md:p-16 shadow-[0_0_30px_rgba(0,255,0,0.3)] max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-green-400">$</span>
            <span className="animate-pulse">_</span>
          </div>
          <div className="text-green-500 text-sm mb-8 animate-pulse">
            [TÆLLER AKTIVERET — MÅL: 03.09]
          </div>

          {!isMounted ? (
            <div className="flex flex-wrap items-baseline justify-center gap-2 md:gap-4">
              <div className="flex items-baseline">
                <span className="text-7xl md:text-9xl font-bold text-green-400 tabular-nums">---</span>
                <span className="text-green-600 text-xl md:text-2xl ml-2 uppercase">d</span>
              </div>
              <span className="text-green-500 text-5xl md:text-7xl font-bold">:</span>
              <div className="flex items-baseline">
                <span className="text-7xl md:text-9xl font-bold text-green-400 tabular-nums">--</span>
                <span className="text-green-600 text-xl md:text-2xl ml-2 uppercase">h</span>
              </div>
              <span className="text-green-500 text-5xl md:text-7xl font-bold">:</span>
              <div className="flex items-baseline">
                <span className="text-7xl md:text-9xl font-bold text-green-400 tabular-nums">--</span>
                <span className="text-green-600 text-xl md:text-2xl ml-2 uppercase">m</span>
              </div>
              <span className="text-green-500 text-5xl md:text-7xl font-bold">:</span>
              <div className="flex items-baseline">
                <span className="text-7xl md:text-9xl font-bold text-green-400 tabular-nums">--</span>
                <span className="text-green-600 text-xl md:text-2xl ml-2 uppercase">s</span>
              </div>
            </div>
          ) : timeLeft.isComplete ? (
            <div className="text-green-400 text-5xl md:text-7xl font-bold">
              &gt; MISSION INITIATED
            </div>
          ) : (
            <div className="flex flex-wrap items-baseline justify-center gap-2 md:gap-4">
              <div className="flex items-baseline">
                <span className="text-7xl md:text-9xl font-bold text-green-400 tabular-nums">
                  {String(timeLeft.days).padStart(3, "0")}
                </span>
                <span className="text-green-600 text-xl md:text-2xl ml-2 uppercase">d</span>
              </div>
              <span className="text-green-500 text-5xl md:text-7xl font-bold">:</span>
              <div className="flex items-baseline">
                <span className="text-7xl md:text-9xl font-bold text-green-400 tabular-nums">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-green-600 text-xl md:text-2xl ml-2 uppercase">h</span>
              </div>
              <span className="text-green-500 text-5xl md:text-7xl font-bold">:</span>
              <div className="flex items-baseline">
                <span className="text-7xl md:text-9xl font-bold text-green-400 tabular-nums">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-green-600 text-xl md:text-2xl ml-2 uppercase">m</span>
              </div>
              <span className="text-green-500 text-5xl md:text-7xl font-bold">:</span>
              <div className="flex items-baseline">
                <span className="text-7xl md:text-9xl font-bold text-green-400 tabular-nums animate-pulse">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-green-600 text-xl md:text-2xl ml-2 uppercase">s</span>
              </div>
            </div>
          )}

          <div className="mt-12 text-green-700 text-xs">
            [STATUS: TÆLLER KØRER — FORBINDELSE: SIKKER]
          </div>
        </div>
      </div>
    </div>
  );
}
