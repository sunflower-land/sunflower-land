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

/**
 * Bronze rewards
 * 
 * 100 Gems (10%)
3 VIP Days (10%)
1500 Coins (10%)
Time Warp Totem (10%)
3 x Pirate Cake (10%)
3x Antipasto (10%)
Sunstone (10%)
5 x Lure (10%)
Margarita Pizza (5%)
500 Love Charms (5%)
Super Totem (5%)
250 Gems (5%)

 */

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
};
