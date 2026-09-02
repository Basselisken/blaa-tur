"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { AgentId, AgentProgress } from "../lib/missions";
import { personalMissions, sharedMissions, sharedMissionsCopy } from "../lib/missions";
import MissionDay from "./MissionDay";
import MissionSection from "./MissionSection";
import YouTubeEmbed from "./YouTubeEmbed";
import Day1Briefing from "./Day1Briefing";

type TabId = "briefing" | "missions";

interface AgentOpsConsoleProps {
  name: string;
  code: string;
  agentId: AgentId;
}

const tabs: { id: TabId; label: string }[] = [
  { id: "briefing", label: "BRIEFING" },
  { id: "missions", label: "MISSIONER" },
];

export default function AgentOpsConsole({ name, code, agentId }: AgentOpsConsoleProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [tab, setTab] = useState<TabId>("briefing");
  const [progress, setProgress] = useState<AgentProgress>({});
  const [pendingCodes, setPendingCodes] = useState<Set<string>>(new Set());
  const [progressError, setProgressError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const response = await fetch(`/api/missions/progress?token=${encodeURIComponent(token)}`);
        if (!response.ok) throw new Error("load failed");
        const data = await response.json();
        setProgress(data.progress ?? {});
        setProgressError(null);
      } catch {
        setProgressError("Kunne ikke hente missionsstatus.");
      }
    };

    void load();
  }, [token]);

  const onToggle = useCallback(
    async (missionCode: string, done: boolean) => {
      setPendingCodes((current) => new Set(current).add(missionCode));
      setProgress((current) => {
        const next = { ...current };
        if (done) next[missionCode] = true;
        else delete next[missionCode];
        return next;
      });

      try {
        const response = await fetch("/api/missions/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, code: missionCode, done }),
        });
        if (!response.ok) throw new Error("save failed");
        const data = await response.json();
        setProgress(data.progress ?? {});
        setProgressError(null);
      } catch {
        setProgress((current) => {
          const next = { ...current };
          if (done) delete next[missionCode];
          else next[missionCode] = true;
          return next;
        });
        setProgressError("Kunne ikke gemme. Prøv igen.");
      } finally {
        setPendingCodes((current) => {
          const next = new Set(current);
          next.delete(missionCode);
          return next;
        });
      }
    },
    [token]
  );

  return (
    <>
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-green-400">
          &gt; {name}
        </h1>
        <div className="text-green-500 text-sm mb-2">
          [KODE: {code} VERIFICERET]
        </div>
      </div>
      <div role="tablist" aria-label="Agentkanaler" className="flex gap-2 mb-8 border-b border-green-900">
        {tabs.map((item) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.id)}
              className={`px-4 py-2 text-xs tracking-widest transition-colors border-b-2 -mb-px ${
                isActive
                  ? "text-green-400 border-green-400"
                  : "text-green-800 border-transparent hover:text-green-500"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "briefing" && (
        <div role="tabpanel">
          <div className="mb-4 text-green-600 text-sm">[DAGLIG BRIEFING]</div>
          <MissionDay day={1} date="3. september" unlockAt={new Date("2026-09-03T09:00:00+03:00")} forceUnlocked>
            <Day1Briefing onOpenMissions={() => setTab("missions")} />
          </MissionDay>
          <MissionDay day={2} date="4. september" unlockAt={new Date("2026-09-04T09:00:00+03:00")}>
            <YouTubeEmbed videoId="tcwozlg7LC0" title={`${name} — Dag 2 Briefing`} />
          </MissionDay>
          <MissionDay day={3} date="5. september" unlockAt={new Date("2026-09-05T09:00:00+03:00")}>
            <YouTubeEmbed videoId="EzPA2M6EYEs" title={`${name} — Dag 3 Briefing`} />
          </MissionDay>
        </div>
      )}

      {tab === "missions" && (
        <div role="tabpanel">
          {progressError && (
            <div className="mb-4 text-red-400 text-xs">{progressError}</div>
          )}
          <MissionSection
            heading={sharedMissionsCopy.heading}
            subtitle={sharedMissionsCopy.subtitle}
            note={sharedMissionsCopy.note}
            missions={sharedMissions}
            progress={progress}
            pendingCodes={pendingCodes}
            onToggle={onToggle}
          />
          <MissionSection
            heading="[PERSONLIGE MISSIONER]"
            subtitle={`Kun for ${name}. Kan udføres alle dage vi er væk.`}
            missions={personalMissions[agentId]}
            progress={progress}
            pendingCodes={pendingCodes}
            onToggle={onToggle}
          />
        </div>
      )}
    </>
  );
}
