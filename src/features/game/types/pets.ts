import Decimal from "decimal.js-light";
import { Decoration } from "./decorations";
import { GameState, InventoryItemName } from "./game";

export type PetName =
  | "Barkley"
  | "Meowchi"
  | "Twizzle"
  | "Burro"
  | "Mudhorn"
  | "Nibbles"
  | "Waddles"
  | "Ramsey";

export type Pet = {
  cravings?: InventoryItemName[];
  readyAt?: number;
  level?: number;
  multiplier?: number;
};

export type PetConfig = {
  fetches: { name: PetResource; level: number }[];
};

export const PETS: Record<PetName, PetConfig> = {
  Barkley: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Chewed Bone" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Frost Pebble" },
    ],
  },

  Burro: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Ruffroot" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Wild Grass" },
    ],
  },
  Twizzle: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Heart leaf" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Ribbon" },
    ],
  },
  Meowchi: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Ribbon" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Chewed Bone" },
    ],
  },
  Mudhorn: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Wild Grass" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Dewberry" },
    ],
  },
  Nibbles: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Dewberry" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Ruffroot" },
    ],
  },
  Waddles: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Frost Pebble" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Heart leaf" },
    ],
  },
  // NFT placeholder for testing
  Ramsey: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Moonfur" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Ribbon" },
      { level: 25, name: "Heart leaf" },
    ],
  },
};

export type PetResource =
  | "Acorn"
  | "Ruffroot"
  | "Chewed Bone"
  | "Heart leaf"
  | "Frost Pebble"
  | "Wild Grass"
  | "Ribbon"
  | "Dewberry"
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

  "Frost Pebble": {
    cooldownMs: 12 * 60 * 60 * 1000,
  },
  "Wild Grass": {
    cooldownMs: 12 * 60 * 60 * 1000,
  },
  Ribbon: {
    cooldownMs: 12 * 60 * 60 * 1000,
  },
  Dewberry: {
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
  | "Mole Shrine" // Crimstone
  | "Bear Shrine" // Honey
  | "Tortoise Shrine" // Greenhouse
  | "Moth Shrine" // Flower
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
  "Mole Shrine": {
    name: "Mole Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(5),
      "Frost Pebble": new Decimal(5),
      "Wild Grass": new Decimal(5),
    },
  },

  "Bear Shrine": {
    name: "Bear Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(5),
      Dewberry: new Decimal(5),
      "Wild Grass": new Decimal(5),
    },
  },

  "Tortoise Shrine": {
    name: "Tortoise Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(5),
      Ribbon: new Decimal(5),
      "Frost Pebble": new Decimal(5),
    },
  },

  "Moth Shrine": {
    name: "Moth Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(5),
      Dewberry: new Decimal(5),
      Ribbon: new Decimal(5),
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
