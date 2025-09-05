import { getKeys } from "./decorations";
import { Inventory, InventoryItemName, Wardrobe } from "./game";
import { isPet, PET_TYPES, PetType } from "./pets";

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
  | "Fossil Shell";

export type RewardBoxes = Partial<Record<RewardBoxName, RewardBox>>;

export type RewardBoxReward = {
  weight: number;
  coins?: number;
  vipDays?: number;
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Partial<Wardrobe>;
  flower?: number;
};

type RewardBoxDetails = {
  rewards: RewardBoxReward[];
};

export const REWARD_BOXES: Record<RewardBoxName, RewardBoxDetails> = {
  "Fossil Shell": {
    rewards: [
      { items: { Acorn: 3 }, weight: 50 },
      { items: { Acorn: 1 }, weight: 50 },
      { items: { Acorn: 2 }, weight: 100 },
      { items: { Ruffroot: 2 }, weight: 50 },
      { items: { "Heart leaf": 2 }, weight: 50 },
      { items: { "Chewed Bone": 2 }, weight: 50 },
      { items: { Moonfur: 1 }, weight: 20 },
    ],
  },
  "Pet Egg": {
    rewards: [
      { items: { Barkley: 1 }, weight: 100 },
      { items: { Biscuit: 1 }, weight: 100 },
      { items: { Cloudy: 1 }, weight: 100 },
      { items: { Meowchi: 1 }, weight: 100 },
      { items: { Butters: 1 }, weight: 100 },
      { items: { Smokey: 1 }, weight: 100 },
      { items: { Twizzle: 1 }, weight: 100 },
      { items: { Flicker: 1 }, weight: 100 },
      { items: { Pippin: 1 }, weight: 100 },
      { items: { Burro: 1 }, weight: 100 },
      { items: { Pinto: 1 }, weight: 100 },
      { items: { Roan: 1 }, weight: 100 },
      { items: { Stallion: 1 }, weight: 100 },
      { items: { Mudhorn: 1 }, weight: 100 },
      { items: { Bison: 1 }, weight: 100 },
      { items: { Oxen: 1 }, weight: 100 },
      { items: { Nibbles: 1 }, weight: 100 },
      { items: { Peanuts: 1 }, weight: 100 },
      { items: { Waddles: 1 }, weight: 100 },
      { items: { Pip: 1 }, weight: 100 },
      { items: { Skipper: 1 }, weight: 100 },
    ],
  },
  "Test Box": {
    rewards: [
      { coins: 100, weight: 100 },
      { items: { Sunflower: 1 }, weight: 100 },
      { wearables: { "Red Farmer Shirt": 1 }, weight: 100 },
      { vipDays: 1, weight: 100 },
      { flower: 1, weight: 100 },
    ],
  },
  "Bronze Love Box": {
    rewards: [
      { coins: 100, weight: 100 },
      { coins: 250, weight: 100 },
      { coins: 500, weight: 50 },
      { coins: 1000, weight: 50 },
      { items: { "Love Charm": 50 }, weight: 50 },
      { items: { "Love Charm": 100 }, weight: 100 },
      { items: { "Pirate Cake": 1 }, weight: 50 },
      { items: { "Fishing Lure": 5 }, weight: 50 },
      { items: { Axe: 5 }, weight: 50 },
      { items: { Pickaxe: 5 }, weight: 50 },
      { items: { Gem: 25 }, weight: 20 },
      { items: { "Time Warp Totem": 1 }, weight: 20 },
    ],
  },
  "Silver Love Box": {
    rewards: [
      { coins: 500, weight: 100 },
      { coins: 1250, weight: 100 },
      { coins: 2500, weight: 50 },
      { coins: 5000, weight: 25 },
      { items: { "Love Charm": 250 }, weight: 50 },
      { items: { "Love Charm": 500 }, weight: 50 },
      { items: { "Pizza Margherita": 1 }, weight: 50 },
      { items: { "Fishing Lure": 10 }, weight: 50 },
      { items: { "Iron Pickaxe": 5 }, weight: 50 },
      { items: { Gem: 50 }, weight: 50 },
      { items: { Gem: 100 }, weight: 50 },
      { items: { "Time Warp Totem": 1 }, weight: 50 },
      { vipDays: 3, weight: 50 },
    ],
  },
  "Gold Love Box": {
    rewards: [
      { items: { "Love Charm": 250 }, weight: 15 },
      { items: { "Love Charm": 500 }, weight: 10 },
      { items: { "Love Charm": 1000 }, weight: 5 },
      { coins: 10000, weight: 15 },
      { items: { "Pizza Margherita": 3 }, weight: 15 },
      { items: { "Fishing Lure": 50 }, weight: 10 },
      { items: { Gem: 200 }, weight: 10 },
      { vipDays: 7, weight: 10 },
      { items: { Gem: 500 }, weight: 5 },
      { items: { "Super Totem": 1 }, weight: 5 },
    ],
  },

  "Bronze Flower Box": {
    rewards: [
      { flower: 5, weight: 100 },
      { flower: 10, weight: 100 },
      { flower: 15, weight: 75 },
      { flower: 20, weight: 50 },
      { flower: 25, weight: 30 },
      { flower: 30, weight: 20 },
      { flower: 35, weight: 10 },
      { flower: 40, weight: 5 },
      { flower: 45, weight: 3 },
      { flower: 50, weight: 1 },
    ],
  },
  "Silver Flower Box": {
    rewards: [
      { flower: 15, weight: 100 },
      { flower: 25, weight: 100 },
      { flower: 35, weight: 50 },
      { flower: 50, weight: 40 },
      { flower: 60, weight: 30 },
      { flower: 70, weight: 20 },
      { flower: 80, weight: 10 },
      { flower: 90, weight: 5 },
      { flower: 100, weight: 3 },
      { flower: 150, weight: 1 },
    ],
  },
  "Gold Flower Box": {
    rewards: [
      { flower: 50, weight: 100 },
      { flower: 75, weight: 100 },
      { flower: 100, weight: 50 },
      { flower: 125, weight: 40 },
      { flower: 150, weight: 30 },
      { flower: 160, weight: 20 },
      { flower: 170, weight: 15 },
      { flower: 180, weight: 10 },
      { flower: 190, weight: 5 },
      { flower: 200, weight: 4 },
      { flower: 250, weight: 3 },
      { flower: 300, weight: 2 },
      { flower: 500, weight: 1 },
    ],
  },
  "Bronze Tool Box": {
    rewards: [
      { items: { Axe: 20 }, weight: 100 },
      { items: { Axe: 50 }, weight: 50 },
      { items: { Pickaxe: 10 }, weight: 100 },
      { items: { Pickaxe: 20 }, weight: 50 },
      { items: { "Sand Shovel": 10 }, weight: 25 },
      { items: { Rod: 10 }, weight: 25 },
      { items: { "Fishing Lure": 3 }, weight: 25 },
      { items: { Omnifeed: 5 }, weight: 25 },
    ],
  },
  "Silver Tool Box": {
    rewards: [
      { items: { Axe: 100 }, weight: 100 },
      { items: { Pickaxe: 50 }, weight: 100 },
      { items: { "Stone Pickaxe": 25 }, weight: 70 },
      { items: { "Iron Pickaxe": 10 }, weight: 50 },
      { items: { "Gold Pickaxe": 5 }, weight: 40 },
      { items: { Omnifeed: 20 }, weight: 40 },
      { items: { Rod: 100 }, weight: 30 },
      { items: { "Sand Shovel": 100 }, weight: 30 },
      { items: { "Barn Delight": 10 }, weight: 30 },
      { items: { "Oil Drill": 5 }, weight: 30 },
      { items: { "Fishing Lure": 10 }, weight: 20 },
    ],
  },
  "Gold Tool Box": {
    rewards: [
      { items: { "Stone Pickaxe": 50 }, weight: 100 },
      { items: { "Iron Pickaxe": 50 }, weight: 100 },
      { items: { "Gold Pickaxe": 20 }, weight: 100 },
      { items: { Omnifeed: 100 }, weight: 75 },
      { items: { "Fishing Lure": 100 }, weight: 50 },
      { items: { "Barn Delight": 25 }, weight: 50 },
      { items: { "Oil Drill": 20 }, weight: 50 },
    ],
  },
  "Bronze Food Box": {
    rewards: [
      { items: { "Sunflower Cake": 1 }, weight: 100 },
      { items: { "Apple Pie": 1 }, weight: 100 },
      { items: { "Kale & Mushroom Pie": 1 }, weight: 100 },
      { items: { "Wheat Cake": 1 }, weight: 50 },
      { items: { "Cabbage Cake": 1 }, weight: 50 },
      { items: { "Fermented Fish": 1 }, weight: 50 },
      { items: { "Pirate Cake": 1 }, weight: 50 },
      { items: { "Honey Cake": 1 }, weight: 50 },
    ],
  },
  "Silver Food Box": {
    rewards: [
      { items: { "Pirate Cake": 1 }, weight: 50 },
      { items: { "Honey Cake": 1 }, weight: 100 },
      { items: { "Blue Cheese": 1 }, weight: 75 },
      { items: { "Fermented Fish": 1 }, weight: 75 },
      { items: { "Shroom Syrup": 1 }, weight: 75 },
      { items: { "Honey Cheddar": 1 }, weight: 50 },
      { items: { "Pizza Margherita": 1 }, weight: 30 },
    ],
  },
  "Gold Food Box": {
    rewards: [
      { items: { "Shroom Syrup": 3 }, weight: 100 },
      { items: { "Honey Cheddar": 3 }, weight: 100 },
      { items: { "Lemon Cheesecake": 3 }, weight: 100 },
      { items: { "Pizza Margherita": 3 }, weight: 100 },
      { items: { "Pizza Margherita": 5 }, weight: 100 },
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
