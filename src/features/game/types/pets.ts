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
  cravings?: {
    name: InventoryItemName;
    completedAt?: number;
    energy?: number;
  }[];
  readyAt?: number;
  level?: number;
  multiplier?: number;
  pettedAt?: number;
  experience?: number;
  energy?: number;
};

export const PET_FOOD_EXPERIENCE = 100;
export const PET_PET_EXPERIENCE = 10;

export const PET_EXPERIENCE: Record<number, number> = {
  1: 0,
  2: 120,
  3: 300,
  4: 600,
  5: 1000,
  6: 1500,
  7: 2100,
  8: 2800,
  9: 3600,
  10: 4500,
  11: 5500,
  12: 6600,
  13: 7800,
  14: 9100,
  15: 10500,
  16: 12000,
  17: 13600,
  18: 15300,
  19: 17100,
  20: 19000,
  21: 21000,
  22: 23100,
  23: 25300,
  24: 27600,
  25: 30000,
  26: 32500,
  27: 35100,
  28: 37800,
  29: 40600,
  30: 43500,
  31: 46500,
  32: 49600,
  33: 52800,
  34: 56100,
  35: 59500,
  36: 63000,
  37: 66600,
  38: 70300,
  39: 74100,
  40: 78000,
  41: 82000,
  42: 86100,
  43: 90300,
  44: 94600,
  45: 99000,
  46: 103500,
  47: 108100,
  48: 112800,
  49: 117600,
  50: 122500,
};

export function getPetExperience(pet: Pet): number {
  if (!pet) return 0;
  let experience = pet.experience ?? 0;

  // Old pets did not have XP
  if (!experience && (pet.level ?? 1) > 1) {
    experience = (pet.level ?? 1) * PET_FOOD_EXPERIENCE;
  }

  return experience;
}

export function getPetLevel(pet?: Pet): number {
  if (!pet) return 1;

  const experience = getPetExperience(pet);

  // Find the level that the pet has
  let level = 1;
  for (const [levelNumber, xpThreshold] of Object.entries(PET_EXPERIENCE)) {
    if (experience >= xpThreshold) {
      level = Number(levelNumber) as number;
    } else {
      break;
    }
  }

  return level;
}

export type PetConfig = {
  fetches: { name: PetResource; level: number }[];
};

export function petLevelProgress(pet?: Pet): {
  xpLeft: number;
  xpPercentage: number;
} {
  if (!pet) return { xpLeft: PET_EXPERIENCE[2], xpPercentage: 0 };

  const level = getPetLevel(pet);
  const xpThreshold = PET_EXPERIENCE[level + 1];
  const xpLeft = xpThreshold - getPetExperience(pet);
  const xpPercentage =
    100 - (xpLeft / (xpThreshold - PET_EXPERIENCE[level])) * 100;
  return { xpLeft, xpPercentage };
}

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

export const PET_RESOURCES: Record<
  PetResource,
  { cooldownMs: number; energy: number }
> = {
  Acorn: {
    cooldownMs: 12 * 60 * 60 * 1000,
    energy: 100,
  },
  Ruffroot: {
    cooldownMs: 12 * 60 * 60 * 1000,
    energy: 150,
  },
  "Chewed Bone": {
    cooldownMs: 12 * 60 * 60 * 1000,
    energy: 150,
  },
  "Heart leaf": {
    cooldownMs: 12 * 60 * 60 * 1000,
    energy: 150,
  },
  Moonfur: {
    cooldownMs: 12 * 60 * 60 * 1000,
    energy: 150,
  },

  "Frost Pebble": {
    cooldownMs: 12 * 60 * 60 * 1000,
    energy: 150,
  },
  "Wild Grass": {
    cooldownMs: 12 * 60 * 60 * 1000,
    energy: 150,
  },
  Ribbon: {
    cooldownMs: 12 * 60 * 60 * 1000,
    energy: 150,
  },
  Dewberry: {
    cooldownMs: 12 * 60 * 60 * 1000,
    energy: 150,
  },
  "Fossil Shell": {
    cooldownMs: 24 * 60 * 60 * 1000,
    energy: 250,
  },
};

export type PetShrineName =
  | "Fox Shrine" // Crafting
  | "Hound Shrine" // Pets
  | "Boar Shrine" // Cooking
  | "Sparrow Shrine" // Crops
  | "Toucan Shrine" // Fruit
  | "Collie Shrine" // Animals
  | "Badger Shrine" // Trees & Stones
  | "Stag Shrine" // Oil
  | "Mole Shrine" // Crimstone, Gold & Iron
  | "Bear Shrine" // Honey
  | "Tortoise Shrine" // Greenhouse + Crop Machine
  | "Moth Shrine" // Flower
  | "Legendary Shrine"; // Bonus yields

export type PetShrine = Omit<Decoration, "name"> & {
  name: PetShrineName;
  level?: number;
};

export const PET_SHRINES: Record<PetShrineName, PetShrine> = {
  "Boar Shrine": {
    name: "Boar Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
    },
  },
  "Hound Shrine": {
    name: "Hound Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(25),
    },
  },
  "Sparrow Shrine": {
    name: "Sparrow Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Dewberry: new Decimal(10),
      "Heart leaf": new Decimal(10),
    },
  },
  "Fox Shrine": {
    name: "Fox Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Chewed Bone": new Decimal(10),
      Ruffroot: new Decimal(10),
    },
  },
  "Toucan Shrine": {
    name: "Toucan Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Ribbon: new Decimal(10),
      "Frost Pebble": new Decimal(10),
    },
  },
  "Collie Shrine": {
    name: "Collie Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Dewberry: new Decimal(10),
      "Wild Grass": new Decimal(10),
    },
  },
  "Moth Shrine": {
    name: "Moth Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Heart leaf": new Decimal(10),
      Ribbon: new Decimal(10),
    },
  },
  "Badger Shrine": {
    name: "Badger Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Ruffroot: new Decimal(10),
      "Chewed Bone": new Decimal(10),
    },
  },
  "Mole Shrine": {
    name: "Mole Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Frost Pebble": new Decimal(10),
      Ribbon: new Decimal(10),
    },
  },
  "Tortoise Shrine": {
    name: "Tortoise Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Wild Grass": new Decimal(10),
      Ruffroot: new Decimal(10),
    },
  },
  "Stag Shrine": {
    name: "Stag Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Heart leaf": new Decimal(10),
      "Frost Pebble": new Decimal(10),
    },
  },
  "Bear Shrine": {
    name: "Bear Shrine",
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Chewed Bone": new Decimal(10),
      "Wild Grass": new Decimal(10),
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
  return false;

  if (!pet?.readyAt) return false;
  return msTillNeglect({ pet, now }) <= 0;
}
