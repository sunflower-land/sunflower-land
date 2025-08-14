import Decimal from "decimal.js-light";
import { Decoration } from "./decorations";
import { GameState, InventoryItemName } from "./game";

export type PetName = "Barkley" | "Meowchi" | "Twizzle" | "Burro";

export type Pet = {
  cravings?: InventoryItemName[];
  readyAt?: number;
  level?: number;
  multiplier?: number;
};

export type PetConfig = {
  fetches: PetResource[];
};

export const PETS: Record<PetName, PetConfig> = {
  Barkley: {
    fetches: ["Acorn", "Chewed Bone", "Fossil Shell"],
  },

  Burro: {
    fetches: ["Acorn", "Ruffroot", "Fossil Shell"],
  },
  Twizzle: {
    fetches: ["Acorn", "Heart leaf", "Fossil Shell"],
  },
  Meowchi: {
    fetches: ["Acorn", "Moonfur", "Fossil Shell"],
  },
};

export type PetResource =
  | "Acorn"
  | "Ruffroot"
  | "Chewed Bone"
  | "Heart leaf"
  | "Moonfur"
  | "Fossil Shell";

export const PET_RESOURCES: Record<PetResource, { cooldownMs: number }> = {
  Acorn: {
    cooldownMs: 12 * 60 * 60 * 1000,
  },
  Ruffroot: {
    cooldownMs: 12 * 60 * 60 * 1000,
  },
  "Chewed Bone": {
    cooldownMs: 12 * 60 * 60 * 1000,
  },
  "Heart leaf": {
    cooldownMs: 12 * 60 * 60 * 1000,
  },
  Moonfur: {
    cooldownMs: 12 * 60 * 60 * 1000,
  },
  "Fossil Shell": {
    cooldownMs: 24 * 60 * 60 * 1000,
  },
};

export type PetShrineName =
  | "Fox Shrine" // Crafting
  | "Boar Shrine" // Food
  | "Hound Shrine" // Pets
  | "Stag Shrine" // Oil
  | "Legendary Shrine"; // Bonus yields

export type PetShrine = Omit<Decoration, "name"> & {
  name: PetShrineName;
  level?: number;
};

export const PET_SHRINES: Record<PetShrineName, PetShrine> = {
  "Fox Shrine": {
    name: "Fox Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(5),
      Ruffroot: new Decimal(5),
      "Chewed Bone": new Decimal(5),
    },
  },
  "Boar Shrine": {
    name: "Boar Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(5),
      "Chewed Bone": new Decimal(5),
      "Heart leaf": new Decimal(5),
    },
  },
  "Hound Shrine": {
    name: "Hound Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
    },
  },
  "Stag Shrine": {
    name: "Stag Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(5),
      "Heart leaf": new Decimal(5),
      Ruffroot: new Decimal(5),
    },
  },
  "Legendary Shrine": {
    name: "Legendary Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Obsidian: new Decimal(1),
      Moonfur: new Decimal(10),
      Acorn: new Decimal(10),
    },
  },
};

export const PET_NEGLECT_THRESHOLD = 3 * 24 * 60 * 60 * 1000;

export function msTillNeglect({
  pet,
  now = Date.now(),
}: {
  pet?: Pet;
  now?: number;
}) {
  if (!pet?.readyAt) return 0;

  const neglectedAt = pet.readyAt + PET_NEGLECT_THRESHOLD;
  return neglectedAt - now;
}

export function isPetNeglected({
  pet,
  game,
  now = Date.now(),
}: {
  pet?: Pet;
  game: GameState;
  now?: number;
}) {
  if (!pet?.readyAt) return false;
  return msTillNeglect({ pet, now }) <= 0;
}
