/**
 * Beetle Feeds are Beetle-assisted alternatives to the existing animal feeds.
 * They join `AnimalFoodName` together with their recipes and XP values.
 */
export const BEETLE_FEEDS = [
  "Brown Beetle Feed",
  "Blue Beetle Feed",
  "Pink Beetle Feed",
  "Amber Beetle Feed",
] as const;

export type BeetleFeedName = (typeof BEETLE_FEEDS)[number];
