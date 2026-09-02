import type { Mission } from "../lib/missions";
import MissionTable from "./MissionTable";

interface MissionSectionProps {
  heading: string;
  subtitle?: string;
  note?: string;
  missions: Mission[];
}

export default function MissionSection({ heading, subtitle, note, missions }: MissionSectionProps) {
  return (
    <div className="mb-8 border border-green-800 rounded-lg p-4 md:p-6">
      <div className="mb-4">
        <div className="text-green-600 text-sm">{heading}</div>
        {subtitle && <div className="text-green-800 text-xs mt-1">{subtitle}</div>}
        {note && <div className="text-green-500 text-xs mt-2 leading-relaxed">{note}</div>}
      </div>
      <MissionTable missions={missions} />
    </div>
  );
}
