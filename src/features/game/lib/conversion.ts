import { InventoryItemName } from "../types/game";
import { TOOLS } from "../types/craftables";
import { CROPS, SEEDS } from "../types/crops";
import { RESOURCES } from "../types/resources";

/**
 * Tradeable items use 18 decimals for decimal point storage
 * Collectibles use 1 decimal
 */
export function getItemUnit(name: InventoryItemName) {
  if (
    name in CROPS() ||
    name in RESOURCES ||
    name in SEEDS() ||
    name in TOOLS
  ) {
    return "ether";
  }

  // Limited items, Food, Skills, Flags
  return "wei";
}
