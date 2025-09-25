import Decimal from "decimal.js-light";
import { Decoration } from "./decorations";
import { CraftableCollectible, PlaceableLocation } from "./collectibles";
import { CookableName } from "./consumables";
import { getObjectEntries } from "../expansion/lib/utils";
import { InventoryItemName } from "./game";
import { Coordinates } from "../expansion/components/MapPlacement";
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
  // Common Pet Types
  | "Dog"
  | "Cat"
  | "Owl"
  | "Horse"
  | "Bull"
  | "Hamster"
  | "Penguin"

  // NFT Pet Types
  | "Ram"
  | "Dragon"
  | "Phoenix"
  | "Griffin"
  | "Warthog"
  | "Wolf"
  | "Bear";

export type PetCategoryName =
  | "Guardian"
  | "Hunter"
  | "Voyager"
  | "Beast"
  | "Moonkin"
  | "Snowkin"
  | "Forager";

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
    fedAt?: number;
    resets?: {
      [date: string]: number;
    };
  };
  fetches?: Partial<Record<PetResourceName, number>>; // Fetch yields
  energy: number;
  experience: number;
  pettedAt: number;
  dailySocialXP?: {
    [date: string]: number;
  };
  visitedAt?: number; // Local only field
};

export type PetNFTName = `Pet-${number}`;

export type PetNFT = Omit<Pet, "name"> & {
  id: number;
  name: PetNFTName;
  coordinates?: Coordinates;
  location?: PlaceableLocation;
  revealAt: number;
  // TODO: Add traits
  traits?: {
    bib: string;
    aura: string;
    type: PetType;
  };
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
  primaryCategory: PetCategoryName;
  secondaryCategory?: PetCategoryName;
  tertiaryCategory?: PetCategoryName;
};

export const PET_CATEGORIES: Record<PetType, PetCategory> = {
  Dog: {
    primaryCategory: "Guardian",
    secondaryCategory: "Hunter",
  },
  Cat: {
    primaryCategory: "Hunter",
    secondaryCategory: "Moonkin",
  },
  Owl: {
    primaryCategory: "Moonkin",
    secondaryCategory: "Forager",
  },
  Horse: {
    primaryCategory: "Voyager",
    secondaryCategory: "Beast",
  },
  Bull: {
    primaryCategory: "Beast",
    secondaryCategory: "Snowkin",
  },
  Hamster: {
    primaryCategory: "Forager",
    secondaryCategory: "Guardian",
  },
  Penguin: {
    primaryCategory: "Snowkin",
    secondaryCategory: "Voyager",
  },

  // NFT Pet Types
  Ram: {
    primaryCategory: "Snowkin",
    secondaryCategory: "Guardian",
    tertiaryCategory: "Forager",
  },
  Dragon: {
    primaryCategory: "Hunter",
    secondaryCategory: "Moonkin",
    tertiaryCategory: "Voyager",
  },
  Phoenix: {
    primaryCategory: "Moonkin",
    secondaryCategory: "Voyager",
    tertiaryCategory: "Hunter",
  },
  Griffin: {
    primaryCategory: "Voyager",
    secondaryCategory: "Hunter",
    tertiaryCategory: "Beast",
  },
  Warthog: {
    primaryCategory: "Beast",
    secondaryCategory: "Forager",
    tertiaryCategory: "Guardian",
  },
  Wolf: {
    primaryCategory: "Guardian",
    secondaryCategory: "Snowkin",
    tertiaryCategory: "Moonkin",
  },
  Bear: {
    primaryCategory: "Forager",
    secondaryCategory: "Beast",
    tertiaryCategory: "Snowkin",
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
    acc[petType] = {
      fetches: [
        { name: "Acorn", level: 1 },
        { name: FETCHES_BY_CATEGORY[petCategory.primaryCategory], level: 3 },
        ...(petCategory.secondaryCategory
          ? [
              {
                name: FETCHES_BY_CATEGORY[petCategory.secondaryCategory],
                level: 7,
              },
            ]
          : []),

        // TODO: Add Moonfur for NFT Pets

        { name: "Fossil Shell", level: 20 },
        ...(petCategory.tertiaryCategory
          ? [
              {
                name: FETCHES_BY_CATEGORY[petCategory.tertiaryCategory],
                level: 25,
              },
            ]
          : []),
      ],
    };

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

export const PET_RESOURCES: Record<
  PetResourceName,
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
      Acorn: new Decimal(10),
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
  easy: 50,
  medium: 100,
  hard: 150,
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

const PET_NEGLECT_DAYS = 3;

export function isPetNeglected(
  pet: Pet | PetNFT | undefined,
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

const PET_NAP_HOURS = 2;

export function isPetNapping(
  pet: Pet | PetNFT | undefined,
  createdAt: number = Date.now(),
) {
  if (!pet) return false;
  const pettedAt = pet.pettedAt;
  const hoursSincePetted = (createdAt - pettedAt) / (1000 * 60 * 60);
  return hoursSincePetted >= PET_NAP_HOURS;
}
