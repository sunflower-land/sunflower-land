/**
 * Bumpkin Hooks
 *
 * Custom hooks for bumpkin (player character) state.
 */

import {
  selectBumpkin,
  selectBumpkinEquipped,
  selectBumpkinSkills,
  selectBumpkinExperience,
  selectBumpkinActivity,
  selectFarmHands,
} from "../selectors/bumpkin";
import { createGameSelectorHook } from "./useGameService";

/**
 * Hook to get the main bumpkin
 */
export const useBumpkin = createGameSelectorHook(selectBumpkin);

/**
 * Hook to get bumpkin's equipped items
 */
export const useBumpkinEquipped = createGameSelectorHook(selectBumpkinEquipped);

/**
 * Hook to get bumpkin's skills
 */
export const useBumpkinSkills = createGameSelectorHook(selectBumpkinSkills);

/**
 * Hook to get bumpkin's experience
 */
export const useBumpkinExperience = createGameSelectorHook(
  selectBumpkinExperience,
);

/**
 * Hook to get bumpkin's activity log
 */
export const useBumpkinActivity = createGameSelectorHook(selectBumpkinActivity);

/**
 * Hook to get farmhands
 */
export const useFarmHands = createGameSelectorHook(selectFarmHands);
