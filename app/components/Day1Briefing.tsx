interface Day1BriefingProps {
  onOpenMissions?: () => void;
}

export default function Day1Briefing({ onOpenMissions }: Day1BriefingProps) {
  return (
    <div className="space-y-4 text-sm">
      <div className="text-green-600 text-xs tracking-widest">[TRANSMISSION — DAG 1]</div>
      <p className="text-green-300">God rejse, agent.</p>
      <p className="text-green-400 leading-relaxed">
        Forvent det uventede. Stol kun på denne kanal.
      </p>
      <p className="text-green-400 leading-relaxed">
        Jeres ordrer ligger ikke i denne briefing. Skift til fanen{" "}
        {onOpenMissions ? (
          <button
            type="button"
            onClick={onOpenMissions}
            className="text-green-300 font-bold tracking-widest underline decoration-green-700 underline-offset-4 hover:text-green-200"
          >
            MISSIONER
          </button>
        ) : (
          <span className="text-green-300 font-bold tracking-widest">MISSIONER</span>
        )}{" "}
        øverst for fælles og personlige missioner. De kan udføres alle dage vi er væk. Dokumentér
        alt — billeder, video, eller gør det, hvor andre ser jer.
      </p>
      <p className="text-green-700 text-xs tracking-widest">[STATUS: OPERATION I GANG]</p>
    </div>
  );
}
