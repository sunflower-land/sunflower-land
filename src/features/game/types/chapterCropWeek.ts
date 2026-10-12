import type { SeedName } from "./seeds";
import type { CookableName } from "./consumables";
import type { CropName } from "./crops";
import type { GameState } from "./game";
import { hasFeatureAccess } from "lib/flags";

/**
 * Chapter Crop Week is a one-week limited-time event that runs inside a chapter.
 * During the window players can buy & grow the event crop, cook the event
 * recipe at the Fire Pit (which feeds the backend raffles), and temporarily
 * trade the event crop on the marketplace (VIP-only selling).
 *
 * This file is the single source of truth for the event window and the items
 * that are gated to it. It is imported by the seed shop UI, Fire Pit UI,
 * marketplace UI, and the backend purchase/cook gates.
 *
 * Previous runs (items stay defined so existing inventories keep working):
 * - 2026-07-20 → 2026-07-27: Saltwort / Saltbite
 */
export const CHAPTER_CROP_WEEK = {
  startDate: new Date("2026-10-19T00:00:00.000Z"),
  endDate: new Date("2026-10-26T00:00:00.000Z"),
};

/**
 * The seed, crop and recipe that only exist during Chapter Crop Week.
 */
export const CHAPTER_CROP_WEEK_SEED: SeedName = "Crystal Leaf Seed";
export const CHAPTER_CROP_WEEK_CROP: CropName = "Crystal Leaf";
export const CHAPTER_CROP_WEEK_RECIPE: CookableName = "Crystal Cookie";

/**
 * Items from previous Chapter Crop Week runs. They stay defined (players still
 * hold them) but are never shown in the seed shop, Fire Pit or marketplace
 * again, and can't be bought or cooked. Move the current run's items here when
 * the next run is set up.
 */
export const RETIRED_CHAPTER_CROP_WEEK_SEEDS: readonly SeedName[] = [
  "Saltwort Seed",
];
export const RETIRED_CHAPTER_CROP_WEEK_CROPS: readonly CropName[] = [
  "Saltwort",
];
export const RETIRED_CHAPTER_CROP_WEEK_RECIPES: readonly CookableName[] = [
  "Saltbite",
];

const RETIRED_CHAPTER_CROP_WEEK_ITEMS: ReadonlySet<string> = new Set<string>([
  ...RETIRED_CHAPTER_CROP_WEEK_SEEDS,
  ...RETIRED_CHAPTER_CROP_WEEK_CROPS,
  ...RETIRED_CHAPTER_CROP_WEEK_RECIPES,
]);

/** Whether `name` is a seed, crop or recipe from a previous Chapter Crop Week. */
export const isRetiredChapterCropWeekItem = (name: string): boolean =>
  RETIRED_CHAPTER_CROP_WEEK_ITEMS.has(name);

/**
 * Whether the Chapter Crop Week event is currently running.
 * @param now Unix timestamp (ms) to check against. Defaults to Date.now().
 */
export const isChapterCropWeekActive = (now: number = Date.now()): boolean =>
  now >= CHAPTER_CROP_WEEK.startDate.getTime() &&
  now < CHAPTER_CROP_WEEK.endDate.getTime();

/**
 * Whether this player can use the Chapter Crop Week items right now: everyone
 * once the event window opens, plus admin testers (CHAPTER_CROP_WEEK_EARLY_ACCESS)
 * ahead of the start date so the run can be tested on mainnet. Nobody keeps
 * access after the end date. Use this (not `isChapterCropWeekActive`) for every
 * buy / plant / cook / trade gate; the time-only check is for countdowns.
 * @param game The player's game state (for the admin flag).
 * @param now Unix timestamp (ms) to check against. Defaults to Date.now().
 */
export const hasChapterCropWeekAccess = (
  game: GameState,
  now: number = Date.now(),
): boolean => {
  if (now >= CHAPTER_CROP_WEEK.endDate.getTime()) return false;

  return (
    isChapterCropWeekActive(now) ||
    hasFeatureAccess(game, "CHAPTER_CROP_WEEK_EARLY_ACCESS")
  );
};
