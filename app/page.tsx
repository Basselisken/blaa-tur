"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Scoreboard from "./components/Scoreboard";

function getTargetDate() {
  return new Date("2026-09-03T00:00:00+02:00");
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
  const [terminalHistory, setTerminalHistory] = useState<{ text: string; type?: "system" | "info" | "info-header" | "info-item" | "error" }[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);
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

  const preppingList = [
    { text: "Mødetidspunkt:", type: "info" as const },
    { text: "Kl. 06:30 — Kastrup Lufthavn", type: "info-item" as const },
    { text: "Bagage:", type: "info" as const },
    { text: "1 personlig genstand (skal kunne ligge under sædet foran dig)", type: "info-item" as const },
    { text: "1 stk. håndbagage (23 x 40 x 55 cm · maks. 10 kg)", type: "info-item" as const },
    { text: "Ingen indtjekket bagage", type: "info-item" as const },
    { text: "Pak til:", type: "info" as const },
    { text: "Varierende vejr", type: "info-item" as const },
    { text: "Intens aftenaktivitet", type: "info-item" as const },
    { text: "Uforudsete hændelser", type: "info-item" as const },
    { text: "Medbring:", type: "info" as const },
    { text: "Gyldigt pas", type: "info-item" as const },
    { text: "Missionsegnet påklædning", type: "info-item" as const },
    { text: "Solbriller (også efter mørkets frembrud)", type: "info-item" as const },
    { text: "Euro (hvis man har)", type: "info-item" as const },
    { text: "Inden afgang:", type: "info" as const },
    { text: "Video materiale af destrueret mission skal være indsendt til jeres handlers inden turen", type: "info-item" as const },
    { text: "// Exspecta inopinata", type: "info-header" as const },
  ];

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && terminalInput.trim() && !isRedirecting && !isProcessing) {
      const cmd = terminalInput.trim().toLowerCase();
      setTerminalHistory((prev) => [...prev, { text: terminalInput }]);
      setTerminalInput("");

      if (cmd === "warszawa") {
        startRedirectCountdown();
      } else if (cmd === "exspecta inopinata") {
        setIsProcessing(true);
        setTimeout(() => {
          setTerminalHistory((prev) => [
            ...prev,
            { text: "// Forvent det uventede", type: "system" as const },
            { text: "Dette er ikke koden til prepping listen", type: "error" as const },
          ]);
          setIsProcessing(false);
        }, 1000);
      } else if (cmd === "prepping") {
        setIsProcessing(true);
        setTimeout(() => {
          setTerminalHistory((prev) => [
            ...prev,
            { text: "✓ ADGANG GODKENDT — KLASSIFICERET INFORMATION FØLGER", type: "system" as const },
            ...preppingList,
          ]);
          setIsProcessing(false);
        }, 1000);
      } else {
        setIsProcessing(true);
        setTimeout(() => {
          setTerminalHistory((prev) => [
            ...prev,
            { text: `✗ UKENDT KOMMANDO: '${cmd}' — ADGANG NÆGTET`, type: "error" as const },
          ]);
          setIsProcessing(false);
        }, 1000);
      }
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

        <div className="relative bg-black border-2 border-green-500 rounded-lg p-12 md:p-16 shadow-[0_0_30px_rgba(0,255,0,0.3)] max-w-6xl mx-auto overflow-hidden">
          <img
            src="/spy-sunglasses.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
            style={{ mixBlendMode: "screen" }}
          />
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-green-400">$</span>
            <span className="animate-pulse">_</span>
          </div>
          <div className="text-green-500 text-sm mb-8 animate-pulse">
            {isMounted && timeLeft.isComplete
              ? "[SCOREBOARD AKTIVERET — MISSIONER]"
              : "[TÆLLER AKTIVERET — MÅL: 03.09.2026]"}
          </div>

          {!isMounted ? (
            <div className="flex flex-wrap items-baseline justify-center gap-2 md:gap-4">
              <div className="flex items-baseline">
                <span className="text-7xl md:text-9xl font-bold text-green-400 tabular-nums">--</span>
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
            <Scoreboard />
          ) : (
            <div className="flex flex-wrap items-baseline justify-center gap-2 md:gap-4">
              <div className="flex items-baseline">
                <span className="text-7xl md:text-9xl font-bold text-green-400 tabular-nums">
                  {timeLeft.days}
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
            {isMounted && timeLeft.isComplete
              ? "[STATUS: SCOREBOARD LIVE — FORBINDELSE: SIKKER]"
              : "[STATUS: TÆLLER KØRER — FORBINDELSE: SIKKER]"}
          </div>
        </div>

        <div className="mt-8 bg-black border-2 border-green-500 rounded-lg p-8 md:p-10 shadow-[0_0_20px_rgba(0,255,0,0.2)] max-w-6xl mx-auto text-left">
          <div className="text-green-600 text-xs uppercase tracking-widest mb-4">
            [NÆSTE ÅRS PLANLÆGGERE]
          </div>
          <p className="text-green-300 text-lg md:text-2xl font-bold mb-4">
            Bonne og hr hest på skjorte
          </p>
          <p className="text-green-500 text-sm md:text-base">
            Vi har meget meget høje forventninger.
          </p>
        </div>

        {/* Terminal */}
        <div
          className="mt-8 bg-black border-2 border-green-500 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.2)] max-w-6xl mx-auto overflow-hidden cursor-text"
          onClick={() => terminalInputRef.current?.focus()}
        >
          <div className="bg-gray-900 border-b border-green-800 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <div className="w-3 h-3 rounded-full bg-green-800"></div>
            <div className="w-3 h-3 rounded-full bg-green-800"></div>
            <span className="ml-4 text-green-600 text-xs">TERMINAL — KLAR</span>
            <span className="ml-auto text-green-800 text-xs animate-pulse">↓ TRYK FOR AT SKRIVE</span>
          </div>
          <div className="p-4 h-64 overflow-y-auto text-left">
            {terminalHistory.map((line, i) => {
              if (line.type === "system") {
                return (
                  <div key={i} className="flex gap-2 mb-1 animate-pulse">
                    <span className="text-green-300">{line.text}</span>
                  </div>
                );
              }
              if (line.type === "info-header") {
                return (
                  <div key={i} className="mt-2 mb-2">
                    <span className="text-green-300 font-bold text-base">{line.text}</span>
                  </div>
                );
              }
              if (line.type === "info") {
                return (
                  <div key={i} className="mt-3 mb-1">
                    <span className="text-green-500 text-sm uppercase tracking-wide">{line.text}</span>
                  </div>
                );
              }
              if (line.type === "info-item") {
                return (
                  <div key={i} className="flex items-start gap-2 mb-2 pl-2">
                    <span className="text-green-600 shrink-0 mt-0.5">›</span>
                    <span className="text-green-300 text-sm leading-snug">{line.text}</span>
                  </div>
                );
              }
              if (line.type === "error") {
                return (
                  <div key={i} className="flex gap-2 mb-1">
                    <span className="text-red-400">{line.text}</span>
                  </div>
                );
              }
              return (
                <div key={i} className="flex gap-2 mb-1">
                  <span className="text-green-600 shrink-0">$</span>
                  <span className="text-green-400">{line.text}</span>
                </div>
              );
            })}
            {isProcessing && (
              <div className="flex gap-2 mb-1 animate-pulse">
                <span className="text-green-600 shrink-0">$</span>
                <span className="text-green-500">BEHANDLER...</span>
              </div>
            )}
            {!isRedirecting && !isProcessing && (
              <div className="flex items-center gap-2 border-t border-green-900 pt-3 mt-2">
                <span className="text-green-400 shrink-0 font-bold">$</span>
                <input
                  ref={terminalInputRef}
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={handleTerminalKeyDown}
                  placeholder="indtast kommando..."
                  className="flex-1 bg-transparent border-none text-green-400 font-mono focus:outline-none focus:ring-0 placeholder-green-900 text-base"
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="text-green-400 animate-pulse text-lg">█</span>
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
