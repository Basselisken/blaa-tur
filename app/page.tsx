"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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

const bgElements = Array.from({ length: 50 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 3,
  text: Array.from({ length: 20 }, () => Math.random().toString(36).charAt(2)).join(""),
}));

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [isMounted, setIsMounted] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<{ text: string; type?: "system" }[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const startRedirectCountdown = () => {
    setIsRedirecting(true);
    setTerminalHistory((prev) => [...prev, { text: "✓ KODE VERIFICERET — OMDIRIGERER OM 3...", type: "system" }]);

    setTimeout(() => {
      setTerminalHistory((prev) => [...prev, { text: "2...", type: "system" }]);
    }, 1000);

    setTimeout(() => {
      setTerminalHistory((prev) => [...prev, { text: "1...", type: "system" }]);
    }, 2000);

    setTimeout(() => {
      router.push("/cryptic");
    }, 3000);
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && terminalInput.trim() && !isRedirecting) {
      setTerminalHistory((prev) => [...prev, { text: terminalInput }]);
      if (terminalInput.trim().toLowerCase() === "tallinn") {
        startRedirectCountdown();
      }
      setTerminalInput("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden flex items-center justify-center">
      {/* Scanline effect */}
      <div className="cryptic-scanline"></div>

      {/* Animated background - code lines */}
      {isMounted && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {bgElements.map((el, i) => (
            <div
              key={i}
              className="absolute text-xs text-green-400 animate-pulse"
              style={{
                left: `${el.left}%`,
                top: `${el.top}%`,
                animationDelay: `${el.delay}s`,
                animationDuration: `${el.duration}s`,
              }}
            >
              {el.text}
            </div>
          ))}
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
            [TÆLLER AKTIVERET — MÅL: 03.09.2026]
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

        {/* Terminal */}
        <div className="mt-8 bg-black border-2 border-green-500 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.2)] max-w-6xl mx-auto overflow-hidden">
          <div className="bg-gray-900 border-b border-green-800 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <div className="w-3 h-3 rounded-full bg-green-800"></div>
            <div className="w-3 h-3 rounded-full bg-green-800"></div>
            <span className="ml-4 text-green-600 text-xs">
              {isMounted && timeLeft.isComplete ? "TERMINAL — KLAR" : "TERMINAL — DEAKTIVERET"}
            </span>
          </div>
          {isMounted && timeLeft.isComplete ? (
            <div className="p-4 max-h-60 overflow-y-auto text-left">
              {terminalHistory.map((line, i) => (
                <div key={i} className={`flex gap-2 mb-1 ${line.type === "system" ? "text-green-300 animate-pulse" : ""}`}>
                  {line.type !== "system" && <span className="text-green-600 shrink-0">$</span>}
                  <span className={line.type === "system" ? "text-green-300" : "text-green-400"}>{line.text}</span>
                </div>
              ))}
              {!isRedirecting && (
                <div className="flex items-center gap-2">
                  <span className="text-green-400 shrink-0">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={handleTerminalKeyDown}
                    className="flex-1 bg-transparent border-none text-green-400 font-mono focus:outline-none focus:ring-0"
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <span className="text-green-400 animate-pulse">_</span>
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>
          ) : (
            <div className="p-4 text-center text-green-700 text-sm">
              [DEAKTIVERET INDTIL MISSIONEN STARTER]
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
