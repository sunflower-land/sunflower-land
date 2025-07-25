import { BoostName, BoostUsedAt } from "../types/game";
import { BudNFTName } from "./marketplace";

const ONE_DAY = 24 * 60 * 60 * 1000;

// Configuration object for boost cooldown restrictions
const BOOST_COOLDOWN_DAYS: Partial<Record<BoostName, number>> = {
  // General Crop Boosts - 2 days
  "Green Amulet": 2,
  Kuebiko: 2,
  Scarecrow: 2,
  Nancy: 2,
  "Lunar Calendar": 2,
  "Solflare Aegis": 2,
  "Autumn's Embrace": 2,
  "Blossom Ward": 2,
  "Frozen Heart": 2,
  "Knowledge Crab": 2,
  "Infernal Pitchfork": 2,
  "Sir Goldensnout": 2,
  "Angel Wings": 2,
  "Devil Wings": 2,

  // Advanced Crop Boosts - 2 days
  Gnome: 2,
  Hoot: 2,
  Foliant: 2,
  Sickle: 2,
  "Sheaf of Plenty": 2,
  "Giant Kale": 2,
  "Lab Grown Radish": 2,
  "Radical Radish": 2,

  // Greenhouse Crop Boosts - 2 days
  "Non La Hat": 2,
  "Rice Panda": 2,
  "Pharaoh Gnome": 2,
  "Olive Shield": 2,
  "Olive Royalty Shirt": 2,
  "Turbo Sprout": 2,

  // Obsidian - 3 days
  "Obsidian Necklace": 3,
  "Obsidian Turtle": 3,

  // Flower Boosts - 5 days
  "Flower Crown": 5,
  "Flower Fox": 5,
  "Humming Bird": 5,
  Butterfly: 5,
  "Desert Rose": 5,
  Chicory: 5,

  "Crimstone Hammer": 5,
  "Grinx's Hammer": 7,
  // Add other boost items with their respective cooldown days
  // Default items will use 1 day if not specified here
  // Buds would have a cooldown of 2 days
};

// Default cooldown for items not specified in the configuration
const DEFAULT_COOLDOWN_DAYS = 1;

const isBudBoost = (item: BoostName): item is BudNFTName => {
  return item.startsWith("Bud #");
};

export function hasBoostRestriction({
  boostUsedAt,
  createdAt = Date.now(),
  item,
}: {
  boostUsedAt: BoostUsedAt | undefined;
  createdAt?: number;
  item: BoostName;
}): { isRestricted: boolean; cooldownTimeLeft: number } {
  if (!boostUsedAt) return { isRestricted: false, cooldownTimeLeft: 0 };

  const itemBoostUsedAt = boostUsedAt[item];

  if (!itemBoostUsedAt) return { isRestricted: false, cooldownTimeLeft: 0 };

  // Get cooldown days from configuration or use default
  const cooldownDays =
    BOOST_COOLDOWN_DAYS[item] ??
    (isBudBoost(item) ? DEFAULT_COOLDOWN_DAYS * 2 : DEFAULT_COOLDOWN_DAYS);
  const cooldownMs = ONE_DAY * cooldownDays;

  return {
    isRestricted: itemBoostUsedAt > createdAt - cooldownMs,
    cooldownTimeLeft: cooldownMs - (createdAt - itemBoostUsedAt),
  };
}
