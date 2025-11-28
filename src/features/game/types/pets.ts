import Decimal from "decimal.js-light";
import { Decoration } from "./decorations";
import { CraftableCollectible, PlaceableLocation } from "./collectibles";
import { CookableName } from "./consumables";
import { getObjectEntries } from "../expansion/lib/utils";
import { InventoryItemName } from "./game";
import { Coordinates } from "../expansion/components/MapPlacement";
import { PetTraits } from "features/pets/data/types";
import { CONFIG } from "lib/config";

export const SOCIAL_PET_XP_PER_HELP = 5;
export const SOCIAL_PET_DAILY_XP_LIMIT = 50;

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

export type CommonPetType =
  | "Dog"
  | "Cat"
  | "Owl"
  | "Horse"
  | "Bull"
  | "Hamster"
  | "Penguin";

export const PET_NFT_TYPES = [
  "Ram",
  "Dragon",
  "Phoenix",
  "Griffin",
  "Warthog",
  "Wolf",
  "Bear",
] as const;

export type PetNFTType = (typeof PET_NFT_TYPES)[number];

export type PetType = CommonPetType | PetNFTType;

export const PET_CATEGORY_NAMES = [
  "Guardian",
  "Hunter",
  "Voyager",
  "Beast",
  "Moonkin",
  "Snowkin",
  "Forager",
] as const;

export type PetCategoryName = (typeof PET_CATEGORY_NAMES)[number];

export type PetResourceName =
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

export type Pet = {
  name: PetName;
  requests: {
    food: CookableName[];
    foodFed?: CookableName[];
    fedAt: number;
    resets?: {
      [date: string]: number;
    };
  };
  // fetches?: Partial<Record<PetResourceName, number>>; // Will be unused in the future
  fetchSeeds?: Partial<Record<PetResourceName, number>>; // Store the next seed
  energy: number;
  experience: number;
  pettedAt: number;
  cheeredAt?: number; // Used to determine if a pet has been cheered up
  dailySocialXP?: {
    [date: string]: number;
  };
  visitedAt?: number; // Local only field
};

export type PetNFTName = `Pet #${number}`;

export type PetNFT = Omit<Pet, "name"> & {
  id: number;
  name: PetNFTName;
  coordinates?: Coordinates;
  location?: PlaceableLocation;
  traits?: PetTraits;
  walking?: boolean;
};

export type PetNFTs = Record<number, PetNFT>;

export type Pets = {
  common?: Partial<Record<PetName, Pet>>;
  nfts?: PetNFTs;
  requestsGeneratedAt?: number;
};

export type PetConfig = {
  fetches: { name: PetResourceName; level: number }[];
};

export const isPet = (name: InventoryItemName): name is PetName =>
  name in PET_TYPES;

export type PetCategory = {
  primary: PetCategoryName;
  secondary?: PetCategoryName;
  tertiary?: PetCategoryName;
};

export const PET_CATEGORIES: Record<PetType, PetCategory> = {
  Dog: {
    primary: "Guardian",
    secondary: "Hunter",
  },
  Cat: {
    primary: "Hunter",
    secondary: "Moonkin",
  },
  Owl: {
    primary: "Moonkin",
    secondary: "Forager",
  },
  Horse: {
    primary: "Voyager",
    secondary: "Beast",
  },
  Bull: {
    primary: "Beast",
    secondary: "Snowkin",
  },
  Hamster: {
    primary: "Forager",
    secondary: "Guardian",
  },
  Penguin: {
    primary: "Snowkin",
    secondary: "Voyager",
  },

  // NFT Pet Types
  Dragon: {
    primary: "Snowkin",
    secondary: "Guardian",
    tertiary: "Voyager",
  },
  Ram: {
    primary: "Hunter",
    secondary: "Voyager",
    tertiary: "Moonkin",
  },
  Phoenix: {
    primary: "Moonkin",
    secondary: "Beast",
    tertiary: "Guardian",
  },
  Griffin: {
    primary: "Voyager",
    secondary: "Forager",
    tertiary: "Beast",
  },
  Warthog: {
    primary: "Beast",
    secondary: "Snowkin",
    tertiary: "Hunter",
  },
  Wolf: {
    primary: "Guardian",
    secondary: "Hunter",
    tertiary: "Forager",
  },
  Bear: {
    primary: "Forager",
    secondary: "Moonkin",
    tertiary: "Snowkin",
  },
};

export const FETCHES_BY_CATEGORY: Record<PetCategoryName, PetResourceName> = {
  Guardian: "Chewed Bone",
  Hunter: "Ribbon",
  Voyager: "Ruffroot",
  Beast: "Wild Grass",
  Moonkin: "Heart leaf",
  Snowkin: "Frost Pebble",
  Forager: "Dewberry",
};

export const PET_FETCHES: Record<PetType, PetConfig> = getObjectEntries(
  PET_CATEGORIES,
).reduce<Record<PetType, PetConfig>>(
  (acc, [petType, petCategory]) => {
    const fetches: PetConfig["fetches"] = [
      { name: "Acorn", level: 1 },
      { name: FETCHES_BY_CATEGORY[petCategory.primary], level: 3 },
      { name: "Fossil Shell", level: 20 },
    ];

    if (petCategory.secondary) {
      fetches.push({
        name: FETCHES_BY_CATEGORY[petCategory.secondary],
        level: 7,
      });
    }

    // Only NFT Pets have tertiary categories
    if (petCategory.tertiary) {
      fetches.push(
        ...([
          { name: "Moonfur", level: 12 },
          {
            name: FETCHES_BY_CATEGORY[petCategory.tertiary],
            level: 25,
          },
        ] as const),
      );
    }

    acc[petType] = { fetches };

    return acc;
  },
  {} as Record<PetType, PetConfig>,
);

export const PET_TYPES: Record<PetName, PetType> = {
  Barkley: "Dog",
  Biscuit: "Dog",
  Cloudy: "Dog",
  Meowchi: "Cat",
  Butters: "Cat",
  Smokey: "Cat",
  Twizzle: "Owl",
  Flicker: "Owl",
  Pippin: "Owl",
  Burro: "Horse",
  Pinto: "Horse",
  Roan: "Horse",
  Stallion: "Horse",
  Mudhorn: "Bull",
  Bison: "Bull",
  Oxen: "Bull",
  Nibbles: "Hamster",
  Peanuts: "Hamster",
  Waddles: "Penguin",
  Pip: "Penguin",
  Skipper: "Penguin",
  Ramsey: "Ram",
};

export function isPetNFT(petData: Pet | PetNFT): petData is PetNFT {
  return "id" in petData;
}

export function getPetType(petData: Pet | PetNFT | undefined) {
  if (!petData) {
    return undefined;
  }

  if (isPetNFT(petData)) {
    return petData.traits?.type;
  }

  return PET_TYPES[petData.name];
}

export function getPetFetches(petData: Pet | PetNFT): PetConfig {
  const petType = getPetType(petData);

  if (!petType) {
    throw new Error("Pet type not found");
  }

  return PET_FETCHES[petType];
}

export function hasHitSocialPetLimit(pet: Pet | PetNFT) {
  const dailySocialXP =
    pet.dailySocialXP?.[new Date().toISOString().slice(0, 10)] ?? 0;
  return dailySocialXP >= SOCIAL_PET_DAILY_XP_LIMIT;
}

export const PET_RESOURCES: Record<PetResourceName, { energy: number }> = {
  Acorn: { energy: 100 },
  Ruffroot: { energy: 200 },
  "Chewed Bone": { energy: 200 },
  "Heart leaf": { energy: 200 },
  "Frost Pebble": { energy: 200 },
  "Wild Grass": { energy: 200 },
  Ribbon: { energy: 200 },
  Dewberry: { energy: 200 },
  "Fossil Shell": { energy: 300 },
  Moonfur: { energy: 1000 },
};

export type PetShrineName =
  | "Fox Shrine" // Crafting
  | "Hound Shrine" // Pets
  | "Boar Shrine" // Cooking
  | "Sparrow Shrine" // Crops
  | "Toucan Shrine" // Fruit
  | "Collie Shrine" // Barn Animals
  | "Badger Shrine" // Trees & Stones
  | "Stag Shrine" // Oil
  | "Mole Shrine" // Crimstone, Gold & Iron
  | "Bear Shrine" // Honey
  | "Tortoise Shrine" // Greenhouse + Crop Machine
  | "Moth Shrine" // Flower
  | "Legendary Shrine" // Bonus yields
  | "Bantam Shrine" // Chickens
  | "Trading Shrine"; // Trading

export type PetShrine = Omit<Decoration, "name"> & {
  name: PetShrineName;
  level?: number;
};

export const PET_SHRINES: Record<PetShrineName, CraftableCollectible> = {
  "Boar Shrine": {
    description: "",
    coins: 0,
    ingredients: { Acorn: new Decimal(15) },
    inventoryLimit: 1,
  },
  "Hound Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(50),
    },
    inventoryLimit: 1,
  },
  "Sparrow Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Wild Grass": new Decimal(10),
      Ruffroot: new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Fox Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Chewed Bone": new Decimal(10),
      Ribbon: new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Toucan Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Heart leaf": new Decimal(10),
      "Frost Pebble": new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Collie Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Frost Pebble": new Decimal(10),
      "Chewed Bone": new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Moth Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Frost Pebble": new Decimal(10),
      Ribbon: new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Badger Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Dewberry: new Decimal(10),
      "Heart leaf": new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Mole Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Dewberry: new Decimal(10),
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
      "Chewed Bone": new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Stag Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Heart leaf": new Decimal(10),
      "Wild Grass": new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Bear Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      "Chewed Bone": new Decimal(10),
      Ruffroot: new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Bantam Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Ruffroot: new Decimal(10),
      Dewberry: new Decimal(10),
    },
    inventoryLimit: 1,
  },
  "Legendary Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Obsidian: new Decimal(1),
      Moonfur: new Decimal(10),
      Acorn: new Decimal(15),
    },
    inventoryLimit: 1,
  },
  "Trading Shrine": {
    description: "",
    coins: 0,
    ingredients: {
      Acorn: new Decimal(15),
      Moonfur: new Decimal(5),
      Obsidian: new Decimal(3),
    },
    inventoryLimit: 1,
  },
};

export type PetRequestDifficulty = "easy" | "medium" | "hard";

export const PET_REQUESTS: Record<PetRequestDifficulty, CookableName[]> = {
  easy: [
    "Mashed Potato",
    "Rhubarb Tart",
    "Pumpkin Soup",
    "Reindeer Carrot",
    "Bumpkin Broth",
    "Popcorn",
    "Sunflower Crunch",
    "Roast Veggies",
    "Club Sandwich",
    "Fruit Salad",
    "Cheese",
    "Quick Juice",
    "Carrot Juice",
    "Purple Smoothie",
  ],
  medium: [
    "Boiled Eggs",
    "Cabbers n Mash",
    "Fried Tofu",
    "Kale Stew",
    "Cauliflower Burger",
    "Bumpkin Salad",
    "Goblin's Treat",
    "Pancakes",
    "Bumpkin ganoush",
    "Tofu Scramble",
    "Sunflower Cake",
    "Cornbread",
    "Pumpkin Cake",
    "Potato Cake",
    "Apple Pie",
    "Orange Cake",
    "Carrot Cake",
    "Fermented Carrots",
    "Blueberry Jam",
    "Sauerkraut",
    "Fancy Fries",
    "Orange Juice",
    "Apple Juice",
    "Power Smoothie",
    "Bumpkin Detox",
    "Sour Shake",
  ],
  hard: [
    "Kale Omelette",
    "Rice Bun",
    "Antipasto",
    "Pizza Margherita",
    "Bumpkin Roast",
    "Goblin Brunch",
    "Steamed Red Rice",
    "Caprese Salad",
    "Spaghetti al Limone",
    "Cabbage Cake",
    "Wheat Cake",
    "Cauliflower Cake",
    "Radish Cake",
    "Beetroot Cake",
    "Parsnip Cake",
    "Eggplant Cake",
    "Honey Cake",
    "Lemon Cheesecake",
    "Blue Cheese",
    "Honey Cheddar",
    "Banana Blast",
    "Grape Juice",
    "Slow Juice",
    "The Lot",
  ],
};

export function getPetRequests(): CookableName[] {
  const requests: CookableName[] = [];
  const difficulties: PetRequestDifficulty[] = ["easy", "medium", "hard"];

  difficulties.forEach((difficulty) => {
    const randomIndex = Math.floor(
      Math.random() * PET_REQUESTS[difficulty].length,
    );
    requests.push(PET_REQUESTS[difficulty][randomIndex]);
  });

  return requests;
}

export const PET_REQUEST_XP: Record<PetRequestDifficulty, number> = {
  easy: 20,
  medium: 100,
  hard: 300,
};

export function getPetRequestXP(food: CookableName) {
  const foodDifficultyEntry = getObjectEntries(PET_REQUESTS).find(
    ([, requests]) => requests.includes(food),
  );

  if (!foodDifficultyEntry) {
    return 0;
  }
  const [difficulty] = foodDifficultyEntry;

  return PET_REQUEST_XP[difficulty];
}

/**
 * Calculates the pet's current level, progress, and experience required for the next level based on total experience.
 *
 * Uses the formula: XP required to reach level n = 100 * (n-1) * n / 2
 *
 * @param currentTotalExperience - The pet's accumulated experience points.
 * @returns An object with:
 *   - level: Current level (integer, minimum 1)
 *   - currentProgress: XP earned towards the next level
 *   - nextLevelXP: Total XP required to reach the next level
 *   - percentage: Progress towards the next level (0-100)
 *   - experienceBetweenLevels: XP required to go from current to next level
 *
 * Example:
 *   Level 1: 0 XP
 *   Level 2: 100 XP
 *   Level 3: 300 XP
 *   Level 4: 600 XP
 *   Level 5: 1000 XP
 *   Level 6: 1500 XP
 *   Level 7: 2100 XP
 *   Level 8: 2800 XP
 *   Level 9: 3600 XP
 *   Level 10: 4500 XP
 */
export function getPetLevel(currentTotalExperience: number) {
  if (currentTotalExperience < 0)
    return {
      level: 1,
      percentage: 0,
      currentProgress: 0,
      nextLevelXP: 100,
      experienceBetweenLevels: 100,
    };

  // Solve n for: 100 * (n-1) * n / 2 <= currentTotalExperience
  // Quadratic: n^2 - n - (2 * currentTotalExperience) / 100 <= 0
  // n = (1 + sqrt(1 + 8 * currentTotalExperience / 100)) / 2
  const n = (1 + Math.sqrt(1 + 0.08 * currentTotalExperience)) / 2;
  const currentLevel = Math.floor(n);

  const currentLevelXP = 50 * (currentLevel - 1) * currentLevel;
  const nextLevel = currentLevel + 1;
  const nextLevelXP = 50 * (nextLevel - 1) * nextLevel;
  const experienceBetweenLevels = nextLevelXP - currentLevelXP;
  const currentProgress = currentTotalExperience - currentLevelXP;
  const percentage =
    ((currentTotalExperience - currentLevelXP) / experienceBetweenLevels) * 100;

  return {
    level: currentLevel,
    currentProgress,
    nextLevelXP,
    percentage,
    experienceBetweenLevels,
  };
}

export function isPetNeglected(
  pet: Pet | PetNFT | undefined,
  createdAt: number,
) {
  if (!pet) {
    return false;
  }

  if (pet.experience <= 0) {
    return false;
  }

  const PET_NEGLECT_DAYS = isPetNFT(pet) ? 7 : 3;

  const lastFedAt = Math.max(pet.requests.fedAt, pet.cheeredAt ?? 0); // To use cheeredAt or fedAt, whichever is more recent
  const lastFedAtDate = new Date(lastFedAt).toISOString().split("T")[0];
  const todayDate = new Date(createdAt).toISOString().split("T")[0];
  const daysSinceLastFedMs =
    new Date(todayDate).getTime() - new Date(lastFedAtDate).getTime();
  const daysSinceLastFedDays = daysSinceLastFedMs / (1000 * 60 * 60 * 24);
  return daysSinceLastFedDays > PET_NEGLECT_DAYS;
}

const PET_NAP_HOURS = 2;

export function isPetNapping(pet: Pet | PetNFT | undefined, createdAt: number) {
  if (!pet) return false;
  const pettedAt = pet.pettedAt;
  const hoursSincePetted = (createdAt - pettedAt) / (1000 * 60 * 60);
  return hoursSincePetted >= PET_NAP_HOURS;
}

export function isPetOfTypeFed({
  nftPets,
  petType,
  id,
  now,
}: {
  nftPets: PetNFTs;
  petType: PetNFTType;
  id: number; // This is the id of the pet to exclude from the check
  now: number;
}) {
  const petsOfType = Object.values(nftPets).filter(
    (pet) => pet.traits?.type === petType,
  );

  const isPetOfTypeFed = petsOfType.some((pet) => {
    if (pet.id === id) return false;
    if (pet.experience <= 0) return false;
    const lastFedAt = pet.requests.fedAt;
    const todayDate = new Date(now).toISOString().split("T")[0];
    const lastFedAtDate = new Date(lastFedAt).toISOString().split("T")[0];
    return lastFedAtDate === todayDate;
  });

  return isPetOfTypeFed;
}

type PetNFTRevealConfig = {
  revealAt: Date;
  startId: number;
  endId: number;
};

const MAINNET_PET_NFT_REVEAL_CONFIG: PetNFTRevealConfig[] = [
  {
    revealAt: new Date("2025-11-12T00:00:00.000Z"),
    startId: 1,
    endId: 1000,
  },
  {
    revealAt: new Date("2026-01-13T00:00:00.000Z"),
    startId: 1001,
    endId: 1250,
  },
  {
    revealAt: new Date("2025-11-12T00:00:00.000Z"),
    startId: 2501,
    endId: 3000,
  },
];

const TESTNET_PET_NFT_REVEAL_CONFIG: PetNFTRevealConfig[] = [
  {
    revealAt: new Date("2025-11-11T00:00:00.000Z"),
    startId: 1,
    endId: 1000,
  },
];

const getPetNFTRevealConfig = () => {
  return CONFIG.NETWORK === "mainnet"
    ? MAINNET_PET_NFT_REVEAL_CONFIG
    : TESTNET_PET_NFT_REVEAL_CONFIG;
};

export function isPetNFTRevealed(petId: number, createdAt: number) {
  return getPetNFTRevealConfig().some(
    (config) =>
      petId >= config.startId &&
      petId <= config.endId &&
      createdAt >= config.revealAt.getTime(),
  );
}
export function getPetNFTReleaseDate(petId: number, createdAt: number) {
  const revealAt = getPetNFTRevealConfig().find(
    (config) => petId >= config.startId && petId <= config.endId,
  )?.revealAt;

  if (!revealAt || revealAt.getTime() < createdAt) {
    return undefined;
  }

  return revealAt;
}
