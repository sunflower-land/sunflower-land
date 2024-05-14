import { FERTILISERS, InventoryItemName } from "../types/game";
import { SHOVELS, TOOLS } from "../types/craftables";
import { CROPS, CROP_SEEDS, GREENHOUSE_CROPS } from "../types/crops";
import { COMMODITIES } from "../types/resources";
import { FRUIT, FRUIT_SEEDS, GREENHOUSE_FRUIT } from "../types/fruits";
import { TREASURE_TOOLS } from "../types/tools";
import { FLOWER_SEEDS } from "../types/flowers";

/**
 * Tradeable items use 18 decimals for decimal point storage
 * Collectibles use 1 decimal
 */
export function getItemUnit(name: InventoryItemName) {
  if (
    name in CROPS() ||
    name in FRUIT() ||
    name in GREENHOUSE_CROPS() ||
    name in GREENHOUSE_FRUIT() ||
    name in COMMODITIES ||
    name in CROP_SEEDS() ||
    name in FRUIT_SEEDS() ||
    name in FLOWER_SEEDS() ||
    name in TOOLS ||
    name in TREASURE_TOOLS ||
    name in SHOVELS ||
    name in FERTILISERS
  ) {
    return "ether";
  }

  // Limited items, Food, Skills, Flags
  return "wei";
}
