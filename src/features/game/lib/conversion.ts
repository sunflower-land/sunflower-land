import { FERTILISERS, InventoryItemName } from "../types/game";
import { SHOVELS, TOOLS } from "../types/craftables";
import { CROPS, CROP_SEEDS } from "../types/crops";
import { RESOURCES } from "../types/resources";
import { FRUIT, FRUIT_SEEDS } from "../types/fruits";

/**
 * Tradeable items use 18 decimals for decimal point storage
 * Collectibles use 1 decimal
 */
export function getItemUnit(name: InventoryItemName) {
  if (
    name in CROPS ||
    name in FRUIT() ||
    name in RESOURCES ||
    name in CROP_SEEDS ||
    name in FRUIT_SEEDS() ||
    name in TOOLS ||
    name in SHOVELS ||
    name in FERTILISERS
  ) {
    return "ether";
  }

  // Limited items, Food, Skills, Flags
  return "wei";
}
