/**
 * Bumpkin Selectors
 *
 * Stable selector functions for bumpkin (player character) state.
 */

import { MachineState } from "../lib/gameMachine";

/**
 * Select the main bumpkin
 */
export const selectBumpkin = (state: MachineState) =>
  state.context.state.bumpkin;

/**
 * Select bumpkin's equipped items
 */
export const selectBumpkinEquipped = (state: MachineState) =>
  state.context.state.bumpkin?.equipped;

/**
 * Select bumpkin's skills
 */
export const selectBumpkinSkills = (state: MachineState) =>
  state.context.state.bumpkin?.skills;

/**
 * Select bumpkin's experience
 */
export const selectBumpkinExperience = (state: MachineState) =>
  state.context.state.bumpkin?.experience;

/**
 * Select bumpkin's activity log
 */
export const selectBumpkinActivity = (state: MachineState) =>
  state.context.state.bumpkin?.activity;

/**
 * Select farmhands
 */
export const selectFarmHands = (state: MachineState) =>
  state.context.state.farmHands;
