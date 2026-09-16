import { FERTILISERS, type InventoryItemName } from "../types/game";
import { SHOVELS, TOOLS } from "../types/craftables";
import { CROPS, CROP_SEEDS, GREENHOUSE_CROPS } from "../types/crops";

import { ANIMAL_RESOURCES, COMMODITIES } from "../types/resources";
import {
  GREENHOUSE_FRUIT,
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
} from "../types/fruits";

import { TREASURE_TOOLS } from "../types/tools";
import { FLOWER_SEEDS } from "../types/flowers";
import { ANIMAL_FOODS } from "../types/animals";
import { RECIPE_CRAFTABLES } from "./crafting";
import { BEETLES } from "../types/beetles";
import { BEETLE_FEEDS } from "../types/beetleFeeds";

/**
 * Tradeable items use 18 decimals for decimal point storage
 * Collectibles use 1 decimal
 */
export function getItemUnit(name: InventoryItemName) {
  if (
    name in CROPS ||
    name in PATCH_FRUIT ||
    name in GREENHOUSE_CROPS ||
    name in GREENHOUSE_FRUIT ||
    name in COMMODITIES ||
    name in ANIMAL_RESOURCES ||
    name in CROP_SEEDS ||
    name in PATCH_FRUIT_SEEDS ||
    name in FLOWER_SEEDS ||
    name in TOOLS ||
    name in TREASURE_TOOLS ||
    name in SHOVELS ||
    name in FERTILISERS ||
    name in ANIMAL_FOODS ||
    name in RECIPE_CRAFTABLES ||
    (BEETLES as readonly InventoryItemName[]).includes(name) ||
    (BEETLE_FEEDS as readonly InventoryItemName[]).includes(name)
  ) {
    return "ether";
  }

  // Limited items, Food, Skills, Flags
  return "wei";
}
