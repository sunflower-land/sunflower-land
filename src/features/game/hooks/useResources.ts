/**
 * Resources Hooks
 *
 * Custom hooks for farm resources (trees, stones, crops, etc.).
 */

import {
  selectTrees,
  selectStones,
  selectIron,
  selectGold,
  selectCrops,
  selectFruitPatches,
  selectFlowerBeds,
  selectBeehives,
  selectOilReserves,
  selectCrimstones,
  selectSunstones,
} from "../selectors/resources";
import { createGameSelectorHook } from "./useGameService";

/**
 * Hook to get all trees
 */
export const useTrees = createGameSelectorHook(selectTrees);

/**
 * Hook to get all stones
 */
export const useStones = createGameSelectorHook(selectStones);

/**
 * Hook to get all iron deposits
 */
export const useIron = createGameSelectorHook(selectIron);

/**
 * Hook to get all gold deposits
 */
export const useGold = createGameSelectorHook(selectGold);

/**
 * Hook to get all crops/plots
 */
export const useCrops = createGameSelectorHook(selectCrops);

/**
 * Hook to get all fruit patches
 */
export const useFruitPatches = createGameSelectorHook(selectFruitPatches);

/**
 * Hook to get all flower beds
 */
export const useFlowerBeds = createGameSelectorHook(selectFlowerBeds);

/**
 * Hook to get all beehives
 */
export const useBeehives = createGameSelectorHook(selectBeehives);

/**
 * Hook to get oil reserves
 */
export const useOilReserves = createGameSelectorHook(selectOilReserves);

/**
 * Hook to get crimstones
 */
export const useCrimstones = createGameSelectorHook(selectCrimstones);

/**
 * Hook to get sunstones
 */
export const useSunstones = createGameSelectorHook(selectSunstones);
