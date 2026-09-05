import { NextResponse } from "next/server";
import {
  AGENT_IDS,
  AGENT_NAMES,
  SCOREBOARD_GUESTS,
  completedCountFor,
  missionTotalFor,
} from "../../../lib/missions";
import { getAllProgress } from "../../../lib/missionProgressStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const all = await getAllProgress();
  const scores = [
    ...AGENT_IDS.map((agentId) => ({
      agentId,
      name: AGENT_NAMES[agentId],
      completed: completedCountFor(agentId, all[agentId] ?? {}),
      total: missionTotalFor(agentId),
    })),
    ...SCOREBOARD_GUESTS,
  ].sort((a, b) => b.completed - a.completed || a.name.localeCompare(b.name));

  return NextResponse.json({ scores });
}
