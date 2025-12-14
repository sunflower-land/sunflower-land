/**
 * Common Selectors
 *
 * Stable selector functions for frequently accessed game state.
 */

import { MachineState } from "../lib/gameMachine";

/**
 * Select the entire game state
 * Use sparingly - prefer more specific selectors
 */
export const selectGameState = (state: MachineState) => state.context.state;

/**
 * Select coins (in-game currency)
 */
export const selectCoins = (state: MachineState) => state.context.state.coins;

/**
 * Select SFL balance (blockchain currency)
 */
export const selectBalance = (state: MachineState) =>
  state.context.state.balance;

/**
 * Select current island type
 */
export const selectIsland = (state: MachineState) => state.context.state.island;

/**
 * Select current season
 */
export const selectSeason = (state: MachineState) => state.context.state.season;

/**
 * Select farm ID from context
 */
export const selectFarmId = (state: MachineState) => state.context.farmId;

/**
 * Select username
 */
export const selectUsername = (state: MachineState) =>
  state.context.state.username;

/**
 * Select faction
 */
export const selectFaction = (state: MachineState) =>
  state.context.state.faction;

/**
 * Select trades/listings
 */
export const selectTrades = (state: MachineState) => state.context.state.trades;

/**
 * Select delivery state
 */
export const selectDelivery = (state: MachineState) =>
  state.context.state.delivery;

/**
 * Select chores
 */
export const selectChores = (state: MachineState) => state.context.state.chores;

/**
 * Check if game is in playing state
 */
export const selectIsPlaying = (state: MachineState) =>
  state.matches("playing");

/**
 * Check if game is in visiting state
 */
export const selectIsVisiting = (state: MachineState) =>
  state.matches("visiting");

/**
 * Check if game is loading
 */
export const selectIsLoading = (state: MachineState) =>
  state.matches("loading") || state.matches("initialising");
