import { NextResponse } from "next/server";

const CODES = [
  { code1: "K7X2", code2: "M9P4" },
  { code1: "B3N8", code2: "Q5W1" },
  { code1: "R4T6", code2: "Y8Z9" },
  { code1: "P2L5", code2: "J8V3" },
];

export async function GET() {
  return NextResponse.json({ codes: CODES });
}
