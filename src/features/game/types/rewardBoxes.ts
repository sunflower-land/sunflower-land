import { InventoryItemName, Wardrobe } from "./game";

export type RewardBox = {
  spunAt?: number;
  reward?: {
    coins?: number;
    vipDays?: number;
    items?: Partial<Record<InventoryItemName, number>>;
    wearables?: Partial<Wardrobe>;
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
  | "Bronze Flower Box"
  | "Silver Flower Box"
  | "Gold Flower Box";

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
  "Bronze Love Box": {
    rewards: [
      { items: { Gem: 100 }, weight: 100 },
      { vipDays: 3, weight: 100 },
      { coins: 1500, weight: 100 },
      { items: { "Time Warp Totem": 1 }, weight: 100 },
      { items: { "Pirate Cake": 3 }, weight: 100 },
      { items: { Antipasto: 3 }, weight: 100 },
      { items: { Sunstone: 1 }, weight: 100 },
      { items: { "Fishing Lure": 5 }, weight: 100 },
      { items: { "Pizza Margherita": 1 }, weight: 50 },
      { items: { "Love Charm": 500 }, weight: 50 },
      { items: { "Super Totem": 1 }, weight: 50 },
      { items: { Gem: 250 }, weight: 50 },
    ],
  },
  "Silver Love Box": {
    rewards: [
      { coins: 100, weight: 100 }, // Corn
      { coins: 100, weight: 75 }, // Butterfly
    ],
  },
  "Gold Love Box": {
    rewards: [
      { coins: 100, weight: 100 }, // Lifeguard,
      { coins: 100, weight: 100 }, // Boater Crow,
    ],
  },
  "Bronze Flower Box": {
    rewards: [
      { flower: 1, weight: 100 },
      { flower: 2, weight: 100 },
      { flower: 5, weight: 100 },
      { flower: 10, weight: 100 },
    ],
  },
  "Silver Flower Box": {
    rewards: [
      { flower: 1, weight: 100 },
      { flower: 2, weight: 100 },
      { flower: 5, weight: 100 },
      { flower: 10, weight: 100 },
    ],
  },
  "Gold Flower Box": {
    rewards: [
      { flower: 1, weight: 100 },
      { flower: 2, weight: 100 },
      { flower: 5, weight: 100 },
      { flower: 10, weight: 100 },
    ],
  },
};
