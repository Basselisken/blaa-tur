"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CrypticPage() {
  const router = useRouter();
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isChecking, setIsChecking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Map codes to their cryptic URLs
  const codeToUrlMap: { [key: string]: string } = {
    "K7X2-M9P4": "/x2k7m9p4",
    "B3N8-Q5W1": "/n8b3q5w1",
  };

  useEffect(() => {
    setIsMounted(true);
    
    // Cleanup interval on unmount
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  const handleCode1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    setCode1(value);
  };

  const handleCode2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    setCode2(value);
  };

  const handleDecode = async () => {
    setIsChecking(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/codes");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch codes");
      }

      const codes = data.codes;
      const codePair = `${code1}-${code2}`;
      const matchedCode = codes.find(
        (c: { code1: string; code2: string }) =>
          c.code1 === code1 && c.code2 === code2
      );

      if (matchedCode) {
        // Find the corresponding URL for this code
        const targetUrl = codeToUrlMap[codePair];
        if (targetUrl) {
          // Start countdown transition
          setIsRedirecting(true);
          setStatus({
            type: "success",
            message: "✓ KODER VERIFICERET - ADGANG TILLADT",
          });
          
          // Start countdown from 10
          setCountdown(10);
          
          // Countdown timer
          countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev === null || prev <= 1) {
                if (countdownIntervalRef.current) {
                  clearInterval(countdownIntervalRef.current);
                  countdownIntervalRef.current = null;
                }
                // Redirect after countdown
                const token = codePair.toLowerCase();
                router.push(`${targetUrl}?token=${token}`);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
          
          return;
        } else {
          setStatus({
            type: "success",
            message: "✓ KODER VERIFICERET - ADGANG TILLADT",
          });
        }
      } else {
        setStatus({
          type: "error",
          message: "✗ UGYLDIGE KODER - ADGANG NÆGTET",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "✗ SYSTEMFEJL - PRØV IGEN",
      });
      console.error("Error checking codes:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleReset = () => {
    setCode1("");
    setCode2("");
    setStatus({ type: null, message: "" });
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Redirecting overlay with countdown */}
      {isRedirecting && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8 text-green-400 text-2xl md:text-4xl font-bold animate-pulse">
              &gt; AUTHENTICATED
            </div>
            <div className="mb-4 text-green-500 text-lg md:text-xl">
              Sending you to a secure place in...
            </div>
            {countdown !== null && (
              <div className="text-green-400 text-8xl md:text-9xl font-bold animate-pulse">
                {countdown}
              </div>
            )}
            <div className="mt-8 text-green-600 text-sm">
              [TRANSFERRING TO SECURE LOCATION...]
            </div>
            {/* Animated dots */}
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Scanline effect */}
      <div className="cryptic-scanline"></div>
      {/* Animated background - code lines */}
      {isMounted && (
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 50 }).map((_, i) => {
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = 2 + Math.random() * 3;
            const text = Array.from({ length: 20 })
              .map(() => Math.random().toString(36).charAt(2))
              .join("");
            return (
              <div
                key={i}
                className="absolute text-xs text-green-400 animate-pulse"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              >
                {text}
              </div>
            );
          })}
        </div>
      )}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header with blinking cursor */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-green-400">$</span>
            <span className="animate-pulse">_</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-green-400">
            &gt; KRYPTOGRAFISK MODUL
          </h1>
          <div className="text-green-500 text-sm mb-2">
            [SYSTEM STATUS: AKTIV]
          </div>
          <div className="text-green-600 text-xs">
            [FORBINDELSE: SIKKER]
          </div>
        </div>

        {/* Code input interface */}
        <div className="bg-black border-2 border-green-500 rounded-lg p-8 mb-8 shadow-[0_0_20px_rgba(0,255,0,0.3)]">
          <div className="text-green-400 mb-6 text-lg">
            {`// INDTAST KODER`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Code 1 Section */}
            <div className="bg-gray-900 border-2 border-green-800 rounded-lg p-6">
              <div className="text-green-500 mb-4 text-sm font-semibold">
                KODE 1
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={code1}
                  onChange={handleCode1Change}
                  maxLength={4}
                  placeholder="XXXX"
                  className="w-full bg-black border-2 border-green-600 rounded-lg p-4 text-green-400 text-3xl font-bold text-center font-mono uppercase focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(0,255,0,0.5)] transition-all"
                />
                <div className="absolute top-2 right-2 text-green-600 text-xs">
                  {code1.length}/4
                </div>
              </div>
            </div>

            {/* Code 2 Section */}
            <div className="bg-gray-900 border-2 border-green-800 rounded-lg p-6">
              <div className="text-green-500 mb-4 text-sm font-semibold">
                KODE 2
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={code2}
                  onChange={handleCode2Change}
                  maxLength={4}
                  placeholder="XXXX"
                  className="w-full bg-black border-2 border-green-600 rounded-lg p-4 text-green-400 text-3xl font-bold text-center font-mono uppercase focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(0,255,0,0.5)] transition-all"
                />
                <div className="absolute top-2 right-2 text-green-600 text-xs">
                  {code2.length}/4
                </div>
              </div>
            </div>
          </div>

          {/* Status message */}
          {status.message && (
            <div
              className={`mb-6 p-4 rounded-lg border-2 font-bold text-center ${
                status.type === "success"
                  ? "bg-green-900 border-green-400 text-green-300"
                  : "bg-red-900 border-red-400 text-red-300"
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleDecode}
              disabled={
                code1.length !== 4 ||
                code2.length !== 4 ||
                isChecking
              }
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-black px-8 py-3 rounded font-bold transition-colors border-2 border-green-400 disabled:border-gray-700"
            >
              {isChecking ? "TJEKKER..." : "DEKODER"}
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-800 hover:bg-gray-700 text-green-400 px-8 py-3 rounded font-bold transition-colors border-2 border-green-800"
            >
              RESET
            </button>
          </div>
        </div>

        {/* Footer message */}
        <div className="mt-12 text-center text-green-600 text-sm">
          <div className="mb-2">[ADVARSEL: DETTE ER EN KLASSIFICERET SIDE]</div>
          <div>[KUN FOR AUTORISERET PERSONNEL]</div>
        </div>
      </div>
    </div>
  );
}

