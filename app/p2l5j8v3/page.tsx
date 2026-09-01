"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MissionDay from "../components/MissionDay";
import CompromisedBanner from "../components/CompromisedBanner";
import YouTubeEmbed from "../components/YouTubeEmbed";

function Agent00PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = searchParams.get("token");

      if (!token) {
        router.push("/cryptic");
        return;
      }

      if (token === "p2l5-j8v3") {
        setIsAuthorized(true);
      } else {
        router.push("/cryptic");
      }
      setIsChecking(false);
    };

    checkAuthorization();
  }, [searchParams, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">VERIFICERER ADGANG...</div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      <CompromisedBanner />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-green-400">
            &gt; AGENT 00
          </h1>
          <div className="text-green-500 text-sm mb-2">
            [KODE: P2L5-J8V3 VERIFICERET]
          </div>
        </div>

        <div className="mb-4 text-green-600 text-sm">[MISSIONER]</div>

        <MissionDay day={1} date="3. september" unlockAt={new Date("2026-09-03T09:00:00+03:00")} forceUnlocked>
          <div className="text-green-700 text-sm italic">{`// Missionsbriefing tilføjes her`}</div>
        </MissionDay>

        <MissionDay day={2} date="4. september" unlockAt={new Date("2026-09-04T09:00:00+03:00")}>
          <YouTubeEmbed videoId="tcwozlg7LC0" title="Agent 00 — Dag 2 Briefing" />
        </MissionDay>

        <MissionDay day={3} date="5. september" unlockAt={new Date("2026-09-05T09:00:00+03:00")}>
          <YouTubeEmbed videoId="EzPA2M6EYEs" title="Agent 00 — Dag 3 Briefing" />
        </MissionDay>

      </div>
    </div>
  );
}

export default function Agent00SecretPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">INDLÆSER...</div>
          </div>
        </div>
      }
    >
      <Agent00PageContent />
    </Suspense>
  );
}
