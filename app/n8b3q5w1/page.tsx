"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CompromisedBanner from "../components/CompromisedBanner";
import AgentOpsConsole from "../components/AgentOpsConsole";

function HiddenPage2Content() {
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

      if (token === "b3n8-q5w1") {
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
        <AgentOpsConsole name="BLACK SLUG" code="B3N8-Q5W1" agentId="black-slug" />
      </div>
    </div>
  );
}

export default function HiddenPage2() {
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
      <HiddenPage2Content />
    </Suspense>
  );
}
