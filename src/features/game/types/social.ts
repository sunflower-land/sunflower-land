import { InventoryItemName } from "./game";

export type TwitterPostName = `WEEKLY` | `FARM` | `FLOWER` | `RONIN`;

export const TWITTER_HASHTAGS: Record<TwitterPostName, string> = {
  WEEKLY: "#SunflowerLandWeekly",
  FARM: "#SunflowerLandFarm",
  FLOWER: "#SunflowerLandFlower",
  RONIN: "#FlowerOnRonin",
};

export type TwitterReward = {
  items: Partial<Record<InventoryItemName, number>>;
};

export const TWITTER_REWARDS: Record<TwitterPostName, TwitterReward> = {
  WEEKLY: {
    items: { "Love Charm": 50 },
  },
  FARM: {
    items: { "Love Charm": 10 },
  },
  FLOWER: {
    items: { "Love Charm": 50 },
  },
  RONIN: {
    items: {}, // Handle differently for users
  },
};

export type TwitterPost = {
  completedAt: number;
  tweetIds: string[];
};
