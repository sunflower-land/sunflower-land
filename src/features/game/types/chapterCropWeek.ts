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
 * This file is the single source of truth for the event windows and the items
 * that are gated to them. It is imported by the seed shop UI, Fire Pit UI,
 * marketplace UI, and the backend purchase/cook gates. Must stay in sync with
 * the API's `domain/game/types/chapterCropWeek.ts`.
 */
export type ChapterCropWeekRun = {
  startDate: Date;
  endDate: Date;
  seed: SeedName;
  crop: CropName;
  recipe: CookableName;
};

/**
 * Every Chapter Crop Week run, oldest first. To set up the next run, append it
 * here: the last entry is the current run, and each run's items retire on their
 * own once its end date passes (never shown in the seed shop, Fire Pit or
 * marketplace again, and can't be bought, planted, sold, cooked or traded).
 * Items stay defined so existing inventories keep working.
 *
 * Only append a run once the previous one has ended: the buy / plant / cook /
 * trade gates only know the current run, so an earlier run that is still live
 * would lose its event-window gate.
 */
export const CHAPTER_CROP_WEEKS: readonly ChapterCropWeekRun[] = [
  {
    startDate: new Date("2026-07-20T00:00:00.000Z"),
    endDate: new Date("2026-07-27T00:00:00.000Z"),
    seed: "Saltwort Seed",
    crop: "Saltwort",
    recipe: "Saltbite",
  },
  {
    startDate: new Date("2026-10-19T00:00:00.000Z"),
    endDate: new Date("2026-10-26T00:00:00.000Z"),
    seed: "Crystal Leaf Seed",
    crop: "Crystal Leaf",
    recipe: "Crystal Cookie",
  },
];

/** The current (latest) Chapter Crop Week run. */
export const CHAPTER_CROP_WEEK =
  CHAPTER_CROP_WEEKS[CHAPTER_CROP_WEEKS.length - 1];

/**
 * The seed, crop and recipe of the current Chapter Crop Week run.
 */
export const CHAPTER_CROP_WEEK_SEED: SeedName = CHAPTER_CROP_WEEK.seed;
export const CHAPTER_CROP_WEEK_CROP: CropName = CHAPTER_CROP_WEEK.crop;
export const CHAPTER_CROP_WEEK_RECIPE: CookableName = CHAPTER_CROP_WEEK.recipe;

/**
 * Whether `name` is a seed, crop or recipe from a Chapter Crop Week run that
 * has ended: every earlier run, plus the current one once its end date passes.
 * @param name The item to check.
 * @param now Unix timestamp (ms) to check against. Defaults to Date.now().
 */
export const isRetiredChapterCropWeekItem = (
  name: string,
  now: number = Date.now(),
): boolean =>
  CHAPTER_CROP_WEEKS.some(
    (run) =>
      now >= run.endDate.getTime() &&
      (run.seed === name || run.crop === name || run.recipe === name),
  );

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
