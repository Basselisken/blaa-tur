"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function HiddenPage3Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimegatePassed, setIsTimegatePassed] = useState(false);

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
          // Check if token matches R4T6-Y8Z9
          const isValid = codes.some(
            (c: { code1: string; code2: string }) =>
              c.code1 === "R4T6" && c.code2 === "Y8Z9"
          );

          if (isValid && token === "r4t6-y8z9") {
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

  // Timegate countdown - Set to 20:00 today
  useEffect(() => {
    if (!isAuthorized) return;

    // Get today's date at 20:00 (8:00 PM)
    const getTargetTime = () => {
      const target = new Date();
      target.setHours(20, 0, 0, 0); // Set to 20:00:00.000 today
      return target.getTime();
    };

    const updateCountdown = () => {
      const now = Date.now();
      const targetTime = getTargetTime();

      // If it's already past 20:00 today, show content immediately
      if (now >= targetTime) {
        setIsTimegatePassed(true);
        setTimeRemaining(0);
      } else {
        // Calculate remaining time until 20:00 today
        const remaining = Math.floor((targetTime - now) / 1000);
        setIsTimegatePassed(false);
        setTimeRemaining(remaining);
      }
    };

    // Initial update
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isAuthorized]);

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
            [KODE: R4T6-Y8Z9 VERIFICERET]
          </div>
        </div>

        <div className="bg-black border-2 border-green-500 rounded-lg p-8 shadow-[0_0_20px_rgba(0,255,0,0.3)]">
          <div className="text-green-400 mb-6 text-lg">
            // VELKOMMEN TIL DENNE SIDE
          </div>
          <div className="text-green-300 space-y-4 mb-8">
            <p>Dette er den tredje hemmelige side.</p>
            <p>Du har succesfuldt indtastet koden: R4T6-Y8Z9</p>
          </div>
          
          {/* YouTube Video */}
          <div className="flex justify-center items-center my-8">
            <div className="w-full max-w-4xl aspect-video border-2 border-green-600 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.3)]">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/ksLU2wXxURE"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

          {/* Timegated Secret Section */}
          <div className="mt-8 border-2 border-green-600 rounded-lg p-8 bg-gray-900">
            {!isTimegatePassed ? (
              <div className="text-center">
                <div className="text-green-400 mb-4 text-lg font-bold">
                  &gt; TIMEGATE AKTIV
                </div>
                <div className="text-green-500 mb-2 text-sm">
                  [HEMMELIG INFORMATION LÅSES OP KL. 20:00]
                </div>
                {timeRemaining !== null && (
                  <div className="text-green-400 text-4xl md:text-6xl font-bold font-mono my-6 animate-pulse">
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
                  </div>
                )}
                <div className="text-green-600 text-xs mt-4">
                  [VENTER PÅ DEKRYPTION...]
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-green-400 mb-4 text-lg font-bold">
                  &gt; TIMEGATE DEAKTIVERET
                </div>
                <div className="text-green-500 text-sm mb-4">
                  [HEMMELIG INFORMATION DEKRYPTERET]
                </div>
                <div className="text-green-300 space-y-3 border-t border-green-800 pt-4">
                  <p className="text-xl font-semibold text-green-400">
                    // KLASSIFICERET INFORMATION
                  </p>
                  <p>
                    Dette er hemmelig information der kun er tilgængelig efter timelåsen er udløbet.
                  </p>
                  <p>
                    Du har nu adgang til denne eksklusive sektion.
                  </p>
                  <div className="mt-6 p-4 bg-black border border-green-800 rounded">
                    <p className="text-green-400 font-mono text-sm">
                      [STATUS: DEKRYPTERET] ✓
                    </p>
                    <p className="text-green-300 mt-2">
                      Alle sikkerhedsprotokoller er gennemført. Information er nu tilgængelig.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HiddenPage3() {
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
      <HiddenPage3Content />
    </Suspense>
  );
}

