import type { AgentId, AgentProgress } from "./missions";

const REMOTE_NS = process.env.MISSION_STORE_NS ?? "blaa-tur-71ea1d12";
const REMOTE_KEY =
  process.env.MISSION_STORE_KEY ?? "a76a53cedfef97088a4731f1bf20061527154949e7821ac920f25b7f92311b00";
const REMOTE_URL = `https://mantledb.sh/v2/${REMOTE_NS}/progress`;

export type ProgressFile = Record<AgentId, AgentProgress>;

const EMPTY: ProgressFile = {
  "king-carrot": {},
  "black-slug": {},
  benni: {},
  "agent-00": {},
};

let writeChain: Promise<void> = Promise.resolve();

function normalize(parsed: Partial<ProgressFile> | null | undefined): ProgressFile {
  return {
    "king-carrot": parsed?.["king-carrot"] ?? {},
    "black-slug": parsed?.["black-slug"] ?? {},
    benni: parsed?.benni ?? {},
    "agent-00": parsed?.["agent-00"] ?? {},
  };
}

async function readProgress(): Promise<ProgressFile> {
  const response = await fetch(REMOTE_URL, {
    headers: { "X-Mantle-Key": REMOTE_KEY },
    cache: "no-store",
  });

  if (response.status === 404) {
    return structuredClone(EMPTY);
  }

  if (!response.ok) {
    throw new Error(`progress read failed (${response.status})`);
  }

  return normalize((await response.json()) as Partial<ProgressFile>);
}

async function writeProgress(data: ProgressFile) {
  const response = await fetch(REMOTE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Mantle-Key": REMOTE_KEY,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`progress write failed (${response.status})`);
  }
}

export async function getAllProgress(): Promise<ProgressFile> {
  return readProgress();
}

export async function getAgentProgress(agentId: AgentId): Promise<AgentProgress> {
  const all = await readProgress();
  return all[agentId] ?? {};
}

export function setMissionDone(agentId: AgentId, code: string, done: boolean): Promise<AgentProgress> {
  const run = async () => {
    const all = await readProgress();
    const current = { ...(all[agentId] ?? {}) };
    if (done) {
      current[code] = true;
    } else {
      delete current[code];
    }
    all[agentId] = current;
    await writeProgress(all);
    return current;
  };

  const next = writeChain.then(run, run);
  writeChain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}
