import Decimal from "decimal.js-light";
import { Decoration } from "./decorations";

export type PetName =
  // Dogs
  | "Barkley"
  | "Biscuit"
  | "Cloudy"

  // Cats
  | "Meowchi"
  | "Butters"
  | "Smokey"

  // Owls
  | "Twizzle"
  | "Flicker"
  | "Pippin"

  // Horses
  | "Burro"
  | "Pinto"
  | "Roan"
  | "Stallion"

  // Bulls
  | "Mudhorn"
  | "Bison"
  | "Oxen"

  // Hamsters
  | "Nibbles"
  | "Peanuts"

  // Penguins
  | "Waddles"
  | "Pip"
  | "Skipper"

  // Goat - Not used
  | "Ramsey";

export type PetConfig = {
  fetches: { name: PetResource; level: number }[];
};

export const PETS: Record<PetName, PetConfig> = {
  // Dogs
  Barkley: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Chewed Bone" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Frost Pebble" },
    ],
  },
  Biscuit: {
    fetches: [],
  },
  Cloudy: {
    fetches: [],
  },

  // Cats
  Meowchi: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Ribbon" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Chewed Bone" },
    ],
  },
  Butters: {
    fetches: [],
  },
  Smokey: {
    fetches: [],
  },

  // Owls
  Twizzle: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Heart leaf" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Ribbon" },
    ],
  },
  Flicker: {
    fetches: [],
  },
  Pippin: {
    fetches: [],
  },

  // Horses
  Burro: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Ruffroot" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Wild Grass" },
    ],
  },
  Pinto: {
    fetches: [],
  },
  Roan: {
    fetches: [],
  },
  Stallion: {
    fetches: [],
  },

  // Bulls
  Mudhorn: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Wild Grass" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Dewberry" },
    ],
  },
  Bison: {
    fetches: [],
  },
  Oxen: {
    fetches: [],
  },

  // Hamsters
  Nibbles: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Dewberry" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Ruffroot" },
    ],
  },
  Peanuts: {
    fetches: [],
  },

  // Penguins
  Waddles: {
    fetches: [
      { level: 1, name: "Acorn" },
      { level: 3, name: "Frost Pebble" },
      { level: 5, name: "Fossil Shell" },
      { level: 25, name: "Heart leaf" },
    ],
  },
  Pip: {
    fetches: [],
  },
  Skipper: {
    fetches: [],
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
