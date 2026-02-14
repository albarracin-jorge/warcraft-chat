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
import { RACES, type Race } from "@/lib/races";
import "@/components/ui/warcraftcn/styles/warcraft.css";

interface ChatViewProps {
  playerName: string;
  playerRace: Race;
  chatRace: Race;
  csrfToken: string | null;
  onBack: () => void;
}

function getMessageText(msg: { parts: Array<{ type: string; text?: string }> }): string {
  return msg.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}

export function ChatView({ playerName, playerRace, chatRace, onBack, csrfToken }: ChatViewProps) {
  const npc = RACES[chatRace];
  const player = RACES[playerRace];

  const transport = csrfToken
    ? new DefaultChatTransport({
        api: "/api/chat",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: { race: chatRace },
      })
    : null;

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: transport ?? new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  // Set initial welcome message based on NPC race
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text" as const,
            text: npc.welcomeMessage(playerName),
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

  const factionColor = npc.faction === "horde"
    ? { bg: "bg-red-950/40", text: "text-red-100", border: "border-red-800/30", accent: "text-red-300/60" }
    : { bg: "bg-blue-950/40", text: "text-blue-100", border: "border-blue-800/30", accent: "text-blue-300/60" };

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
        <div className="flex items-center gap-2">
          <img
            src={player.icon}
            alt={player.name}
            className="w-8 h-8 rounded-full border-2 border-amber-600/50 object-cover"
          />
          <Badge variant="default" size="lg" faction={player.faction}>
            ⚔ {playerName}
          </Badge>
        </div>
      </div>

      {/* Chat Card */}
      <Card className="w-full max-w-2xl flex flex-col" style={{ height: "70vh" }}>
        <CardHeader className="pt-6 pb-2">
          <div className="flex items-center justify-center gap-3">
            <img
              src={npc.icon}
              alt={npc.name}
              className="w-10 h-10 rounded-full border-2 border-amber-600/50 object-cover"
            />
            <CardTitle className="text-amber-200 text-center text-lg [text-shadow:0_0_10px_rgba(251,191,36,0.4)]">
              ⚔ {npc.npcName} — {npc.npcTitle} ⚔
            </CardTitle>
          </div>
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
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* NPC icon on the left */}
                  {!isUser && (
                    <img
                      src={npc.icon}
                      alt={npc.name}
                      className="w-8 h-8 rounded-full border border-amber-700/40 object-cover shrink-0 mb-1"
                    />
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "bg-amber-900/40 text-amber-100 border border-amber-700/30 rounded-br-none"
                        : `${factionColor.bg} ${factionColor.text} border ${factionColor.border} rounded-bl-none`
                    }`}
                  >
                    <div className="font-bold text-xs mb-1 opacity-70 fantasy">
                      {isUser ? playerName : npc.npcName}
                    </div>
                    <p className="whitespace-pre-wrap fantasy">{text}</p>
                  </div>
                  {/* Player icon on the right */}
                  {isUser && (
                    <img
                      src={player.icon}
                      alt={player.name}
                      className="w-8 h-8 rounded-full border border-amber-700/40 object-cover shrink-0 mb-1"
                    />
                  )}
                </div>
              );
            })}

            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-end gap-2 justify-start">
                  <img
                    src={npc.icon}
                    alt={npc.name}
                    className="w-8 h-8 rounded-full border border-amber-700/40 object-cover shrink-0 mb-1"
                  />
                  <div className={`max-w-[75%] rounded-lg px-4 py-3 text-sm ${factionColor.bg} ${factionColor.text} border ${factionColor.border} rounded-bl-none`}>
                    <div className="font-bold text-xs mb-1 opacity-70 fantasy">
                      {npc.npcName}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="animate-pulse">⚔</span>
                      <span className={`fantasy ${factionColor.accent} text-xs italic`}>
                        {npc.npcName} is thinking...
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
              placeholder={`Speak to ${npc.npcName}...`}
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
