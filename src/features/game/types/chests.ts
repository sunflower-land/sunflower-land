import { InventoryItemName, Wardrobe } from "./game";
import { SEASONS } from "./seasons";

export type ChestReward = {
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Partial<Wardrobe>;
  sfl?: number;
  weighting: number;
  coins?: number;
};

const SEASONAL_REWARDS: (weight: number) => ChestReward[] = (weight) =>
  Date.now() >= SEASONS["Pharaoh's Treasure"].startDate.getTime() &&
  Date.now() < SEASONS["Pharaoh's Treasure"].endDate.getTime()
    ? [
        { wearables: { "Grape Pants": 1 }, weighting: weight },
        { items: { "Paper Reed": 1 }, weighting: weight },
      ]
    : [];

export const BASIC_REWARDS: () => ChestReward[] = () => [
  { sfl: 5, weighting: 100 },
  { sfl: 10, weighting: 50 },
  { sfl: 25, weighting: 20 },
  { items: { "Block Buck": 1 }, weighting: 100 },
  { items: { "Block Buck": 2 }, weighting: 50 },
  { items: { "Block Buck": 5 }, weighting: 20 },
  { items: { "Block Buck": 10 }, weighting: 5 },
  { items: { Axe: 5, Pickaxe: 5, "Stone Pickaxe": 5 }, weighting: 100 },
  { items: { "Iron Pickaxe": 10 }, weighting: 10 },
  { items: { Rod: 10 }, weighting: 20 },
  { items: { "Rapid Root": 10, "Sprout Mix": 10 }, weighting: 50 },
  { items: { "Fishing Lure": 10 }, weighting: 10 },
  { items: { "Pirate Cake": 5 }, weighting: 5 },
  { items: { "Wheat Cake": 3 }, weighting: 20 },
  { items: { "Goblin Brunch": 3 }, weighting: 30 },
  { items: { "Bumpkin Roast": 3 }, weighting: 40 },
  { items: { "Fermented Carrots": 5 }, weighting: 50 },
  { items: { "Blueberry Jam": 3 }, weighting: 100 },
  { wearables: { "Fox Hat": 1 }, weighting: 50 },
  { items: { "Time Warp Totem": 1 }, weighting: 25 },
  { items: { Rug: 1 }, weighting: 25 },
  { items: { "Prize Ticket": 1 }, weighting: 5 },
  ...SEASONAL_REWARDS(5),
];

export const RARE_REWARDS: () => ChestReward[] = () => [
  { sfl: 5, weighting: 50 },
  { sfl: 10, weighting: 100 },
  { sfl: 25, weighting: 50 },
  { sfl: 50, weighting: 20 },
  { items: { "Block Buck": 1 }, weighting: 50 },
  { items: { "Block Buck": 2 }, weighting: 100 },
  { items: { "Block Buck": 5 }, weighting: 50 },
  { items: { "Block Buck": 10 }, weighting: 20 },
  { items: { "Block Buck": 25 }, weighting: 10 },
  { items: { "Block Buck": 50 }, weighting: 5 },
  { items: { Axe: 15, Pickaxe: 15, "Stone Pickaxe": 15 }, weighting: 50 },
  { items: { "Gold Pickaxe": 3 }, weighting: 50 },
  { items: { "Oil Drill": 3 }, weighting: 25 },
  { items: { Rod: 5, Earthworm: 5, "Red Wiggler": 5, Grub: 5 }, weighting: 50 },
  { items: { "Fishing Lure": 25 }, weighting: 25 },
  { items: { "Pirate Cake": 5 }, weighting: 30 },
  { items: { "Wheat Cake": 3 }, weighting: 20 },
  { items: { "Goblin Brunch": 3 }, weighting: 50 },
  { items: { "Bumpkin Roast": 3 }, weighting: 40 },
  { wearables: { "Fox Hat": 1 }, weighting: 25 },
  { items: { "Time Warp Totem": 1 }, weighting: 25 },
  { items: { "Prize Ticket": 1 }, weighting: 20 },
  { items: { "Twister Rug": 1 }, weighting: 25 },
  ...SEASONAL_REWARDS(25),
];

export const LUXURY_REWARDS: () => ChestReward[] = () => [
  { sfl: 10, weighting: 50 },
  { sfl: 25, weighting: 100 },
  { sfl: 50, weighting: 50 },
  { items: { "Block Buck": 5 }, weighting: 50 },
  { items: { "Block Buck": 10 }, weighting: 100 },
  { items: { "Block Buck": 25 }, weighting: 25 },
  { items: { "Block Buck": 50 }, weighting: 10 },
  { items: { "Gold Pickaxe": 10 }, weighting: 75 },
  { items: { "Oil Drill": 5 }, weighting: 50 },
  {
    items: { Rod: 10, Earthworm: 10, "Red Wiggler": 10, Grub: 10 },
    weighting: 50,
  },
  { items: { "Fishing Lure": 25 }, weighting: 25 },
  { items: { "Pirate Cake": 10 }, weighting: 50 },
  { items: { "Goblin Brunch": 10 }, weighting: 25 },
  { items: { "Bumpkin Roast": 10 }, weighting: 25 },
  { items: { "Time Warp Totem": 1 }, weighting: 25 },
  { items: { "Prize Ticket": 1 }, weighting: 50 },
  ...SEASONAL_REWARDS(25),
];

export const BUD_BOX_REWARDS: ChestReward[] = [
  { items: { "Gold Pickaxe": 3 }, weighting: 5 },
  { items: { "Rapid Root": 10, "Sprout Mix": 10 }, weighting: 10 },
  { items: { Grub: 3, Earthworm: 3, "Red Wiggler": 3 }, weighting: 10 },
  { items: { "Pirate Cake": 3 }, weighting: 5 },
  { items: { "Red Pansy": 2 }, weighting: 10 },
  { items: { "Purple Cosmos": 2 }, weighting: 10 },
  { items: { "Time Warp Totem": 1 }, weighting: 10 },
  { wearables: { "Seedling Hat": 1 }, weighting: 1 },
  { items: { "Prize Ticket": 1 }, weighting: 10 },
  { items: { "Oil Drill": 2 }, weighting: 5 },
  { items: { "Shroom Syrup": 1 }, weighting: 5 },
  { items: { Antipasto: 1, "Steamed Red Rice": 1 }, weighting: 5 },
  { items: { "Beetroot Blaze": 1, "Rapid Roast": 1 }, weighting: 5 },
  { items: { "White Carrot": 1 }, weighting: 10 },
  { items: { "Warty Goblin Pumpkin": 1 }, weighting: 5 },
];

export const GIFT_GIVER_REWARDS: ChestReward[] = [
  { items: { "Radish Cake": 1 }, weighting: 15 },
  { items: {}, coins: 2500, weighting: 12 },
  { items: { "Pirate Cake": 1 }, weighting: 10 },
  { items: { "Fishing Lure": 3 }, weighting: 10 },
  { items: { "Prize Ticket": 1 }, weighting: 5 },
  { items: { Grub: 3, Earthworm: 3, "Red Wiggler": 3 }, weighting: 5 },
  { items: {}, coins: 5000, weighting: 5 },
  { items: { "Block Buck": 1 }, sfl: 0, weighting: 5 },
  { items: {}, sfl: 5, weighting: 3 },
];

// 1-3 days
export const BASIC_DESERT_STREAK: ChestReward[] = [
  {
    items: {
      "Clam Shell": 1,
    },
    weighting: 20,
  },
  {
    items: {
      Pipi: 1,
    },
    weighting: 20,
  },
  {
    items: {
      "Sand Shovel": 10,
    },
    weighting: 15,
  },
  {
    items: {
      "Sand Drill": 2,
    },
    weighting: 10,
  },
  {
    items: {
      "Radish Cake": 1,
    },
    weighting: 15,
  },
  {
    items: {
      "Wheat Cake": 1,
    },
    weighting: 20,
  },
  {
    items: {
      "Treasure Key": 1,
    },
    weighting: 10,
  },
];

// 4-10 days
export const ADVANCED_DESERT_STREAK: ChestReward[] = [
  {
    items: {
      "Clam Shell": 2,
    },
    weighting: 10,
  },
  {
    items: {
      "Treasure Key": 1,
    },
    weighting: 10,
  },
  {
    items: {
      "Pirate Cake": 1,
    },
    weighting: 10,
  },
  {
    items: {
      "Sand Shovel": 10,
    },
    weighting: 15,
  },
  {
    items: {
      "Sand Drill": 2,
    },
    weighting: 15,
  },
  {
    items: {
      "Prize Ticket": 1,
    },
    weighting: 1,
  },
  {
    items: {
      Pearl: 1,
    },
    weighting: 5,
  },
];

// 11+ days
export const EXPERT_DESERT_STREAK: ChestReward[] = [
  {
    items: {
      "Pirate Bounty": 1,
    },
    weighting: 5,
  },
  {
    items: {
      Pearl: 1,
    },
    weighting: 10,
  },
  {
    items: {
      "Prize Ticket": 1,
    },
    weighting: 5,
  },
  {
    items: {
      "Rare Key": 1,
    },
    weighting: 5,
  },
  {
    items: {
      "Sand Shovel": 15,
    },
    weighting: 20,
  },
  {
    items: {
      "Sand Drill": 3,
    },
    weighting: 5,
  },
  {
    items: {
      "Pirate Cake": 1,
    },
    weighting: 5,
  },
  {
    items: {
      "Shroom Syrup": 1,
    },
    weighting: 1,
  },
];
