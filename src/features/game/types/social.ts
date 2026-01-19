import { hasVipAccess } from "../lib/vipAccess";
import { GameState, InventoryItemName } from "./game";

export type TwitterPostName = `WEEKLY` | `FARM`;

export const TWITTER_HASHTAGS: Record<TwitterPostName, string> = {
  WEEKLY: "#SunflowerLandWeekly",
  FARM: "#SunflowerLandFarm",
  // FLOWER: "#SunflowerLandFlower", Sunsetted 7th October
  // RONIN: "#FlowerOnRonin",
};

export type TwitterReward = {
  items: (game: GameState) => Partial<Record<InventoryItemName, number>>;
};

export const TWITTER_REWARDS: Record<TwitterPostName, TwitterReward> = {
  WEEKLY: {
    items: (game: GameState) => {
      if (!hasVipAccess({ game })) {
        return { "Bronze Food Box": 1 };
      }

      return { "Love Charm": 50, "Bronze Food Box": 1 };
    },
  },
  FARM: {
    items: (game: GameState) => {
      if (!hasVipAccess({ game })) {
        return { "Bronze Tool Box": 1 };
      }

      return { "Love Charm": 10, "Bronze Tool Box": 1 };
    },
  },
};

export type TwitterPost = {
  completedAt: number;
  tweetIds: string[];
};
