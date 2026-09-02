export type AgentId = "king-carrot" | "black-slug" | "benni" | "agent-00";
export type AgentProgress = Record<string, boolean>;

export const AGENT_NAMES: Record<AgentId, string> = {
  "king-carrot": "KING CARROT",
  "black-slug": "BLACK SLUG",
  benni: "BENNI",
  "agent-00": "AGENT 00",
};

export const AGENT_IDS = Object.keys(AGENT_NAMES) as AgentId[];

export const AGENT_TOKENS: Record<string, AgentId> = {
  "k7x2-m9p4": "king-carrot",
  "b3n8-q5w1": "black-slug",
  "r4t6-y8z9": "benni",
  "p2l5-j8v3": "agent-00",
};

export function agentFromToken(token: string | null | undefined): AgentId | null {
  if (!token) return null;
  return AGENT_TOKENS[token] ?? null;
}

export function isValidMissionCode(agentId: AgentId, code: string): boolean {
  if (sharedMissions.some((mission) => mission.code === code)) return true;
  return personalMissions[agentId].some((mission) => mission.code === code);
}

export type Mission = {
  code: string;
  title: string;
  objective: string;
  notes?: string;
  secret?: boolean;
};

export const sharedMissionsCopy = {
  heading: "[FÆLLES MISSIONER]",
  subtitle: "Kan udføres alle dage vi er væk.",
  note: "Husk at dokumentation af missionsudførelse er vigtigt. Billeder / video / gør det, hvor andre ser jer udføre missionen.",
};

export const sharedMissions: Mission[] = [
  {
    code: "KLEMME",
    title: "Få en klemme",
    objective: "Få en klemme på en anden.",
  },
  {
    code: "LOKAL",
    title: "Lokal kontakt",
    objective: "Få et billede med en lokal.",
  },
  {
    code: "KODEORD",
    title: "Kodeord",
    objective: "Få en til at sige et bestemt ord.",
  },
  {
    code: "ALIAS",
    title: "Alias",
    objective: "Få en fremmed til at tro, du hedder noget andet.",
  },
  {
    code: "ØL-REK",
    title: "Lokal øl",
    objective: "Køb en lokal øl til smagning.",
  },
  {
    code: "REGNING",
    title: "Estisk regning",
    objective: "Bed om regningen på estisk.",
  },
  {
    code: "ICE",
    title: "ICE en modstander",
    objective: "ICE en modstander. Skriv bag på den, hvem den er fra.",
    notes: "Bonus- eller minuspoint hvis en udpeget person får den.",
  },
  {
    code: "MASTERMIND",
    title: "Mastermind",
    objective: "Få en anden agent til at gøre en bestemt ting.",
  },
  {
    code: "DROP",
    title: "Taske-drop",
    objective: "Gem noget i en anden agents taske.",
  },
  {
    code: "SPISER",
    title: "Spisefotos",
    objective: "Få 5 forskellige billeder af en bestemt agent, imens han spiser.",
  },
  {
    code: "DRIKKER",
    title: "Drikkefotos",
    objective: "Få 5 forskellige billeder af en bestemt agent, imens han drikker øl, drinks eller vin.",
  },
  {
    code: "MORGENMAD",
    title: "Morgenmad",
    objective: "Lav morgenmad.",
  },
  {
    code: "VERDENSMAND",
    title: "Verdensmand",
    objective: "Lav Krølles verdensmand-pose på mindst 5 forskellige billeder.",
  },
  {
    code: "SOLBRILLER",
    title: "Solbriller",
    objective: "Hav solbriller på, på mindst 5 forskellige billeder.",
  },
  {
    code: "MÆRKE",
    title: "Føretrøje-mærke",
    objective: "Skaf et mærke med Estland og/eller Tallinn til føretrøjen.",
  },
];

export const personalMissions: Record<AgentId, Mission[]> = {
  "king-carrot": [
    {
      code: "HØJDE-Ø",
      title: "Højde — agent Ø",
      objective: "Bed agent Ø om at hjælpe med at nå noget, der står lidt for højt. 5 gange.",
      notes: "Personlig mission. Kan udføres alle dage.",
    },
  ],
  "black-slug": [],
  benni: [],
  "agent-00": [],
};

export function missionTotalFor(agentId: AgentId): number {
  return sharedMissions.length + personalMissions[agentId].length;
}

export function completedCountFor(agentId: AgentId, progress: AgentProgress): number {
  const valid = new Set(
    [...sharedMissions, ...personalMissions[agentId]].map((mission) => mission.code)
  );
  return Object.entries(progress).filter(([code, done]) => done && valid.has(code)).length;
}
