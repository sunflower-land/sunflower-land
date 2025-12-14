/**
 * Inventory Selectors
 *
 * Stable selector functions for inventory state.
 * Define selectors outside components to maintain referential equality.
 */

import { MachineState } from "../lib/gameMachine";
import { InventoryItemName } from "../types/game";

/**
 * Select the entire inventory object
 * Use when you need multiple inventory items
 */
export const selectInventory = (state: MachineState) =>
  state.context.state.inventory;

/**
 * Select a specific inventory item by name
 * Returns undefined if item doesn't exist
 */
export const selectInventoryItem =
  (item: InventoryItemName) => (state: MachineState) =>
    state.context.state.inventory[item];

/**
 * Select the wardrobe (wearable items)
 */
export const selectWardrobe = (state: MachineState) =>
  state.context.state.wardrobe;

/**
 * Select previous inventory (for comparison)
 */
export const selectPreviousInventory = (state: MachineState) =>
  state.context.state.previousInventory;
