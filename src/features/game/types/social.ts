import { hasVipAccess } from "../lib/vipAccess";
import type { GameState, InventoryItemName } from "./game";
import type { Equipped } from "./bumpkin";

export type TwitterPostName = `WEEKLY` | `FARM`;

export const TWITTER_HASHTAGS: Record<TwitterPostName, string> = {
  WEEKLY: "#SunflowerLandWeekly",
  FARM: "#SunflowerLandFarm",
  // FLOWER: "#SunflowerLandFlower", Sunsetted 7th October
  // RONIN: "#FlowerOnRonin",
};

export type TwitterReward = {
  items: (
    game: GameState,
    now: number,
  ) => Partial<Record<InventoryItemName, number>>;
};

export const TWITTER_REWARDS: Record<TwitterPostName, TwitterReward> = {
  WEEKLY: {
    items: (game: GameState, now: number) => {
      if (!hasVipAccess({ game, now })) {
        return { "Bronze Food Box": 1 };
      }

      return { "Love Charm": 50, "Bronze Food Box": 1 };
    },
  },
  FARM: {
    items: (game: GameState, now: number) => {
      if (!hasVipAccess({ game, now })) {
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

/**
 * A tweet showcased by the team in the in-game Community feed.
 * Mirrors the backend `ShowcasedTweet` shape returned by `/data`.
 */
export type ShowcasedTweet = {
  tweetId: string;
  url: string;
  content: string;
  image?: string;
  postedAt: number;
  showcasedAt: number;
  authorFarmId: number;
  authorUsername?: string;
  twitterHandle: string;
  bumpkin: Equipped;
};

/**
 * A farm design featured by the team in the in-game Design Showcase.
 * Mirrors the backend `ShowcasedDesign` shape returned by `/data`.
 */
export type ShowcasedDesign = {
  messageId: string;
  farmId: number;
  username?: string;
  /** Discord display name, used as a fallback when no farm username is set. */
  displayName?: string;
  image: string;
  showcasedAt: number;
  bumpkin: Equipped;
};
