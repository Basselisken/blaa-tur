"use client";

import type { Mission, AgentProgress } from "../lib/missions";

interface MissionTableProps {
  missions: Mission[];
  progress: AgentProgress;
  pendingCodes: Set<string>;
  onToggle: (code: string, done: boolean) => void;
}

export default function MissionTable({
  missions,
  progress,
  pendingCodes,
  onToggle,
}: MissionTableProps) {
  if (missions.length === 0) {
    return (
      <div className="text-green-800 text-sm italic">
        {`// Ingen personlige missioner deklassificeret endnu`}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {missions.map((mission) => {
        const done = !!progress[mission.code];
        const pending = pendingCodes.has(mission.code);

        return (
          <div
            key={mission.code}
            className={`border rounded-lg p-4 transition-all ${
              done
                ? "border-green-900 opacity-50"
                : mission.secret
                ? "border-red-900 bg-red-950/20"
                : "border-green-800"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox — large tap target */}
              <button
                onClick={() => !pending && onToggle(mission.code, !done)}
                disabled={pending}
                aria-label={`Marker ${mission.code} som udført`}
                className={`mt-0.5 shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  pending
                    ? "border-green-900 cursor-wait"
                    : done
                    ? "border-green-500 bg-green-500 cursor-pointer"
                    : "border-green-700 cursor-pointer hover:border-green-400"
                }`}
              >
                {done && (
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {pending && (
                  <div className="w-3 h-3 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                {/* Code + secret badge */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400 font-bold text-sm tracking-wide">
                    {mission.code}
                  </span>
                  {mission.secret && (
                    <span className="text-[10px] text-red-400 tracking-widest border border-red-900 px-1 rounded">
                      HEMMELIG
                    </span>
                  )}
                </div>

                {/* Objective */}
                <p className={`text-green-300 text-sm leading-snug ${done ? "line-through text-green-800" : ""}`}>
                  {mission.objective}
                </p>

                {/* Notes */}
                {mission.notes && (
                  <p className="mt-2 text-green-700 text-xs leading-relaxed border-t border-green-950 pt-2">
                    {mission.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
