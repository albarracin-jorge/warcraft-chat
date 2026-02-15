import orcIcon from "@/assets/orc-icon.jpg";
import humanIcon from "@/assets/human-icon.jpg";
import trollIcon from "@/assets/trol-icon.jpg";
import dwarfIcon from "@/assets/dwarf-icon.jpg";

export type Race = "orc" | "human" | "troll" | "dwarf";
export type Faction = "horde" | "alliance";

export interface RaceInfo {
  id: Race;
  name: string;
  icon: string;
  faction: Faction;
  npcName: string;
  npcTitle: string;
  welcomeMessage: (playerName: string) => string;
}

export const RACES: Record<Race, RaceInfo> = {
  orc: {
    id: "orc",
    name: "Orc",
    icon: orcIcon,
    faction: "horde",
    npcName: "Grom'thar",
    npcTitle: "Warrior of the Horde",
    welcomeMessage: (playerName) =>
      `Lok'tar Ogar, ${playerName}! I am Grom'thar, warrior of the Horde. You stand before an Orc of honor. Speak your mind, whelp — but choose your words wisely. What brings you to my campfire?`,
  },
  human: {
    id: "human",
    name: "Human",
    icon: humanIcon,
    faction: "alliance",
    npcName: "Sir Aldric",
    npcTitle: "Paladin of Stormwind",
    welcomeMessage: (playerName) =>
      `By the Light! Welcome, ${playerName}. I am Sir Aldric Valorheart, paladin of Stormwind and servant of the Alliance. Speak freely, citizen — the Light guides our words and our deeds.`,
  },
  troll: {
    id: "troll",
    name: "Troll",
    icon: trollIcon,
    faction: "horde",
    npcName: "Zul'jin",
    npcTitle: "Witch Doctor of the Darkspear",
    welcomeMessage: (playerName) =>
      `Eh, what we got here? ${playerName}, ya say? Da spirits been whisperin' bout ya, mon. I be Zul'jin Shadowtusk, witch doctor of da Darkspear. Come, sit by da fire — but don't be touchin' me potions!`,
  },
  dwarf: {
    id: "dwarf",
    name: "Dwarf",
    icon: dwarfIcon,
    faction: "alliance",
    npcName: "Brannok",
    npcTitle: "Mountaineer of Ironforge",
    welcomeMessage: (playerName) =>
      `Well blow me beard off! ${playerName}, is it? Name's Brannok Ironforge, mountaineer of the Bronzebeard clan! Pull up a chair, grab a tankard, and tell ol' Brannok what's on yer mind, lad!`,
  },
};

export const RACE_LIST = Object.values(RACES);
