import type { SeedName } from "./seeds";
import type { CookableName } from "./consumables";
import type { CropName } from "./crops";

/**
 * Chapter Crop Week is a one-week limited-time event that runs inside a chapter.
 * During the window players can buy & grow the Saltwort crop, cook the Saltbite
 * recipe at the Fire Pit (which feeds the backend raffles), and temporarily
 * trade Saltwort on the marketplace (VIP-only selling).
 *
 * This file is the single source of truth for the event window and the items
 * that are gated to it. It is imported by the seed shop UI, Fire Pit UI,
 * marketplace UI, and the backend purchase/cook gates.
 */
export const CHAPTER_CROP_WEEK = {
  startDate: new Date("2026-07-20T00:00:00.000Z"),
  endDate: new Date("2026-07-27T00:00:00.000Z"),
};

/**
 * The seed, crop and recipe that only exist during Chapter Crop Week.
 */
export const CHAPTER_CROP_WEEK_SEED: SeedName = "Saltwort Seed";
export const CHAPTER_CROP_WEEK_CROP: CropName = "Saltwort";
export const CHAPTER_CROP_WEEK_RECIPE: CookableName = "Saltbite";

/**
 * Whether the Chapter Crop Week event is currently running.
 * @param now Unix timestamp (ms) to check against. Defaults to Date.now().
 */
export const isChapterCropWeekActive = (now: number = Date.now()): boolean =>
  now >= CHAPTER_CROP_WEEK.startDate.getTime() &&
  now < CHAPTER_CROP_WEEK.endDate.getTime();
