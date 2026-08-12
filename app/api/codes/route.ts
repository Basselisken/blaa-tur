import { NextRequest, NextResponse } from "next/server";

const CODE_MAP: Record<string, { url: string; token: string }> = {
  "K7X2-M9P4": { url: "/x2k7m9p4", token: "k7x2-m9p4" },
  "B3N8-Q5W1": { url: "/n8b3q5w1", token: "b3n8-q5w1" },
  "R4T6-Y8Z9": { url: "/r4t6-y8z9", token: "r4t6-y8z9" },
  "P2L5-J8V3": { url: "/p2l5j8v3", token: "p2l5-j8v3" },
};

export async function POST(request: NextRequest) {
  try {
    const { code1, code2 } = await request.json();
    const key = `${code1}-${code2}`;
    const match = CODE_MAP[key];

    if (match) {
      return NextResponse.json({ valid: true, url: match.url, token: match.token });
    }

    return NextResponse.json({ valid: false });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
