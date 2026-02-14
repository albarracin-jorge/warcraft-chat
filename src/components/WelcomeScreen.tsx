import { useState, useRef, type FormEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/warcraftcn/card";
import { Button } from "@/components/ui/warcraftcn/button";
import { Input } from "@/components/ui/warcraftcn/input";
import "@/components/ui/warcraftcn/styles/warcraft.css";

interface WelcomeScreenProps {
  onEnter: (name: string) => void;
}

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onEnter(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center pt-8">
          <div className="text-5xl mb-2">⚔️</div>
          <CardTitle className="text-amber-200 text-2xl [text-shadow:0_0_12px_rgba(251,191,36,0.5)]">
            Warcraft Chat
          </CardTitle>
          <CardDescription className="text-amber-100/60 mt-1">
            Speak with Grom'thar, Warrior of the Horde
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label
                htmlFor="playerName"
                className="fantasy text-amber-200/80 text-sm block text-center"
              >
                Enter your name, warrior
              </label>
              <Input
                ref={inputRef}
                id="playerName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name..."
                className="text-center text-amber-100 placeholder:text-amber-700/50"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              variant="frame"
              className="w-full py-4 text-base"
              disabled={!name.trim()}
            >
              Enter the Chat — Lok'tar!
            </Button>
          </form>
        </CardContent>
        <div className="text-center pb-6 pt-2">
          <p className="fantasy text-amber-700/40 text-xs">
            "Victory or Death!"
          </p>
        </div>
      </Card>
    </div>
  );
}
