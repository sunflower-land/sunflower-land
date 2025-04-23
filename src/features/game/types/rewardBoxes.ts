import { InventoryItemName, Wardrobe } from "./game";

export type RewardBox = {
  spunAt?: number;
  reward?: {
    coins?: number;
    vipDays?: number;
    items?: Partial<Record<InventoryItemName, number>>;
    wearables?: Partial<Wardrobe>;
  };
  history: Partial<Record<InventoryItemName, number>>;
};

export type RewardBoxName =
  | "Bronze Love Box"
  | "Silver Love Box"
  | "Gold Love Box";

export type RewardBoxes = Partial<Record<RewardBoxName, RewardBox>>;

export type RewardBoxReward = {
  weight: number;
  coins?: number;
  vipDays?: number;
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Partial<Wardrobe>;
};

type RewardBoxDetails = {
  rewards: RewardBoxReward[];
};

export const REWARD_BOXES: Record<RewardBoxName, RewardBoxDetails> = {
  "Bronze Love Box": {
    rewards: [
      { coins: 100, weight: 100 },
      { coins: 100, vipDays: 1, weight: 100 },
      { items: { Sunflower: 1 }, weight: 100 },
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
};
