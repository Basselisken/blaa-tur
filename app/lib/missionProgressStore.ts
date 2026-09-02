import { promises as fs } from "fs";
import path from "path";
import type { AgentId, AgentProgress } from "./missions";

const FILE = path.join(process.cwd(), "data", "mission-progress.json");

export type ProgressFile = Record<AgentId, AgentProgress>;

const EMPTY: ProgressFile = {
  "king-carrot": {},
  "black-slug": {},
  benni: {},
  "agent-00": {},
};

let writeChain: Promise<void> = Promise.resolve();

async function readProgress(): Promise<ProgressFile> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<ProgressFile>;
    return {
      "king-carrot": parsed["king-carrot"] ?? {},
      "black-slug": parsed["black-slug"] ?? {},
      benni: parsed.benni ?? {},
      "agent-00": parsed["agent-00"] ?? {},
    };
  } catch {
    return structuredClone(EMPTY);
  }
}

async function writeProgress(data: ProgressFile) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
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
