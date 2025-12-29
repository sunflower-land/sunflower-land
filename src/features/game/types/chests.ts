import {
  FLOWER_BOXES,
  isCollectible,
  isWearable,
} from "../events/landExpansion/buyChapterItem";
import { CHAPTER_TICKET_BOOST_ITEMS } from "../events/landExpansion/completeNPCChore";
import { getObjectEntries } from "../expansion/lib/utils";
import { BumpkinItem } from "./bumpkin";
import { ARTEFACT_SHOP_KEYS } from "./collectibles";
import { getKeys } from "./decorations";
import { BB_TO_GEM_RATIO, InventoryItemName } from "./game";
import { MEGASTORE, ChapterStore } from "./megastore";
import { RewardBoxReward } from "./rewardBoxes";
import { getCurrentChapter } from "./chapters";
import { BUMPKIN_RELEASES, INVENTORY_RELEASES } from "./withdrawables";

export const CHEST_MULTIPLIER = 900;

export const MEGASTORE_TIER_WEIGHTS: Record<keyof ChapterStore, number> = {
  basic: 0.5,
  rare: 0.2,
  epic: 0.1,
  mega: 0.05,
};

const currentChapter = getCurrentChapter(Date.now());

export const MEGASTORE_RESTRICTED_ITEMS: (InventoryItemName | BumpkinItem)[] = [
  ...Object.values(CHAPTER_TICKET_BOOST_ITEMS[currentChapter]),
  ...getKeys(FLOWER_BOXES),
  ...getKeys(ARTEFACT_SHOP_KEYS),
  ...getObjectEntries(BUMPKIN_RELEASES)
    .filter(([_, tradeDetail]) => !tradeDetail)
    .map(([wearable]) => wearable),
  ...getObjectEntries(INVENTORY_RELEASES)
    .filter(([_, tradeDetail]) => !tradeDetail)
    .map(([item]) => item),
  "Pet Egg",
];

export const CHAPTER_REWARDS: (
  weight: number,
  chestTier: "basic" | "rare" | "luxury",
) => RewardBoxReward[] = (weight, chestTier) => {
  const store = MEGASTORE[currentChapter];
  const rewards: RewardBoxReward[] = [];

  getObjectEntries(MEGASTORE_TIER_WEIGHTS).forEach(([tier, tierWeight]) => {
    if (chestTier === "basic" && (tier === "mega" || tier === "epic")) return;
    if (chestTier === "rare" && tier === "mega") return;

    const items = store[tier].items;

    items.forEach((item) => {
      if (
        isCollectible(item) &&
        !MEGASTORE_RESTRICTED_ITEMS.includes(item.collectible)
      ) {
        rewards.push({
          items: { [item.collectible]: 1 },
          weighting: weight * tierWeight,
        });
      }
      if (
        isWearable(item) &&
        !MEGASTORE_RESTRICTED_ITEMS.includes(item.wearable)
      ) {
        rewards.push({
          wearables: { [item.wearable]: 1 },
          weighting: weight * tierWeight,
        });
      }
    });
  });

  return rewards;
};

export const BASIC_CHAPTER_REWARDS_WEIGHT = 5 * CHEST_MULTIPLIER;
export const BASIC_REWARDS: () => RewardBoxReward[] = () => [
  { coins: 1600, weighting: 100 * CHEST_MULTIPLIER },
  { coins: 3200, weighting: 50 * CHEST_MULTIPLIER },
  { coins: 8000, weighting: 20 * CHEST_MULTIPLIER },
  { items: { Gem: 1 * BB_TO_GEM_RATIO }, weighting: 100 * CHEST_MULTIPLIER },
  { items: { Gem: 2 * BB_TO_GEM_RATIO }, weighting: 50 * CHEST_MULTIPLIER },
  { items: { Gem: 5 * BB_TO_GEM_RATIO }, weighting: 20 * CHEST_MULTIPLIER },
  { items: { Gem: 10 * BB_TO_GEM_RATIO }, weighting: 5 * CHEST_MULTIPLIER },
  {
    items: { Axe: 5, Pickaxe: 5, "Stone Pickaxe": 5 },
    weighting: 100 * CHEST_MULTIPLIER,
  },
  { items: { "Iron Pickaxe": 10 }, weighting: 10 * CHEST_MULTIPLIER },
  { items: { Rod: 10 }, weighting: 20 * CHEST_MULTIPLIER },
  {
    items: { "Rapid Root": 10, "Sprout Mix": 10 },
    weighting: 50 * CHEST_MULTIPLIER,
  },
  { items: { "Fishing Lure": 10 }, weighting: 10 * CHEST_MULTIPLIER },
  { items: { "Pirate Cake": 5 }, weighting: 5 * CHEST_MULTIPLIER },
  { items: { "Wheat Cake": 3 }, weighting: 20 * CHEST_MULTIPLIER },
  { items: { "Goblin Brunch": 3 }, weighting: 30 * CHEST_MULTIPLIER },
  { items: { "Bumpkin Roast": 3 }, weighting: 40 * CHEST_MULTIPLIER },
  { items: { "Fermented Carrots": 5 }, weighting: 50 * CHEST_MULTIPLIER },
  { items: { "Blueberry Jam": 3 }, weighting: 100 * CHEST_MULTIPLIER },
  { items: { Rug: 1 }, weighting: 25 * CHEST_MULTIPLIER },
  { items: { "Prize Ticket": 1 }, weighting: 5 * CHEST_MULTIPLIER },
  ...CHAPTER_REWARDS(20 * CHEST_MULTIPLIER, "basic"),
];

export const RARE_REWARDS: () => RewardBoxReward[] = () => [
  { coins: 1600, weighting: 50 * CHEST_MULTIPLIER },
  { coins: 3200, weighting: 100 * CHEST_MULTIPLIER },
  { coins: 8000, weighting: 50 * CHEST_MULTIPLIER },
  { coins: 16000, weighting: 20 * CHEST_MULTIPLIER },
  { items: { Gem: 1 * BB_TO_GEM_RATIO }, weighting: 50 * CHEST_MULTIPLIER },
  { items: { Gem: 2 * BB_TO_GEM_RATIO }, weighting: 100 * CHEST_MULTIPLIER },
  { items: { Gem: 5 * BB_TO_GEM_RATIO }, weighting: 50 * CHEST_MULTIPLIER },
  { items: { Gem: 10 * BB_TO_GEM_RATIO }, weighting: 20 * CHEST_MULTIPLIER },
  { items: { Gem: 25 * BB_TO_GEM_RATIO }, weighting: 10 * CHEST_MULTIPLIER },
  { items: { Gem: 50 * BB_TO_GEM_RATIO }, weighting: 5 * CHEST_MULTIPLIER },
  {
    items: { Axe: 15, Pickaxe: 15, "Stone Pickaxe": 15 },
    weighting: 50 * CHEST_MULTIPLIER,
  },
  { items: { "Gold Pickaxe": 3 }, weighting: 50 * CHEST_MULTIPLIER },
  { items: { "Oil Drill": 3 }, weighting: 25 * CHEST_MULTIPLIER },
  {
    items: { Rod: 5, Earthworm: 5, "Red Wiggler": 5, Grub: 5 },
    weighting: 50 * CHEST_MULTIPLIER,
  },
  { items: { "Fishing Lure": 25 }, weighting: 25 * CHEST_MULTIPLIER },
  { items: { "Pirate Cake": 5 }, weighting: 30 * CHEST_MULTIPLIER },
  { items: { "Wheat Cake": 3 }, weighting: 20 * CHEST_MULTIPLIER },
  { items: { "Goblin Brunch": 3 }, weighting: 50 * CHEST_MULTIPLIER },
  { items: { "Bumpkin Roast": 3 }, weighting: 40 * CHEST_MULTIPLIER },
  { items: { "Prize Ticket": 1 }, weighting: 20 * CHEST_MULTIPLIER },
  ...CHAPTER_REWARDS(50 * CHEST_MULTIPLIER, "rare"),
];

export const LUXURY_REWARDS: () => RewardBoxReward[] = () => [
  { coins: 3200, weighting: 50 * CHEST_MULTIPLIER },
  { coins: 8000, weighting: 100 * CHEST_MULTIPLIER },
  { coins: 16000, weighting: 50 * CHEST_MULTIPLIER },
  { items: { Gem: 5 * BB_TO_GEM_RATIO }, weighting: 50 * CHEST_MULTIPLIER },
  { items: { Gem: 10 * BB_TO_GEM_RATIO }, weighting: 100 * CHEST_MULTIPLIER },
  { items: { Gem: 25 * BB_TO_GEM_RATIO }, weighting: 25 * CHEST_MULTIPLIER },
  { items: { Gem: 50 * BB_TO_GEM_RATIO }, weighting: 10 * CHEST_MULTIPLIER },
  { items: { "Gold Pickaxe": 10 }, weighting: 75 * CHEST_MULTIPLIER },
  { items: { "Oil Drill": 5 }, weighting: 50 * CHEST_MULTIPLIER },
  {
    items: { Rod: 10, Earthworm: 10, "Red Wiggler": 10, Grub: 10 },
    weighting: 50 * CHEST_MULTIPLIER,
  },
  { items: { "Fishing Lure": 25 }, weighting: 25 * CHEST_MULTIPLIER },
  { items: { "Pirate Cake": 10 }, weighting: 50 * CHEST_MULTIPLIER },
  { items: { "Goblin Brunch": 10 }, weighting: 25 * CHEST_MULTIPLIER },
  { items: { "Bumpkin Roast": 10 }, weighting: 25 * CHEST_MULTIPLIER },
  { items: { "Prize Ticket": 1 }, weighting: 50 * CHEST_MULTIPLIER },
  ...CHAPTER_REWARDS(50 * CHEST_MULTIPLIER, "luxury"),
];

export const BUD_BOX_REWARDS: RewardBoxReward[] = [
  { items: { "Stone Pickaxe": 15 }, weighting: 15 },
  { items: { "Iron Pickaxe": 10 }, weighting: 8 },
  { items: { "Gold Pickaxe": 5 }, weighting: 3 },
  { items: { "Fishing Lure": 10 }, weighting: 10 },
  { items: { "Pirate Cake": 3 }, weighting: 5 },
  { items: { "Red Lavender": 1, "White Lavender": 1 }, weighting: 20 },
  { items: { "Blue Clover": 1, "Yellow Clover": 1 }, weighting: 20 },
  { items: { "Red Edelweiss": 1, "Purple Edelweiss": 1 }, weighting: 20 },
  { items: { "Blue Gladiolus": 1, "Yellow Gladiolus": 1 }, weighting: 20 },
  { wearables: { "Seedling Hat": 1 }, weighting: 1 },
  { items: { "Prize Ticket": 1 }, weighting: 10 },
  { items: { "Oil Drill": 3 }, weighting: 5 },
  { items: { "Pizza Margherita": 1 }, weighting: 5 },
  { items: { "Spaghetti al Limone": 1 }, weighting: 5 },
  {
    items: { "Beetroot Blaze": 1, "Rapid Roast": 1, "Shroom Syrup": 1 },
    weighting: 10,
  },
  { items: { "White Carrot": 1, "Warty Goblin Pumpkin": 1 }, weighting: 20 },
  { items: { "Adirondack Potato": 1, "Purple Cauliflower": 1 }, weighting: 10 },
  { items: { Chiogga: 1 }, weighting: 5 },
  { items: { "Rapid Root": 30, "Sprout Mix": 30 }, weighting: 20 },
  { items: { Doll: 5 }, weighting: 5 },
  { items: { "Time Warp Totem": 1 }, weighting: 3 },
  { items: { "Luxury Key": 1 }, weighting: 1 },
];

export const GIFT_GIVER_REWARDS: RewardBoxReward[] = [
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

export const PIRATE_CHEST_REWARDS: RewardBoxReward[] = [
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
export const BASIC_DESERT_STREAK: RewardBoxReward[] = [
  { items: { "Clam Shell": 1 }, weighting: 20 },
  { items: { Pipi: 1 }, weighting: 20 },
  { items: { "Sand Shovel": 10 }, weighting: 15 },
  { items: { "Sand Drill": 2 }, weighting: 10 },
  { items: { "Radish Cake": 1 }, weighting: 15 },
  { items: { "Wheat Cake": 1 }, weighting: 20 },
  { items: { "Treasure Key": 1 }, weighting: 10 },
];

// 4-10 days
export const ADVANCED_DESERT_STREAK: RewardBoxReward[] = [
  { items: { "Clam Shell": 2 }, weighting: 10 },
  { items: { "Treasure Key": 1 }, weighting: 10 },
  { items: { "Pirate Cake": 1 }, weighting: 10 },
  { items: { "Sand Shovel": 10 }, weighting: 15 },
  { items: { "Sand Drill": 2 }, weighting: 15 },
  { items: { "Prize Ticket": 1 }, weighting: 1 },
  { items: { Pearl: 1 }, weighting: 5 },
];

// 11+ days
export const EXPERT_DESERT_STREAK: RewardBoxReward[] = [
  { items: { "Pirate Bounty": 1 }, weighting: 5 },
  { items: { Pearl: 1 }, weighting: 10 },
  { items: { "Prize Ticket": 1 }, weighting: 5 },
  { items: { "Rare Key": 1 }, weighting: 5 },
  { items: { "Sand Shovel": 15 }, weighting: 20 },
  { items: { "Sand Drill": 3 }, weighting: 5 },
  { items: { "Pirate Cake": 1 }, weighting: 5 },
  { items: { "Shroom Syrup": 1 }, weighting: 1 },
];

export const MANEKI_NEKO_REWARDS: RewardBoxReward[] = [
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

export const FESTIVE_TREE_REWARDS: RewardBoxReward[] = [
  { items: { "Treasure Key": 1 }, wearables: {}, weighting: 20 },
  { items: { "Bronze Food Box": 1 }, wearables: {}, weighting: 20 },
  { items: { "Bronze Love Box": 1 }, wearables: {}, weighting: 10 },
  { items: { "Bronze Tool Box": 1 }, wearables: {}, weighting: 10 },
  { items: { "Rare Key": 1 }, wearables: {}, weighting: 5 },
  { items: {}, wearables: { "Candy Halbred": 1 }, weighting: 1 },
  { items: {}, wearables: { "Cookie Shield": 1 }, weighting: 1 },
  { items: {}, wearables: { "Cozy Reindeer Onesie": 1 }, weighting: 1 },
];
