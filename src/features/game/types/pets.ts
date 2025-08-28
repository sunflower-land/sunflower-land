import Decimal from "decimal.js-light";
import { Decoration } from "./decorations";
import { CraftableCollectible } from "./collectibles";
import { CookableName } from "./consumables";

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

export type PetType =
  | "Dog"
  | "Cat"
  | "Owl"
  | "Horse"
  | "Bull"
  | "Hamster"
  | "Penguin";

export type PetCategoryName =
  | "Guardian"
  | "Hunter"
  | "Voyager"
  | "Beast"
  | "Moonkin"
  | "Snowkin"
  | "Forager";

export type Pet = {
  requests: CookableName[];
  energy: number;
  experience: number;
};

export type Pets = {
  commonPets: Partial<Record<PetName, Pet>>;
  nftPets?: Partial<Record<number, Pet>>; // nftId as number
};

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

export type PetCatogory = {
  pets: PetName[];
  primaryCategory: PetCategoryName;
  secondaryCategory?: PetCategoryName;
};

export const PET_CATEGORIES: Record<PetType, PetCatogory> = {
  Dog: {
    pets: ["Barkley", "Biscuit", "Cloudy"],
    primaryCategory: "Guardian",
    secondaryCategory: "Hunter",
  },
  Cat: {
    pets: ["Meowchi", "Butters", "Smokey"],
    primaryCategory: "Hunter",
    secondaryCategory: "Moonkin",
  },
  Owl: {
    pets: ["Twizzle", "Flicker", "Pippin"],
    primaryCategory: "Moonkin",
    secondaryCategory: "Forager",
  },
  Horse: {
    pets: ["Burro", "Pinto", "Roan", "Stallion"],
    primaryCategory: "Voyager",
    secondaryCategory: "Beast",
  },
  Bull: {
    pets: ["Mudhorn", "Bison", "Oxen"],
    primaryCategory: "Beast",
    secondaryCategory: "Snowkin",
  },
  Hamster: {
    pets: ["Nibbles", "Peanuts"],
    primaryCategory: "Forager",
    secondaryCategory: "Guardian",
  },
  Penguin: {
    pets: ["Waddles", "Pip", "Skipper"],
    primaryCategory: "Snowkin",
    secondaryCategory: "Voyager",
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

export const PET_SHRINES: Record<PetShrineName, CraftableCollectible> = {
  "Boar Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
    },
    inventoryLimit: 1,
  },
  "Hound Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(25),
    },
    inventoryLimit: 1,
  },
  "Sparrow Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Dewberry: new Decimal(10),
      "Heart leaf": new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Fox Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Chewed Bone": new Decimal(10),
      Ruffroot: new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Toucan Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Ribbon: new Decimal(10),
      "Frost Pebble": new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Collie Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Dewberry: new Decimal(10),
      "Wild Grass": new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Moth Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Heart leaf": new Decimal(10),
      Ribbon: new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Badger Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Ruffroot: new Decimal(10),
      "Chewed Bone": new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Mole Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Frost Pebble": new Decimal(10),
      Ribbon: new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Tortoise Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Wild Grass": new Decimal(10),
      Ruffroot: new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Stag Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Heart leaf": new Decimal(10),
      "Frost Pebble": new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Bear Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Chewed Bone": new Decimal(10),
      "Wild Grass": new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Legendary Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Obsidian: new Decimal(1),
      Moonfur: new Decimal(10),
      Acorn: new Decimal(10),
    },
    inventoryLimit: 1,
  },
};
