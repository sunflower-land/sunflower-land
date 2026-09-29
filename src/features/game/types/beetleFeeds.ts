import type { AnimalFoodName } from "./game";

/**
 * Beetle Feeds are Beetle-assisted alternatives to the existing animal feeds.
 * They are part of `AnimalFoodName` and mixed in the Feeder Machine.
 */
export const BEETLE_FEEDS = [
  "Brown Beetle Feed",
  "Blue Beetle Feed",
  "Pink Beetle Feed",
  "Amber Beetle Feed",
] as const;

export type BeetleFeedName = (typeof BEETLE_FEEDS)[number];

export function isBeetleFeed(item: string): item is BeetleFeedName {
  return (BEETLE_FEEDS as readonly string[]).includes(item);
}

/**
 * The feed each Beetle Feed stands in for. It can only be fed while that feed
 * is the animal's favourite.
 */
export const BEETLE_FEED_REPLACES: Record<BeetleFeedName, AnimalFoodName> = {
  "Brown Beetle Feed": "Kernel Blend",
  "Blue Beetle Feed": "Hay",
  "Pink Beetle Feed": "NutriBarley",
  "Amber Beetle Feed": "Mixed Grain",
};
