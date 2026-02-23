import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";

interface ChatMessage {
  sender: string;
  text: string;
  timestamp: string;
}

function getChatFilePath(chatId: string): string {
  const sanitized = chatId.replace(/[^a-zA-Z0-9_-]/g, "");
  return join(process.cwd(), "data", `chat-${sanitized}.json`);
}

async function ensureDataDir() {
  const dataDir = join(process.cwd(), "data");
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

export async function GET(request: NextRequest) {
  try {
    const chatId = request.nextUrl.searchParams.get("chatId");
    if (!chatId) {
      return NextResponse.json({ error: "chatId required" }, { status: 400 });
    }

    const filePath = getChatFilePath(chatId);

    if (!existsSync(filePath)) {
      return NextResponse.json({ messages: [] });
    }

    const contents = await readFile(filePath, "utf-8");
    const messages: ChatMessage[] = JSON.parse(contents);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error reading chat:", error);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { chatId, sender, text } = await request.json();

    if (!chatId || !sender || !text) {
      return NextResponse.json(
        { error: "chatId, sender, and text are required" },
        { status: 400 }
      );
    }

    await ensureDataDir();
    const filePath = getChatFilePath(chatId);

    let messages: ChatMessage[] = [];
    if (existsSync(filePath)) {
      const contents = await readFile(filePath, "utf-8");
      messages = JSON.parse(contents);
    }

    const newMessage: ChatMessage = {
      sender,
      text,
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);
    await writeFile(filePath, JSON.stringify(messages, null, 2), "utf-8");

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error("Error writing chat:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
