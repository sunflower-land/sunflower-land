import { InventoryItemName, Wardrobe } from "./game";

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
  | "Gold Food Box";

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
      { coins: 5000, weight: 100 },
      { coins: 10000, weight: 50 },
      { items: { "Pizza Margherita": 1 }, weight: 100 },
      { items: { "Pizza Margherita": 3 }, weight: 50 },
      { items: { "Fishing Lure": 50 }, weight: 50 },
      { items: { Gem: 200 }, weight: 50 },
      { items: { Gem: 500 }, weight: 25 },
      { items: { "Super Totem": 1 }, weight: 25 },
      { vipDays: 7, weight: 50 },
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
      { items: { Shovel: 10 }, weight: 25 },
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
      { items: { Shovel: 100 }, weight: 30 },
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
