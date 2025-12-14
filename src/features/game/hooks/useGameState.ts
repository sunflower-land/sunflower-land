/**
 * Game State Hooks
 *
 * Custom hooks for common game state values.
 */

import {
  selectGameState,
  selectCoins,
  selectBalance,
  selectIsland,
  selectSeason,
  selectFarmId,
  selectUsername,
  selectFaction,
  selectTrades,
  selectDelivery,
  selectChores,
  selectIsPlaying,
  selectIsVisiting,
  selectIsLoading,
} from "../selectors/common";
import { createGameSelectorHook, decimalEquals } from "./useGameService";

/**
 * Hook to get the entire game state
 * Use sparingly - prefer more specific hooks
 */
export const useGameState = createGameSelectorHook(selectGameState);

/**
 * Hook to get coins (in-game currency)
 */
export const useCoins = createGameSelectorHook(selectCoins);

/**
 * Hook to get SFL balance (blockchain currency)
 * Uses Decimal comparator to prevent unnecessary re-renders
 */
export const useBalance = createGameSelectorHook(selectBalance, decimalEquals);

/**
 * Hook to get current island type
 */
export const useIsland = createGameSelectorHook(selectIsland);

/**
 * Hook to get current season
 */
export const useSeason = createGameSelectorHook(selectSeason);

/**
 * Hook to get farm ID
 */
export const useFarmId = createGameSelectorHook(selectFarmId);

/**
 * Hook to get username
 */
export const useUsername = createGameSelectorHook(selectUsername);

/**
 * Hook to get faction
 */
export const useFaction = createGameSelectorHook(selectFaction);

/**
 * Hook to get trades/listings
 */
export const useTrades = createGameSelectorHook(selectTrades);

/**
 * Hook to get delivery state
 */
export const useDelivery = createGameSelectorHook(selectDelivery);

/**
 * Hook to get chores
 */
export const useChores = createGameSelectorHook(selectChores);

/**
 * Hook to check if game is in playing state
 */
export const useIsPlaying = createGameSelectorHook(selectIsPlaying);

/**
 * Hook to check if game is in visiting state
 */
export const useIsVisiting = createGameSelectorHook(selectIsVisiting);

/**
 * Hook to check if game is loading
 */
export const useIsLoading = createGameSelectorHook(selectIsLoading);
