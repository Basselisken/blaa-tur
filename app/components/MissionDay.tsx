"use client";

import { useEffect, useState } from "react";

interface MissionDayProps {
  day: number;
  date: string; // e.g. "3. september"
  unlockAt: Date;
  forceUnlocked?: boolean;
  children: React.ReactNode;
}

export default function MissionDay({ day, date, unlockAt, forceUnlocked, children }: MissionDayProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const isUnlocked = forceUnlocked || (now !== null && now >= unlockAt);
  const unlockTimeStr = unlockAt.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Tallinn" });

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-green-700 text-xs uppercase tracking-widest">DAG {day}</span>
        <span className="text-green-600 text-xs">— {date}</span>
        <div className="flex-1 h-px bg-green-900" />
        <span className={`text-xs font-bold ${isUnlocked ? "text-green-400" : "text-green-800"}`}>
          {isUnlocked ? "● AKTIV" : "○ LÅST"}
        </span>
      </div>

      <div className={`border rounded-lg overflow-hidden transition-all duration-500 ${
        isUnlocked ? "border-green-600" : "border-green-900"
      }`}>
        {isUnlocked || now === null ? (
          <div className="p-6">
            {now === null ? (
              <div className="text-green-800 text-sm animate-pulse">INDLÆSER...</div>
            ) : (
              children
            )}
          </div>
        ) : (
          <div className="p-6 flex items-center gap-4">
            <div className="text-green-900 text-3xl select-none">🔒</div>
            <div>
              <div className="text-green-800 text-sm font-bold mb-1">KLASSIFICERET</div>
              <div className="text-green-900 text-xs">
                Låser op kl. {unlockTimeStr} den {date}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
