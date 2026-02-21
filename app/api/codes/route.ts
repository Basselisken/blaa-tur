import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "codes.md");
    const fileContents = await readFile(filePath, "utf-8");
    
    // Parse codes from the markdown file
    // Format: 1234-5678 (one per line)
    const lines = fileContents.split("\n");
    const codes = lines
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("-"))
      .map((line) => {
        const [code1, code2] = line.split("-");
        return { code1: code1.trim(), code2: code2.trim() };
      });

    return NextResponse.json({ codes });
  } catch (error) {
    console.error("Error reading codes:", error);
    return NextResponse.json(
      { error: "Failed to read codes" },
      { status: 500 }
    );
  }
}

