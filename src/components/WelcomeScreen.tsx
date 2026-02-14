import { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/warcraftcn/card";
import { Button } from "@/components/ui/warcraftcn/button";
import { Input } from "@/components/ui/warcraftcn/input";
import { RACE_LIST, type Race } from "@/lib/races";
import "@/components/ui/warcraftcn/styles/warcraft.css";
import { Footer } from "./Footer";

interface WelcomeScreenProps {
  onEnter: (name: string, playerRace: Race, chatRace: Race) => void;
}

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const [name, setName] = useState("");
  const [playerRace, setPlayerRace] = useState<Race>("orc");
  const [chatRace, setChatRace] = useState<Race>("orc");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      onEnter(name.trim(), playerRace, chatRace);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen md:p-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center pt-8">
          <div className="text-5xl mb-2 mx-auto"><img src='/wow.svg' alt="" /></div>
          <CardTitle className="text-yellow-200 text-2xl [text-shadow:0_0_12px_rgba(251,191,36,0.5)]">
            Warcraft Chat
          </CardTitle>
          <CardDescription className="text-amber-100/60 mt-1">
            Choose your identity and who to speak with
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2 flex flex-col justify-center">
              <label
                htmlFor="playerName"
                className="fantasy text-yellow-200/80 text-sm block text-center"
              >
                Enter your name, warrior
              </label>
              <Input
                ref={inputRef}
                id="playerName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name..."
                className="text-center text-amber-100 placeholder:text-yellow-200/75 bg-neutral-950"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="fantasy text-yellow-200/80 text-sm block text-center">
                Your avatar
              </label>
              <div className="flex justify-center gap-3">
                {RACE_LIST.map((race) => (
                  <button
                    key={race.id}
                    type="button"
                    onClick={() => setPlayerRace(race.id)}
                    className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all cursor-pointer ${
                      playerRace === race.id
                        ? "ring-2 ring-blue-400 bg-blue-900/40 scale-110"
                        : "opacity-50 hover:opacity-80 hover:bg-blue-900/20"
                    }`}
                  >
                    <img
                      src={race.icon}
                      alt={race.name}
                      className="w-12 h-12 rounded-full border-2 border-amber-700/50 object-cover"
                    />
                    <span className="fantasy text-yellow-200/80 text-[10px]">
                      {race.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="fantasy text-yellow-200/80 text-sm block text-center">
                Speak with
              </label>
              <div className="flex justify-center gap-3">
                {RACE_LIST.map((race) => (
                  <button
                    key={race.id}
                    type="button"
                    onClick={() => setChatRace(race.id)}
                    className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all cursor-pointer ${
                      chatRace === race.id
                        ? "ring-2 ring-red-400 bg-red-900/40 scale-110"
                        : "opacity-50 hover:opacity-80 hover:bg-red-900/20"
                    }`}
                  >
                    <img
                      src={race.icon}
                      alt={race.name}
                      className="w-12 h-12 rounded-full border-2 border-red-700/50 object-cover"
                    />
                    <span className="fantasy text-yellow-200/80 text-[10px]">
                      {race.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="frame"
              className="w-full py-4 text-sm md:text-base"
              disabled={!name.trim()}
            >
              Enter the Chat — Lok'tar!
            </Button>
          </form>
        </CardContent>
        <div className="text-center pb-10">
          <p className="fantasy text-amber-200/70 text-xs">
            "Victory or Death!"
          </p>
        </div>
      </Card>
      <Footer/>
    </div>
  );
}
