import { CLUTTER } from "../types/clutter";
import { getKeys, TOOLS } from "../types/craftables";
import { InventoryItemName } from "../types/game";
import { CHAPTER_TICKET_NAME } from "../types/chapters";
import { SEEDS } from "../types/seeds";
import { TREASURE_TOOLS } from "../types/tools";
import { SELLABLE_TREASURE } from "../types/treasure";
import { PET_SHRINES } from "../types/pets";
import { HOURGLASSES } from "../events/landExpansion/burnCollectible";
import { RESOURCES } from "../types/resources";
import { WORM } from "../types/composters";

export const OFFCHAIN_ITEMS: InventoryItemName[] = [
  "Mark",
  "Trade Point",
  "Love Charm",
  ...getKeys(CLUTTER),
  ...getKeys(SELLABLE_TREASURE),
  ...getKeys(SEEDS),
  ...getKeys(TOOLS),
  ...getKeys(TREASURE_TOOLS),
  ...Object.values(CHAPTER_TICKET_NAME),
  "Cheer",
  ...getKeys(PET_SHRINES),
  "Obsidian Shrine",
  ...HOURGLASSES,
  "Time Warp Totem",
  "Super Totem",
  ...getKeys(RESOURCES),
  ...getKeys(WORM),
  "Basic Land",
];
