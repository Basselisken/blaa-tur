"use client";

export default function JulePage() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden flex items-center justify-center">
      {/* Subtle scan line effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 2px, rgba(0, 255, 0, 0.1) 4px)",
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-16 text-center">
        <div className="bg-black border-2 border-green-500 rounded-lg p-12 shadow-[0_0_30px_rgba(0,255,0,0.3)] max-w-2xl mx-auto">
          <div className="text-green-500 text-sm mb-6 animate-pulse">
            [BESKED DEKRYPTERET]
          </div>
          
          <p className="text-xl md:text-2xl text-green-300 mb-4">
            Hej Team Blå Tur!
          </p>
          <p className="text-lg md:text-xl text-green-300 mb-8">
            Vi glæder os til at arrangere turen i 2026!
          </p>
          <p className="text-lg md:text-xl text-green-300 mb-8">
            Glædelig Jul og Godt Nytår
          </p>
          <div className="mt-6 text-green-700 text-xs">
            [STATUS: JULESTEMNING AKTIVERET] ✓
          </div>
        </div>
      </div>
    </div>
  );
}

