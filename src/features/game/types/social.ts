import { InventoryItemName } from "./game";

export type TwitterPostName = `WEEKLY` | `FARM` | `FLOWER`;

export const TWITTER_HASHTAGS: Record<TwitterPostName, string> = {
  WEEKLY: "#SunflowerLandWeekly",
  FARM: "#SunflowerLandFarm",
  FLOWER: "#SunflowerLandFlower",
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
};

export type TwitterPost = {
  completedAt: number;
  tweetIds: string[];
};
