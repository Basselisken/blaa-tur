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
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="text-green-600 text-xs uppercase tracking-widest border-b border-green-900">
            <th className="py-2 pr-3 whitespace-nowrap">Klar</th>
            <th className="py-2 pr-3 whitespace-nowrap">Mission</th>
            <th className="py-2 pr-3">Objektiv</th>
            <th className="py-2 whitespace-nowrap">Noter</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission) => {
            const done = !!progress[mission.code];
            const pending = pendingCodes.has(mission.code);
            return (
              <tr
                key={mission.code}
                className={`border-b border-green-950 align-top ${
                  mission.secret ? "bg-green-950/40" : ""
                } ${done ? "opacity-60" : ""}`}
              >
                <td className="py-3 pr-3">
                  <input
                    type="checkbox"
                    checked={done}
                    disabled={pending}
                    onChange={() => onToggle(mission.code, !done)}
                    aria-label={`Marker ${mission.code} som udført`}
                    className="h-4 w-4 accent-green-500 cursor-pointer disabled:cursor-wait"
                  />
                </td>
                <td className="py-3 pr-3 text-green-500 font-bold whitespace-nowrap">
                  {mission.code}
                  {mission.secret && (
                    <span className="ml-2 text-[10px] text-red-400 tracking-widest">
                      HEMMELIG
                    </span>
                  )}
                </td>
                <td className={`py-3 pr-3 text-green-400 ${done ? "line-through" : ""}`}>
                  {mission.objective}
                </td>
                <td className="py-3 text-green-700 text-xs">{mission.notes ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
