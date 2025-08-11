import { InventoryItemName } from "./game";

export type PetName = "Barkley" | "Meowchi" | "Twizzle" | "Burro";

export type Pet = {
  craves: InventoryItemName;
  fetchedAt?: number;
};

export type PetConfig = {
  fetches: PetResource[];
};

export const PETS: Record<PetName, PetConfig> = {
  Barkley: {
    fetches: ["Acorn", "Chewed Bone"],
  },

  Burro: {
    fetches: ["Acorn", "Ruffroot"],
  },
  Twizzle: {
    fetches: ["Acorn", "Heart leaf"],
  },
  Meowchi: {
    fetches: [],
  },
};

export type PetResource = "Acorn" | "Ruffroot" | "Chewed Bone" | "Heart leaf";

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
};
