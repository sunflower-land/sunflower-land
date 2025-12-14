/**
 * Buildings Selectors
 *
 * Stable selector functions for buildings state.
 */

import { MachineState } from "../lib/gameMachine";
import { BuildingName } from "../types/buildings";

/**
 * Select all buildings
 */
export const selectBuildings = (state: MachineState) =>
  state.context.state.buildings;

/**
 * Select a specific building type by name
 */
export const selectBuilding = (name: BuildingName) => (state: MachineState) =>
  state.context.state.buildings[name];

/**
 * Select all collectibles
 */
export const selectCollectibles = (state: MachineState) =>
  state.context.state.collectibles;

/**
 * Select home collectibles
 */
export const selectHomeCollectibles = (state: MachineState) =>
  state.context.state.home.collectibles;
