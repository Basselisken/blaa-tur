"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import YouTubeEmbed from "../../components/YouTubeEmbed";

const stats = [
  { label: "KODENAVN", value: "BENNI" },
  { label: "STATUS", value: "AKTIV" },
  { label: "CLEARANCE", value: "LEVEL 5" },
  { label: "MISSIONER", value: "KLASSIFICERET" },
];

export default function BenniPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [revealedLines, setRevealedLines] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setRevealedLines((prev) => {
        if (prev >= stats.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      <div className="cryptic-scanline" />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-400 text-sm mb-8 transition-colors"
        >
          &lt; TILBAGE TIL HOVEDKVARTER
        </Link>

        <div className="mb-10">
          <div className="text-green-600 text-xs mb-2 animate-pulse">
            [SIKKER FORBINDELSE ETABLERET]
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-green-400 mb-2">
            &gt; BENNI
          </h1>
          <div className="h-px bg-green-800 mt-4" />
        </div>

        <div className="bg-black border-2 border-green-500 rounded-lg p-6 md:p-8 shadow-[0_0_20px_rgba(0,255,0,0.3)] mb-8">
          <div className="text-green-600 text-sm mb-6">
            {`// AGENT DOSSIER`}
          </div>
          <div className="space-y-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex items-center gap-4 transition-opacity duration-500 ${
                  isMounted && i < revealedLines ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-green-700 w-40 shrink-0 text-sm">
                  {stat.label}:
                </span>
                <span className="text-green-400 font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <YouTubeEmbed videoId="WoCg96xz92M" autoplay title="Benni Briefing" />
        </div>

        <div className="mt-8 text-center text-green-800 text-xs">
          [BENNI — DOSSIER SLUT — KLASSIFICERET]
        </div>
      </div>
    </div>
  );
}
