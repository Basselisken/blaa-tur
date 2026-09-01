"use client";

import { useEffect, useState } from "react";

const SHOW_AT = new Date("2026-09-03T10:10:00+02:00"); // Warsaw Chopin landing
const HIDE_AT = new Date("2026-09-03T12:10:00+02:00"); // 2 hours — buffer for delays
const FORCE_SHOW = false;

function StatusRow({ label, value, urgent }: { label: string; value: string; urgent?: boolean }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-red-600 w-32 shrink-0">{label}</span>
      <span className={`font-bold ${urgent ? "text-red-200" : "text-red-300"}`}>{value}</span>
    </div>
  );
}

export default function CompromisedBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      setVisible(FORCE_SHOW || (now >= SHOW_AT && now < HIDE_AT));
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/75 backdrop-blur-sm">
      <div className="bg-red-950/95 border-2 border-red-500 rounded-lg shadow-[0_0_40px_rgba(255,0,0,0.5)] max-w-xl w-full font-mono overflow-hidden">
        <div className="bg-red-900/80 border-b border-red-500 px-4 py-2 flex items-center justify-between text-xs">
          <span className="text-red-400 animate-pulse tracking-widest">● FLASH TRANSMISSION</span>
          <span className="text-red-600 tracking-widest">PRIORITET: ALPHA</span>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-red-400 text-xl shrink-0">⚠</span>
              <h2 className="text-red-300 font-bold text-base md:text-lg tracking-wide uppercase">
                Mission kompromitteret
              </h2>
              <span className="text-red-400 text-xl shrink-0">⚠</span>
            </div>
            <p className="text-red-500 text-xs tracking-widest">
              NØDPROTOKOL AKTIVERET — ALLE AGENTER UNDER DÆKNING
            </p>
          </div>

          <div className="border border-red-800 rounded-lg p-4 space-y-2 bg-black/30">
            <StatusRow label="STATUS:" value="KOMPROMITTERET" urgent />
            <StatusRow label="TRUSSEL:" value="AKTIV OVERVÅGNING" urgent />
            <StatusRow label="TIDSFØLSOM:" value="JA — HANDLING NU" urgent />
            <StatusRow label="TIDLIGERE ORDRE:" value="ANNULLERET" />
          </div>

          <div className="space-y-3 text-sm leading-relaxed">
            <div>
              <div className="text-red-500 text-xs mb-1 tracking-widest">[DIREKTIV]</div>
              <p className="text-red-200">
                Jeres dækning er brudt. Ignorer alle tidligere instrukser og antag, at I er
                observeret. Bevæg jer straks og uden ophold mod den gate, hvorfra der afgår fly
                til Estlands hovedstad.
              </p>
            </div>

            <div>
              <div className="text-red-500 text-xs mb-1 tracking-widest">[MÅL]</div>
              <p className="text-red-200">
                Nyt safehouse er etableret i &apos;Tallinn&apos;. Det er jeres eneste sikre
                kontaktpunkt. Jeres handler vil tage over ved ankomst — vent ikke på yderligere
                bekræftelse.
              </p>
            </div>

            <div>
              <div className="text-red-500 text-xs mb-1 tracking-widest">[ADVARSEL]</div>
              <p className="text-red-300/80 text-xs">
                Undgå telefonisk kontakt. Tal ikke med ukendte. Følg kun denne kanal, indtil I er
                checket ind på safehouse.
              </p>
            </div>
          </div>

          <div className="border-t border-red-800 pt-4 text-center">
            <p className="text-red-600 text-xs tracking-widest animate-pulse">
              SKYND JER — FLYET VENTER IKKE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
