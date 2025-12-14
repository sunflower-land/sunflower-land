/**
 * Buildings Hooks
 *
 * Custom hooks for buildings and collectibles state.
 */

import { useSelector } from "@xstate/react";
import {
  selectBuildings,
  selectBuilding,
  selectCollectibles,
  selectHomeCollectibles,
} from "../selectors/buildings";
import { BuildingName } from "../types/buildings";
import { createGameSelectorHook, useGameService } from "./useGameService";

/**
 * Hook to get all buildings
 */
export const useBuildings = createGameSelectorHook(selectBuildings);

/**
 * Hook to get a specific building type by name
 * Note: Cannot use createGameSelectorHook because it takes a parameter
 */
export const useBuilding = (name: BuildingName) => {
  const gameService = useGameService();
  return useSelector(gameService, selectBuilding(name));
};

/**
 * Hook to get all collectibles
 */
export const useCollectibles = createGameSelectorHook(selectCollectibles);

/**
 * Hook to get home collectibles
 */
export const useHomeCollectibles = createGameSelectorHook(
  selectHomeCollectibles,
);
