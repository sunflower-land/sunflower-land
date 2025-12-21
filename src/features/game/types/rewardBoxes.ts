import { getKeys } from "./decorations";
import {
  Inventory,
  InventoryItemName,
  TemperateSeasonName,
  Wardrobe,
} from "./game";
import { isPet, PET_TYPES, PetType } from "./pets";
import { SEASONAL_SEEDS, SeedName } from "./seeds";

export type RewardBox = {
  spunAt?: number;
  reward?: {
    coins?: number;
    vipDays?: number;
    items?: Partial<Record<InventoryItemName, number>>;
    wearables?: Wardrobe;
    flower?: number;
  };
  history: {
    items?: Partial<Record<InventoryItemName, number>>;
    wearables?: Partial<Wardrobe>;
    coins?: number;
    vipDays?: number;
    flower?: number;

    total: number;
  };
};

export type RewardBoxName =
  | "Basic Love Box"
  | "Bronze Love Box"
  | "Silver Love Box"
  | "Gold Love Box"
  | "Test Box"
  | "Bronze Flower Box"
  | "Silver Flower Box"
  | "Gold Flower Box"
  | "Bronze Tool Box"
  | "Silver Tool Box"
  | "Gold Tool Box"
  | "Bronze Food Box"
  | "Silver Food Box"
  | "Gold Food Box"
  | "Pet Egg"
  | "Fossil Shell"
  | "Basic Farming Pack"
  | "Basic Food Box"
  | "Weekly Mega Box";

export type RewardBoxes = Partial<Record<RewardBoxName, RewardBox>>;

export type RewardBoxReward = {
  weighting: number;
  coins?: number;
  vipDays?: number;
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Wardrobe;
  flower?: number;
  seasons?: (now?: number) => TemperateSeasonName[]; // Seasons that the reward is available in
};

type RewardBoxDetails = {
  rewards: RewardBoxReward[];
};

function getSeedSeasons(seedName: SeedName): TemperateSeasonName[] {
  return getKeys(SEASONAL_SEEDS).filter((season) =>
    SEASONAL_SEEDS[season].includes(seedName),
  );
}

export const REWARD_BOXES: Record<RewardBoxName, RewardBoxDetails> = {
  "Basic Love Box": {
    rewards: [
      { coins: 25, weighting: 5 },
      { coins: 50, weighting: 5 },
      { coins: 100, weighting: 5 },
      { items: { "Pumpkin Soup": 1 }, weighting: 2 },
      { items: { "Sunflower Cake": 1 }, weighting: 5 },
      { items: { "Love Charm": 2 }, weighting: 50 },
      { items: { "Love Charm": 5 }, weighting: 50 },
      { items: { "Love Charm": 10 }, weighting: 100 },
    ],
  },
  "Basic Farming Pack": {
    rewards: [
      // TODO - filter out non seasonal seeds
      { items: { "Sunflower Seed": 50 }, weighting: 50 },
      { items: { "Potato Seed": 20 }, weighting: 100 },
      { items: { "Rhubarb Seed": 20 }, weighting: 100 },
      { items: { "Pumpkin Seed": 20 }, weighting: 100 },
      { items: { "Carrot Seed": 20 }, weighting: 100 },
      { items: { "Zucchini Seed": 20 }, weighting: 100 },
      { items: { "Yam Seed": 20 }, weighting: 100 },

      // Good rewards
      { items: { "Sprout Mix": 5 }, weighting: 50 },
      { items: { "Rapid Root": 5 }, weighting: 50 },
      { items: { "Beetroot Seed": 20 }, weighting: 30 },
      { items: { "Cauliflower Seed": 20 }, weighting: 30 },
      { items: { "Wheat Seed": 10 }, weighting: 30 },
      { items: { "Kale Seed": 10 }, weighting: 30 },
      { items: { "Barley Seed": 10 }, weighting: 30 },
    ],
  },
  "Basic Food Box": {
    rewards: [
      // Average
      { items: { "Boiled Eggs": 1 }, weighting: 50 },
      { items: { "Bumpkin Broth": 1 }, weighting: 50 },
      { items: { "Fried Tofu": 1 }, weighting: 50 },
      { items: { "Mushroom Soup": 1 }, weighting: 50 },

      // Good
      { items: { "Sunflower Cake": 1 }, weighting: 100 },
      { items: { "Apple Pie": 1 }, weighting: 100 },
      { items: { "Kale & Mushroom Pie": 1 }, weighting: 100 },
      { items: { "Wheat Cake": 1 }, weighting: 50 },
      { items: { "Pirate Cake": 1 }, weighting: 50 },
    ],
  },
  "Weekly Mega Box": {
    rewards: [
      { coins: 1000, weighting: 100 },
      { items: { "Fishing Lure": 5 }, weighting: 100 },

      // Good
      { coins: 2500, weighting: 100 },
      { coins: 5000, weighting: 100 },
      { items: { Gem: 100 }, weighting: 10 },
      { items: { Gem: 350 }, weighting: 5 },
    ],
  },
  "Fossil Shell": {
    rewards: [
      { items: { Acorn: 3 }, weighting: 50 },
      { items: { Acorn: 2 }, weighting: 100 },
      { items: { Acorn: 1 }, weighting: 200 },
      { items: { Ruffroot: 1 }, weighting: 35 },
      { items: { "Heart leaf": 1 }, weighting: 35 },
      { items: { "Chewed Bone": 1 }, weighting: 35 },
      { items: { Ribbon: 1 }, weighting: 35 },
      { items: { "Wild Grass": 1 }, weighting: 35 },
      { items: { "Frost Pebble": 1 }, weighting: 35 },
      { items: { Dewberry: 1 }, weighting: 35 },
      { items: { Ruffroot: 2 }, weighting: 20 },
      { items: { "Heart leaf": 2 }, weighting: 20 },
      { items: { "Chewed Bone": 2 }, weighting: 20 },
      { items: { Ribbon: 2 }, weighting: 20 },
      { items: { "Wild Grass": 2 }, weighting: 20 },
      { items: { "Frost Pebble": 2 }, weighting: 20 },
      { items: { Dewberry: 2 }, weighting: 20 },
      { items: { Moonfur: 1 }, weighting: 5 },
    ],
  },
  "Pet Egg": {
    rewards: [
      { items: { Barkley: 1 }, weighting: 100 },
      { items: { Biscuit: 1 }, weighting: 100 },
      { items: { Cloudy: 1 }, weighting: 100 },
      { items: { Meowchi: 1 }, weighting: 100 },
      { items: { Butters: 1 }, weighting: 100 },
      { items: { Smokey: 1 }, weighting: 100 },
      { items: { Twizzle: 1 }, weighting: 100 },
      { items: { Flicker: 1 }, weighting: 100 },
      { items: { Pippin: 1 }, weighting: 100 },
      { items: { Burro: 1 }, weighting: 100 },
      { items: { Pinto: 1 }, weighting: 100 },
      { items: { Roan: 1 }, weighting: 100 },
      { items: { Stallion: 1 }, weighting: 100 },
      { items: { Mudhorn: 1 }, weighting: 100 },
      { items: { Bison: 1 }, weighting: 100 },
      { items: { Oxen: 1 }, weighting: 100 },
      { items: { Nibbles: 1 }, weighting: 100 },
      { items: { Peanuts: 1 }, weighting: 100 },
      { items: { Waddles: 1 }, weighting: 100 },
      { items: { Pip: 1 }, weighting: 100 },
      { items: { Skipper: 1 }, weighting: 100 },
    ],
  },
  "Test Box": {
    rewards: [
      { coins: 100, weighting: 100 },
      { items: { Sunflower: 1 }, weighting: 100 },
      { wearables: { "Red Farmer Shirt": 1 }, weighting: 100 },
      { vipDays: 1, weighting: 100 },
      { flower: 1, weighting: 100 },
    ],
  },
  "Bronze Love Box": {
    rewards: [
      { coins: 100, weighting: 100 },
      { coins: 250, weighting: 100 },
      { coins: 500, weighting: 50 },
      { coins: 1000, weighting: 50 },
      { items: { "Love Charm": 50 }, weighting: 50 },
      { items: { "Love Charm": 100 }, weighting: 100 },
      { items: { "Pirate Cake": 1 }, weighting: 50 },
      { items: { "Fishing Lure": 5 }, weighting: 50 },
      { items: { Axe: 5 }, weighting: 50 },
      { items: { Pickaxe: 5 }, weighting: 50 },
      { items: { Gem: 25 }, weighting: 20 },
      { items: { "Time Warp Totem": 1 }, weighting: 20 },
    ],
  },
  "Silver Love Box": {
    rewards: [
      { coins: 500, weighting: 100 },
      { coins: 1250, weighting: 100 },
      { coins: 2500, weighting: 50 },
      { coins: 5000, weighting: 25 },
      { items: { "Love Charm": 250 }, weighting: 50 },
      { items: { "Love Charm": 500 }, weighting: 50 },
      { items: { "Pizza Margherita": 1 }, weighting: 50 },
      { items: { "Fishing Lure": 10 }, weighting: 50 },
      { items: { "Iron Pickaxe": 5 }, weighting: 50 },
      { items: { Gem: 50 }, weighting: 50 },
      { items: { Gem: 100 }, weighting: 50 },
      { items: { "Time Warp Totem": 1 }, weighting: 50 },
      { vipDays: 3, weighting: 50 },
    ],
  },
  "Gold Love Box": {
    rewards: [
      { items: { "Love Charm": 250 }, weighting: 15 },
      { items: { "Love Charm": 500 }, weighting: 10 },
      { items: { "Love Charm": 1000 }, weighting: 5 },
      { coins: 10000, weighting: 15 },
      { items: { "Pizza Margherita": 3 }, weighting: 15 },
      { items: { "Fishing Lure": 50 }, weighting: 10 },
      { items: { Gem: 200 }, weighting: 10 },
      { vipDays: 7, weighting: 10 },
      { items: { Gem: 500 }, weighting: 5 },
      { items: { "Super Totem": 1 }, weighting: 5 },
    ],
  },

  "Bronze Flower Box": {
    rewards: [
      { flower: 5, weighting: 100 },
      { flower: 10, weighting: 100 },
      { flower: 15, weighting: 75 },
      { flower: 20, weighting: 50 },
      { flower: 25, weighting: 30 },
      { flower: 30, weighting: 20 },
      { flower: 35, weighting: 10 },
      { flower: 40, weighting: 5 },
      { flower: 45, weighting: 3 },
      { flower: 50, weighting: 1 },
    ],
  },
  "Silver Flower Box": {
    rewards: [
      { flower: 15, weighting: 100 },
      { flower: 25, weighting: 100 },
      { flower: 35, weighting: 50 },
      { flower: 50, weighting: 40 },
      { flower: 60, weighting: 30 },
      { flower: 70, weighting: 20 },
      { flower: 80, weighting: 10 },
      { flower: 90, weighting: 5 },
      { flower: 100, weighting: 3 },
      { flower: 150, weighting: 1 },
    ],
  },
  "Gold Flower Box": {
    rewards: [
      { flower: 50, weighting: 100 },
      { flower: 75, weighting: 100 },
      { flower: 100, weighting: 50 },
      { flower: 125, weighting: 40 },
      { flower: 150, weighting: 30 },
      { flower: 160, weighting: 20 },
      { flower: 170, weighting: 15 },
      { flower: 180, weighting: 10 },
      { flower: 190, weighting: 5 },
      { flower: 200, weighting: 4 },
      { flower: 250, weighting: 3 },
      { flower: 300, weighting: 2 },
      { flower: 500, weighting: 1 },
    ],
  },
  "Bronze Tool Box": {
    rewards: [
      { items: { Axe: 20 }, weighting: 100 },
      { items: { Axe: 50 }, weighting: 50 },
      { items: { Pickaxe: 10 }, weighting: 100 },
      { items: { Pickaxe: 20 }, weighting: 50 },
      { items: { "Sand Shovel": 10 }, weighting: 25 },
      { items: { Rod: 10 }, weighting: 25 },
      { items: { "Fishing Lure": 3 }, weighting: 25 },
      { items: { Omnifeed: 5 }, weighting: 25 },
    ],
  },
  "Silver Tool Box": {
    rewards: [
      { items: { Axe: 100 }, weighting: 100 },
      { items: { Pickaxe: 50 }, weighting: 100 },
      { items: { "Stone Pickaxe": 25 }, weighting: 70 },
      { items: { "Iron Pickaxe": 10 }, weighting: 50 },
      { items: { "Gold Pickaxe": 5 }, weighting: 40 },
      { items: { Omnifeed: 20 }, weighting: 40 },
      { items: { Rod: 100 }, weighting: 30 },
      { items: { "Sand Shovel": 100 }, weighting: 30 },
      { items: { "Barn Delight": 10 }, weighting: 30 },
      { items: { "Oil Drill": 5 }, weighting: 30 },
      { items: { "Fishing Lure": 10 }, weighting: 20 },
    ],
  },
  "Gold Tool Box": {
    rewards: [
      { items: { "Stone Pickaxe": 50 }, weighting: 100 },
      { items: { "Iron Pickaxe": 50 }, weighting: 100 },
      { items: { "Gold Pickaxe": 20 }, weighting: 100 },
      { items: { Omnifeed: 100 }, weighting: 75 },
      { items: { "Fishing Lure": 100 }, weighting: 50 },
      { items: { "Barn Delight": 25 }, weighting: 50 },
      { items: { "Oil Drill": 20 }, weighting: 50 },
    ],
  },
  "Bronze Food Box": {
    rewards: [
      { items: { "Sunflower Cake": 1 }, weighting: 100 },
      { items: { "Apple Pie": 1 }, weighting: 100 },
      { items: { "Kale & Mushroom Pie": 1 }, weighting: 100 },
      { items: { "Wheat Cake": 1 }, weighting: 50 },
      { items: { "Cabbage Cake": 1 }, weighting: 50 },
      { items: { "Fermented Fish": 1 }, weighting: 50 },
      { items: { "Pirate Cake": 1 }, weighting: 50 },
      { items: { "Honey Cake": 1 }, weighting: 50 },
    ],
  },
  "Silver Food Box": {
    rewards: [
      { items: { "Pirate Cake": 1 }, weighting: 50 },
      { items: { "Honey Cake": 1 }, weighting: 100 },
      { items: { "Blue Cheese": 1 }, weighting: 75 },
      { items: { "Fermented Fish": 1 }, weighting: 75 },
      { items: { "Shroom Syrup": 1 }, weighting: 75 },
      { items: { "Honey Cheddar": 1 }, weighting: 50 },
      { items: { "Pizza Margherita": 1 }, weighting: 30 },
    ],
  },
  "Gold Food Box": {
    rewards: [
      { items: { "Shroom Syrup": 3 }, weighting: 100 },
      { items: { "Honey Cheddar": 3 }, weighting: 100 },
      { items: { "Lemon Cheesecake": 3 }, weighting: 100 },
      { items: { "Pizza Margherita": 3 }, weighting: 100 },
      { items: { "Pizza Margherita": 5 }, weighting: 100 },
    ],
  },
};

/**
 * Returns a list of pet rewards that the player does not already have.
 *
 * @param inventory - The player's inventory
 * @returns A list of pet rewards that the player does not already have
 */
export const getPetRewardPool = ({
  inventory,
}: {
  inventory: Inventory;
}): RewardBoxReward[] => {
  let petRewardPool = [...REWARD_BOXES["Pet Egg"].rewards];

  // Get all pet categories that the player already has pets from
  const ownedPetCategories = new Set<PetType>();

  getKeys(PET_TYPES).forEach((pet) => {
    if (inventory[pet]) {
      const petType = PET_TYPES[pet];
      if (petType) ownedPetCategories.add(petType);
    }
  });

  // Filter out all pets from categories the player already owns
  petRewardPool = petRewardPool.filter((reward) => {
    const rewardPet = getKeys(reward.items ?? {})[0];

    if (!rewardPet || !isPet(rewardPet)) return true;

    const petType = PET_TYPES[rewardPet];
    if (petType) return !ownedPetCategories.has(petType);

    return true;
  });

  // If they have gotten 1 pet from each category, release the remaining pets they haven't gotten in the pool
  if (petRewardPool.length === 0) {
    petRewardPool = [...REWARD_BOXES["Pet Egg"].rewards].filter((reward) => {
      const pet = getKeys(reward.items ?? {})[0];

      return !inventory[pet];
    });
  }

  return petRewardPool;
};
