import Decimal from "decimal.js-light";
import { Decoration } from "./decorations";
import { CraftableCollectible } from "./collectibles";
import { CookableName } from "./consumables";
import { getObjectEntries } from "../expansion/lib/utils";
import { InventoryItemName } from "./game";

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
  name: PetName;
  requests: {
    food: CookableName[];
    foodFed?: CookableName[];
    fedAt?: number;
    resets?: {
      [date: string]: number;
    };
  };
  energy: number;
  experience: number;
};

export type Pets = {
  common?: Partial<Record<PetName, Pet>>;
  requestsGeneratedAt?: number;
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

export const isPet = (name: InventoryItemName): name is PetName => name in PETS;

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

export const PET_REQUEST_XP: Record<PetRequestDifficulty, number> = {
  easy: 75,
  medium: 100,
  hard: 125,
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
export function getExperienceToNextLevel(currentTotalExperience: number) {
  // Handle edge cases
  if (currentTotalExperience < 0)
    return {
      level: 1,
      percentage: 0,
      currentProgress: 0,
      nextLevelXP: 100,
      experienceBetweenLevels: 100,
    };

  const currentLevel = Math.floor(
    (1 + Math.sqrt(1 + (8 * currentTotalExperience) / 100)) / 2,
  );

  const currentLevelXP = (100 * (currentLevel - 1) * currentLevel) / 2;

  // Calculate XP needed for next level
  const nextLevel = currentLevel + 1;
  const nextLevelXP = (100 * (nextLevel - 1) * nextLevel) / 2;

  const experienceBetweenLevels = nextLevelXP - currentLevelXP;

  // Calculate percentage of current level
  const percentage =
    ((currentTotalExperience - currentLevelXP) / experienceBetweenLevels) * 100;

  return {
    level: currentLevel,
    currentProgress: currentTotalExperience - currentLevelXP,
    nextLevelXP,
    percentage,
    experienceBetweenLevels,
  };
}

export const PET_NEGLECT_DAYS = 3;

export function isPetNeglected(
  pet: Pet | undefined,
  createdAt: number = Date.now(),
) {
  if (!pet) {
    return false;
  }
  const lastFedAt = pet.requests.fedAt ?? createdAt; // Default to createdAt otherwise the pet will be neglected if it hasn't been fed before
  const lastFedAtDate = new Date(lastFedAt).toISOString().split("T")[0];
  const todayDate = new Date(createdAt).toISOString().split("T")[0];
  const daysSinceLastFedMs =
    new Date(todayDate).getTime() - new Date(lastFedAtDate).getTime();
  const daysSinceLastFedDays = daysSinceLastFedMs / (1000 * 60 * 60 * 24);
  return daysSinceLastFedDays > PET_NEGLECT_DAYS;
}
