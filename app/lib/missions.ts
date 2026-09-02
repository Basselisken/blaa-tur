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
  note: "Husk at dokumentation af missionsudførelse er vigtigt. Billeder / video / gør det, hvor andre ser jer udføre missionen. Tjek missionerne af som de udføres — vi tjekker til sidst, så ingen grund til at prøve at snyde.",
};

export const sharedMissions: Mission[] = [
  {
    code: "KLEMME",
    title: "Få en klemme",
    objective: "Få en klemme på en anden.",
    notes: "Klemmen skal sidde på en anden agent i minimum én time før missionen er gennemført.",
  },
  {
    code: "LOKAL",
    title: "Lokal kontakt",
    objective: "Få et billede med en lokal.",
  },
  {
    code: "ALIAS",
    title: "Alias",
    objective: "Få en fremmed til at tro, du hedder noget andet.",
  },
  {
    code: "REGNING",
    title: "Lokal regning",
    objective: "Bed om regningen på det lokale sprog.",
  },
  {
    code: "ICE-1",
    title: "ICE en modstander #1",
    objective: "ICE en modstander. Skriv bag på den, hvem den er fra.",
    notes: "Brug udleveret labels — vælg et target og skriv på det udleverede label. Kun points hvis det er det rigtige target der finder icen først. Icen skal stadig drikkes hvis ikke det er den rigtige der finder den, så giver den bare ikke points.",
  },
  {
    code: "ICE-2",
    title: "ICE en modstander #2",
    objective: "ICE en modstander. Skriv bag på den, hvem den er fra.",
    notes: "Brug udleveret labels — vælg et target og skriv på det udleverede label. Kun points hvis det er det rigtige target der finder icen først. Icen skal stadig drikkes hvis ikke det er den rigtige der finder den, så giver den bare ikke points.",
  },
  {
    code: "MORGENMAD-FRE",
    title: "Morgenmad — fredag",
      objective: "Lav morgenmad — Fredag.",
  },
  {
    code: "MORGENMAD-LOR",
    title: "Morgenmad - Lørdag",
    objective: "Lav morgenmad — Lørdag.",
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
    {
      code: "DRIKKER",
      title: "Drikkefotos",
      objective: "Få 5 forskellige billeder af en bestemt agent, imens han drikker øl, drinks eller vin.",
    },
    {
      code: "MÆRKE",
      title: "Føretrøje-mærke",
      objective: "Køb dette års mærke til føretrøjen.",
    },
  ],
  "black-slug": [
    {
      code: "SPISER",
      title: "Spisefotos",
      objective: "Få 5 forskellige billeder af en bestemt agent, imens han spiser. Du vælger selv hvilken agent.",
    },
    {
      code: "ROR",
      title: "Ror på lokalt sprog",
      objective: "Fortæl en lokal at du ror — på det lokale sprog.",
    },
    {
      code: "HANDJERN",
      title: "Estiske håndjern",
      objective: "Når der bliver bestilt en omgang drikkelse — bestil 2 til dig selv. Shots gælder ikke.",
    },
  ],
  benni: [
    {
      code: "VERDENSMAND",
      title: "Verdensmand",
      objective: "Lav Krølles verdensmand-pose på mindst 5 forskellige billeder.",
    },
    {
      code: "TOILET",
      title: "Toilet på lokalt sprog",
      objective: "Spørg efter toilettet på det lokale sprog.",
    },
    {
      code: "GODNAT",
      title: "Godnat hilsen",
      objective: "Send en personlig godnat hilsen til hver agent inden du går i seng hver aften.",
    },
  ],
  "agent-00": [
    {
      code: "SOLBRILLER",
      title: "Solbriller",
      objective: "Hav solbriller på, på mindst 5 forskellige billeder.",
    },
    {
      code: "FUNFACTS",
      title: "Falske fun-facts",
      objective: "Kom med minimum 3 falske fun-facts omkring de lokale seværdigheder vi ser.",
    },
    {
      code: "ÆNDER",
      title: "Gem ænder",
      objective: "Gem 5 ænder i de andre agenters ejendele — tasker, tøj etc.",
      notes: "Hvis bare én enkelt and bliver fundet er missionen mislykkedes.",
    },
  ],
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
