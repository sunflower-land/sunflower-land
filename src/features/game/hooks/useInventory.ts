/**
 * Inventory Hooks
 *
 * Custom hooks for inventory state with optimized re-render behavior.
 */

import { useSelector } from "@xstate/react";
import {
  selectInventory,
  selectInventoryItem,
  selectWardrobe,
} from "../selectors/inventory";
import { InventoryItemName } from "../types/game";
import Decimal from "decimal.js-light";
import {
  createGameSelectorHook,
  decimalEquals,
  useGameService,
} from "./useGameService";

/**
 * Hook to get the entire inventory
 * Re-renders only when inventory object reference changes
 */
export const useInventory = createGameSelectorHook(selectInventory);

/**
 * Hook to get a specific inventory item count
 * Re-renders only when that specific item's Decimal value changes
 *
 * @param item - The inventory item name to select
 * @returns The Decimal count of the item, or undefined if not present
 */
export const useInventoryItem = (item: InventoryItemName) => {
  const gameService = useGameService();
  return useSelector(gameService, selectInventoryItem(item), decimalEquals);
};

/**
 * Hook to get a specific inventory item count with default
 * Returns Decimal(0) if item doesn't exist
 *
 * @param item - The inventory item name to select
 * @returns The Decimal count of the item, defaults to 0
 */
export const useInventoryItemWithDefault = (item: InventoryItemName) => {
  const gameService = useGameService();
  return useSelector(
    gameService,
    (state) => state.context.state.inventory[item] ?? new Decimal(0),
    decimalEquals,
  );
};

/**
 * Hook to get the wardrobe (wearable items)
 */
export const useWardrobe = createGameSelectorHook(selectWardrobe);
