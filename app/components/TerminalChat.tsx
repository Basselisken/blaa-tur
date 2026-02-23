"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ChatMessage {
  sender: string;
  text: string;
  timestamp: string;
}

interface TerminalChatProps {
  chatId: string;
  senderName: string;
  pollInterval?: number;
}

export default function TerminalChat({
  chatId,
  senderName,
  pollInterval = 3000,
}: TerminalChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageCount = useRef(0);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?chatId=${encodeURIComponent(chatId)}`);
      const data = await res.json();
      if (data.messages && data.messages.length !== lastMessageCount.current) {
        setMessages(data.messages);
        lastMessageCount.current = data.messages.length;
      }
    } catch {
      // silently retry on next poll
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, pollInterval);
    return () => clearInterval(interval);
  }, [fetchMessages, pollInterval]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, sender: senderName, text: trimmed }),
      });
      if (res.ok) {
        await fetchMessages();
      }
    } catch {
      // message failed, user can retry
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString("da-DK", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  let lastDate = "";

  return (
    <div className="bg-black border-2 border-green-500 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.2)] overflow-hidden">
      {/* Title bar */}
      <div className="bg-gray-900 border-b border-green-800 px-4 py-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-600"></div>
        <div className="w-3 h-3 rounded-full bg-green-800"></div>
        <div className="w-3 h-3 rounded-full bg-green-800"></div>
        <span className="ml-4 text-green-600 text-xs">
          CHAT — {chatId.toUpperCase()} — {senderName.toUpperCase()}
        </span>
      </div>

      {/* Messages area */}
      <div className="p-4 h-80 overflow-y-auto text-left">
        {isLoading ? (
          <div className="text-green-600 animate-pulse">
            FORBINDER TIL CHAT...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-green-700 text-sm">
            {`// Ingen beskeder endnu. Skriv den første!`}
          </div>
        ) : (
          messages.map((msg, i) => {
            const msgDate = formatDate(msg.timestamp);
            const showDate = msgDate !== lastDate;
            lastDate = msgDate;

            const isOwnMessage = msg.sender === senderName;

            return (
              <div key={i}>
                {showDate && (
                  <div className="text-center my-3">
                    <span className="text-green-800 text-xs">
                      ── {msgDate} ──
                    </span>
                  </div>
                )}
                <div className="flex gap-2 mb-2">
                  <span className="text-green-700 text-xs shrink-0 pt-0.5 w-12">
                    {formatTime(msg.timestamp)}
                  </span>
                  <span
                    className={`shrink-0 font-bold ${
                      isOwnMessage ? "text-green-400" : "text-emerald-300"
                    }`}
                  >
                    {msg.sender}:
                  </span>
                  <span className="text-green-300 break-words">
                    {msg.text}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-green-800 p-3">
        <div className="flex items-center gap-2">
          <span className="text-green-500 shrink-0">{senderName} $</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder={isSending ? "Sender..." : "Skriv en besked..."}
            className="flex-1 bg-transparent border-none text-green-400 font-mono focus:outline-none focus:ring-0 placeholder-green-800"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="text-green-400 animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}
