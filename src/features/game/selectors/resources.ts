/**
 * Resources Selectors
 *
 * Stable selector functions for farm resources (trees, stones, crops, etc.).
 */

import { MachineState } from "../lib/gameMachine";

/**
 * Select all trees
 */
export const selectTrees = (state: MachineState) => state.context.state.trees;

/**
 * Select all stones
 */
export const selectStones = (state: MachineState) => state.context.state.stones;

/**
 * Select all iron deposits
 */
export const selectIron = (state: MachineState) => state.context.state.iron;

/**
 * Select all gold deposits
 */
export const selectGold = (state: MachineState) => state.context.state.gold;

/**
 * Select all crops/plots
 */
export const selectCrops = (state: MachineState) => state.context.state.crops;

/**
 * Select all fruit patches
 */
export const selectFruitPatches = (state: MachineState) =>
  state.context.state.fruitPatches;

/**
 * Select all flower beds
 */
export const selectFlowerBeds = (state: MachineState) =>
  state.context.state.flowers.flowerBeds;

/**
 * Select all beehives
 */
export const selectBeehives = (state: MachineState) =>
  state.context.state.beehives;

/**
 * Select oil reserves
 */
export const selectOilReserves = (state: MachineState) =>
  state.context.state.oilReserves;

/**
 * Select crimstones
 */
export const selectCrimstones = (state: MachineState) =>
  state.context.state.crimstones;

/**
 * Select sunstones
 */
export const selectSunstones = (state: MachineState) =>
  state.context.state.sunstones;
