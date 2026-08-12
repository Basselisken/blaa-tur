"use client";

import { useEffect, useState } from "react";

const SHOW_AT = new Date("2026-09-03T10:00:00+02:00");
const HIDE_AT = new Date("2026-09-03T11:00:00+02:00");
const FORCE_SHOW = false;

export default function CompromisedBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => { const now = new Date(); setVisible(FORCE_SHOW || (now >= SHOW_AT && now < HIDE_AT)); };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60">
      <div className="bg-red-950 border-2 border-red-500 rounded-lg shadow-[0_0_40px_rgba(255,0,0,0.5)] px-8 py-8 text-center max-w-md w-full animate-pulse">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-red-400 text-2xl font-bold shrink-0">⚠</span>
          <span className="text-red-300 font-mono font-bold text-base md:text-lg tracking-wide uppercase">
            MISSION KOMPROMITTERET
          </span>
          <span className="text-red-400 text-2xl font-bold shrink-0">⚠</span>
        </div>
        <div className="text-red-300 font-mono text-sm md:text-base leading-relaxed">
          I er blevet kompromitteret — nye instrukter er sendt til jeres handlers
        </div>
      </div>
    </div>
  );
}
