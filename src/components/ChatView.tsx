import { useState, useRef, useEffect, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/warcraftcn/card";
import { Button } from "@/components/ui/warcraftcn/button";
import { Input } from "@/components/ui/warcraftcn/input";
import { Badge } from "@/components/ui/warcraftcn/badge";
import "@/components/ui/warcraftcn/styles/warcraft.css";

interface ChatViewProps {
  playerName: string;
  csrfToken: string | null;
  onBack: () => void;
}

function getMessageText(msg: { parts: Array<{ type: string; text?: string }> }): string {
  return msg.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}

export function ChatView({ playerName, onBack, csrfToken }: ChatViewProps) {

  const transport = csrfToken
    ? new DefaultChatTransport({
        api: "/api/chat",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
      })
    : null;

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: transport ?? new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  // Set initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text" as const,
            text: `Lok'tar Ogar, ${playerName}! I am Grom'thar, warrior of the Horde. You stand before an Orc of honor. Speak your mind, whelp — but choose your words wisely. What brings you to my campfire?`,
          },
        ],
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="w-full max-w-2xl mb-4 flex items-center justify-between">
        <Button
          variant="frame"
          className="px-4 py-2 text-xs"
          onClick={onBack}
        >
          ← Leave
        </Button>
        <Badge variant="default" size="lg" faction="horde">
          ⚔ {playerName}
        </Badge>
      </div>

      {/* Chat Card */}
      <Card className="w-full max-w-2xl flex flex-col" style={{ height: "70vh" }}>
        <CardHeader className="pt-6 pb-2">
          <CardTitle className="text-amber-200 text-center text-lg [text-shadow:0_0_10px_rgba(251,191,36,0.4)]">
            ⚔ Grom'thar — Warrior of the Horde ⚔
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden px-2">
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto pr-2 space-y-3"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(180,130,50,0.4) transparent",
            }}
          >
            {messages.map((msg) => {
              const text = getMessageText(msg);
              if (!text) return null;
              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-amber-900/40 text-amber-100 border border-amber-700/30 rounded-br-none"
                        : "bg-red-950/40 text-red-100 border border-red-800/30 rounded-bl-none"
                    }`}
                  >
                    <div className="font-bold text-xs mb-1 opacity-70 fantasy">
                      {msg.role === "user" ? playerName : "🪓 Grom'thar"}
                    </div>
                    <p className="whitespace-pre-wrap fantasy">{text}</p>
                  </div>
                </div>
              );
            })}

            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-3 text-sm bg-red-950/40 text-red-100 border border-red-800/30 rounded-bl-none">
                    <div className="font-bold text-xs mb-1 opacity-70 fantasy">
                      🪓 Grom'thar
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="animate-pulse">⚔</span>
                      <span className="fantasy text-red-300/60 text-xs italic">
                        The Orc is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {error && (
              <div className="flex justify-center">
                <div className="bg-red-950/60 border border-red-500/40 rounded-lg px-4 py-2 text-red-300 text-xs fantasy text-center">
                  ⚠ The dark magic has failed: {error.message}
                  <br />
                  <span className="text-red-400/60">
                    Check your API key in .env
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-3">
          <form onSubmit={onSubmit} className="flex w-full gap-2 items-center">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak to the Orc..."
              className="flex-1 text-amber-100 placeholder:text-amber-700/60"
              disabled={isLoading}
              autoFocus
            />
            <Button
              type="submit"
              variant="frame"
              className="px-6 py-3 shrink-0"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? "..." : "Send"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
