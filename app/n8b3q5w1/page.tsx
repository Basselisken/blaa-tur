"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

      try {
        // Verify the token matches the expected code
        const response = await fetch("/api/codes");
        const data = await response.json();

        if (response.ok) {
          const codes = data.codes;
          // Check if token matches B3N8-Q5W1
          const isValid = codes.some(
            (c: { code1: string; code2: string }) =>
              c.code1 === "B3N8" && c.code2 === "Q5W1"
          );

          if (isValid && token === "b3n8-q5w1") {
            setIsAuthorized(true);
          } else {
            router.push("/cryptic");
          }
        } else {
          router.push("/cryptic");
        }
      } catch (error) {
        router.push("/cryptic");
      } finally {
        setIsChecking(false);
      }
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
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-green-400">
            &gt; ADGANG TILLADT
          </h1>
          <div className="text-green-500 text-sm mb-2">
            [KODE: B3N8-Q5W1 VERIFICERET]
          </div>
        </div>

        <div className="bg-black border-2 border-green-500 rounded-lg p-8 shadow-[0_0_20px_rgba(0,255,0,0.3)]">
          <div className="text-green-400 mb-6 text-lg">
            // VELKOMMEN TIL DENNE SIDE
          </div>
          <div className="text-green-300 space-y-4">
            <p>Dette er den anden hemmelige side.</p>
            <p>Du har succesfuldt indtastet koden: B3N8-Q5W1</p>
          </div>
        </div>
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

