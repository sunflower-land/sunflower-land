import { BB_TO_GEM_RATIO, InventoryItemName, Wardrobe } from "./game";
import { SEASONS } from "./seasons";

export type ChestReward = {
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Partial<Wardrobe>;
  sfl?: number;
  coins?: number;
  weighting: number;
};

const multiplier = 900;

const SEASONAL_REWARDS: (weight: number) => ChestReward[] = (weight) => {
  const isWindsOfChangeChapter =
    Date.now() >= SEASONS["Winds of Change"].startDate.getTime() &&
    Date.now() < SEASONS["Winds of Change"].endDate.getTime();

  if (isWindsOfChangeChapter) {
    return [
      // Deco
      { items: { Kite: 1 }, weighting: weight * (multiplier / 2) },
      { items: { "Acorn House": 1 }, weighting: weight * (multiplier / 2) },
      { items: { "Ugly Duckling": 1 }, weighting: weight * (multiplier / 5) },
      { items: { "Spring Duckling": 1 }, weighting: weight * (multiplier / 5) },
      { items: { "Lake Rug": 1 }, weighting: weight * (multiplier / 5) },
      {
        items: { "Cup of Chocolate": 1 },
        weighting: weight * (multiplier / 25),
      },

      //SFTs - Utility
      { items: { Mammoth: 1 }, weighting: weight * (multiplier / 25) },

      // Wearables

      // Wearables - Utility
      { wearables: { "Crab Hat": 1 }, weighting: weight * (multiplier / 25) },
      {
        wearables: { "Ladybug Suit": 1 },
        weighting: weight * (multiplier / 10),
      },

      // Leftovers
      { items: { Crimsteel: 1 }, weighting: weight * (multiplier / 2) },
      { items: { "Royal Ornament": 1 }, weighting: weight * (multiplier / 2) },
      { items: { "Royal Bedding": 1 }, weighting: weight * (multiplier / 2) },
      { items: { "Sturdy Bed": 1 }, weighting: weight * (multiplier / 2) },

      // Animals Feed
      { items: { "Kernel Blend": 100 }, weighting: weight * multiplier },
      { items: { Hay: 75 }, weighting: weight * multiplier },
      { items: { NutriBarley: 50 }, weighting: weight * multiplier },
      { items: { "Mixed Grain": 25 }, weighting: weight * multiplier },
      { items: { Omnifeed: 50 }, weighting: weight * multiplier },

      // Mega item
      {
        wearables: { Sickle: 1 },
        weighting: weight * (multiplier / 50),
      },
    ];
  } else {
    return [];
  }
};

export const BASIC_REWARDS: () => ChestReward[] = () => [
  { coins: 1600, weighting: 100 * multiplier },
  { coins: 3200, weighting: 50 * multiplier },
  { coins: 8000, weighting: 20 * multiplier },
  { items: { Gem: 1 * BB_TO_GEM_RATIO }, weighting: 100 * multiplier },
  { items: { Gem: 2 * BB_TO_GEM_RATIO }, weighting: 50 * multiplier },
  { items: { Gem: 5 * BB_TO_GEM_RATIO }, weighting: 20 * multiplier },
  { items: { Gem: 10 * BB_TO_GEM_RATIO }, weighting: 5 * multiplier },
  {
    items: { Axe: 5, Pickaxe: 5, "Stone Pickaxe": 5 },
    weighting: 100 * multiplier,
  },
  { items: { "Iron Pickaxe": 10 }, weighting: 10 * multiplier },
  { items: { Rod: 10 }, weighting: 20 * multiplier },
  { items: { "Rapid Root": 10, "Sprout Mix": 10 }, weighting: 50 * multiplier },
  { items: { "Fishing Lure": 10 }, weighting: 10 * multiplier },
  { items: { "Pirate Cake": 5 }, weighting: 5 * multiplier },
  { items: { "Wheat Cake": 3 }, weighting: 20 * multiplier },
  { items: { "Goblin Brunch": 3 }, weighting: 30 * multiplier },
  { items: { "Bumpkin Roast": 3 }, weighting: 40 * multiplier },
  { items: { "Fermented Carrots": 5 }, weighting: 50 * multiplier },
  { items: { "Blueberry Jam": 3 }, weighting: 100 * multiplier },
  { items: { Rug: 1 }, weighting: 25 * multiplier },
  { items: { "Prize Ticket": 1 }, weighting: 5 * multiplier },
  ...SEASONAL_REWARDS(5), // Multiplier is applied in SEASONAL_REWARDS so no need to multiply by multiplier
];

export const RARE_REWARDS: () => ChestReward[] = () => [
  { coins: 1600, weighting: 50 * multiplier },
  { coins: 3200, weighting: 100 * multiplier },
  { coins: 8000, weighting: 50 * multiplier },
  { coins: 16000, weighting: 20 * multiplier },
  { items: { Gem: 1 * BB_TO_GEM_RATIO }, weighting: 50 * multiplier },
  { items: { Gem: 2 * BB_TO_GEM_RATIO }, weighting: 100 * multiplier },
  { items: { Gem: 5 * BB_TO_GEM_RATIO }, weighting: 50 * multiplier },
  { items: { Gem: 10 * BB_TO_GEM_RATIO }, weighting: 20 * multiplier },
  { items: { Gem: 25 * BB_TO_GEM_RATIO }, weighting: 10 * multiplier },
  { items: { Gem: 50 * BB_TO_GEM_RATIO }, weighting: 5 * multiplier },
  {
    items: { Axe: 15, Pickaxe: 15, "Stone Pickaxe": 15 },
    weighting: 50 * multiplier,
  },
  { items: { "Gold Pickaxe": 3 }, weighting: 50 * multiplier },
  { items: { "Oil Drill": 3 }, weighting: 25 * multiplier },
  {
    items: { Rod: 5, Earthworm: 5, "Red Wiggler": 5, Grub: 5 },
    weighting: 50 * multiplier,
  },
  { items: { "Fishing Lure": 25 }, weighting: 25 * multiplier },
  { items: { "Pirate Cake": 5 }, weighting: 30 * multiplier },
  { items: { "Wheat Cake": 3 }, weighting: 20 * multiplier },
  { items: { "Goblin Brunch": 3 }, weighting: 50 * multiplier },
  { items: { "Bumpkin Roast": 3 }, weighting: 40 * multiplier },
  { items: { "Prize Ticket": 1 }, weighting: 20 * multiplier },
  ...SEASONAL_REWARDS(25), // Multiplier is applied in SEASONAL_REWARDS so no need to multiply by multiplier
];

export const LUXURY_REWARDS: () => ChestReward[] = () => [
  { coins: 3200, weighting: 50 * multiplier },
  { coins: 8000, weighting: 100 * multiplier },
  { coins: 16000, weighting: 50 * multiplier },
  { items: { Gem: 5 * BB_TO_GEM_RATIO }, weighting: 50 * multiplier },
  { items: { Gem: 10 * BB_TO_GEM_RATIO }, weighting: 100 * multiplier },
  { items: { Gem: 25 * BB_TO_GEM_RATIO }, weighting: 25 * multiplier },
  { items: { Gem: 50 * BB_TO_GEM_RATIO }, weighting: 10 * multiplier },
  { items: { "Gold Pickaxe": 10 }, weighting: 75 * multiplier },
  { items: { "Oil Drill": 5 }, weighting: 50 * multiplier },
  {
    items: { Rod: 10, Earthworm: 10, "Red Wiggler": 10, Grub: 10 },
    weighting: 50 * multiplier,
  },
  { items: { "Fishing Lure": 25 }, weighting: 25 * multiplier },
  { items: { "Pirate Cake": 10 }, weighting: 50 * multiplier },
  { items: { "Goblin Brunch": 10 }, weighting: 25 * multiplier },
  { items: { "Bumpkin Roast": 10 }, weighting: 25 * multiplier },
  { items: { "Prize Ticket": 1 }, weighting: 50 * multiplier },
  ...SEASONAL_REWARDS(25), // Multiplier is applied in SEASONAL_REWARDS so no need to multiply by multiplier
];

export const BUD_BOX_REWARDS: ChestReward[] = [
  { items: { "Gold Pickaxe": 3 }, weighting: 5 },
  { items: { Grub: 3, Earthworm: 3, "Red Wiggler": 3 }, weighting: 10 },
  { items: { "Pirate Cake": 3 }, weighting: 5 },
  { items: { "Red Pansy": 2 }, weighting: 10 },
  { items: { "Purple Cosmos": 2 }, weighting: 10 },
  { wearables: { "Seedling Hat": 1 }, weighting: 1 },
  { items: { "Prize Ticket": 1 }, weighting: 10 },
  { items: { "Oil Drill": 2 }, weighting: 5 },
  { items: { "Shroom Syrup": 1 }, weighting: 5 },
  { items: { Antipasto: 1, "Steamed Red Rice": 1 }, weighting: 5 },
  { items: { "Beetroot Blaze": 1, "Rapid Roast": 1 }, weighting: 5 },
  { items: { "White Carrot": 1 }, weighting: 10 },
  { items: { "Warty Goblin Pumpkin": 1 }, weighting: 5 },
  { items: { "Rapid Root": 10, "Sprout Mix": 10 }, weighting: 10 },
];

export const GIFT_GIVER_REWARDS: ChestReward[] = [
  { items: { "Radish Cake": 1 }, weighting: 15 },
  { items: { "Pirate Cake": 1 }, weighting: 10 },
  { items: { "Fishing Lure": 3 }, weighting: 10 },
  { items: { Grub: 3, Earthworm: 3, "Red Wiggler": 3 }, weighting: 5 },
  { items: { "Carrot Cake": 1 }, weighting: 5 },
  { items: { "Cabbage Cake": 1 }, weighting: 5 },
  { items: { "Cauliflower Cake": 1 }, weighting: 5 },
  { items: { Rod: 3 }, weighting: 5 },
  { items: { Pickaxe: 3, "Stone Pickaxe": 2 }, weighting: 5 },
];

export const PIRATE_CHEST_REWARDS: ChestReward[] = [
  { items: { "Sand Shovel": 5 }, weighting: 20 },
  { items: { Grub: 5 }, weighting: 10 },
  { items: { Earthworm: 5 }, weighting: 10 },
  { items: { "Sand Shovel": 10 }, weighting: 10 },
  { items: { "Sand Drill": 1 }, weighting: 10 },
  { items: { Seaweed: 3 }, weighting: 10 },
  { items: { Orange: 5 }, weighting: 10 },
  { items: { "Orange Cake": 1 }, weighting: 10 },
  { items: { Sand: 20 }, weighting: 10 },
  { items: { Hieroglyph: 1 }, weighting: 10 },
  { items: { "Pirate Cake": 1 }, weighting: 5 },
];

// 1-3 days
export const BASIC_DESERT_STREAK: ChestReward[] = [
  { items: { "Clam Shell": 1 }, weighting: 20 },
  { items: { Pipi: 1 }, weighting: 20 },
  { items: { "Sand Shovel": 10 }, weighting: 15 },
  { items: { "Sand Drill": 2 }, weighting: 10 },
  { items: { "Radish Cake": 1 }, weighting: 15 },
  { items: { "Wheat Cake": 1 }, weighting: 20 },
  { items: { "Treasure Key": 1 }, weighting: 10 },
];

// 4-10 days
export const ADVANCED_DESERT_STREAK: ChestReward[] = [
  { items: { "Clam Shell": 2 }, weighting: 10 },
  { items: { "Treasure Key": 1 }, weighting: 10 },
  { items: { "Pirate Cake": 1 }, weighting: 10 },
  { items: { "Sand Shovel": 10 }, weighting: 15 },
  { items: { "Sand Drill": 2 }, weighting: 15 },
  { items: { "Prize Ticket": 1 }, weighting: 1 },
  { items: { Pearl: 1 }, weighting: 5 },
];

// 11+ days
export const EXPERT_DESERT_STREAK: ChestReward[] = [
  { items: { "Pirate Bounty": 1 }, weighting: 5 },
  { items: { Pearl: 1 }, weighting: 10 },
  { items: { "Prize Ticket": 1 }, weighting: 5 },
  { items: { "Rare Key": 1 }, weighting: 5 },
  { items: { "Sand Shovel": 15 }, weighting: 20 },
  { items: { "Sand Drill": 3 }, weighting: 5 },
  { items: { "Pirate Cake": 1 }, weighting: 5 },
  { items: { "Shroom Syrup": 1 }, weighting: 1 },
];

export const MANEKI_NEKO_REWARDS: ChestReward[] = [
  { items: { "Pumpkin Soup": 1 }, weighting: 50 },
  { items: { "Cauliflower Burger": 1 }, weighting: 35 },
  { items: { "Mashed Potato": 1 }, weighting: 30 },
  { items: { "Boiled Eggs": 1 }, weighting: 30 },
  { items: { "Bumpkin Broth": 1 }, weighting: 30 },
  { items: { "Sunflower Crunch": 1 }, weighting: 20 },
  { items: { "Bumpkin Salad": 1 }, weighting: 15 },
  { items: { "Goblin's Treat": 1 }, weighting: 15 },
  { items: { "Kale Stew": 1 }, weighting: 10 },
  { items: { "Sunflower Cake": 1 }, weighting: 5 },
];

export const FESTIVE_TREE_REWARDS: ChestReward[] = [
  { items: { "Treasure Key": 1 }, wearables: {}, weighting: 20 },
  { items: { "Golden Christmas Stocking": 1 }, wearables: {}, weighting: 20 },
  { items: { "Christmas Candle": 1 }, wearables: {}, weighting: 20 },
  { items: { "Christmas Rug": 1 }, wearables: {}, weighting: 20 },
  { items: { "Rare Key": 1 }, wearables: {}, weighting: 10 },
  { items: {}, wearables: { "Candy Cane": 1 }, weighting: 10 },
];
