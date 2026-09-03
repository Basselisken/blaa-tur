import { NextRequest, NextResponse } from "next/server";
import { agentFromToken, isValidMissionCode } from "../../../lib/missions";
import { getAgentProgress, setMissionDone } from "../../../lib/missionProgressStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const agentId = agentFromToken(request.nextUrl.searchParams.get("token"));
  if (!agentId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const progress = await getAgentProgress(agentId);
  return NextResponse.json({ progress });
}

export async function POST(request: NextRequest) {
  let body: { token?: unknown; code?: unknown; done?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { token, code, done } = body;
  const agentId = agentFromToken(typeof token === "string" ? token : null);

  if (!agentId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (typeof code !== "string" || typeof done !== "boolean" || !isValidMissionCode(agentId, code)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  try {
    const progress = await setMissionDone(agentId, code, done);
    return NextResponse.json({ progress });
  } catch {
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
