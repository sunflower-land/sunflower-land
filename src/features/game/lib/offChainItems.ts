import { CLUTTER } from "../types/clutter";
import { getKeys, TOOLS } from "../types/craftables";
import { InventoryItemName } from "../types/game";
import { CHAPTER_TICKET_NAME } from "../types/chapters";
import { SEEDS } from "../types/seeds";
import { TREASURE_TOOLS } from "../types/tools";
import { PET_SHRINES } from "../types/pets";
import { HOURGLASSES } from "../events/landExpansion/burnCollectible";
import { RESOURCES } from "../types/resources";
import { WORM } from "../types/composters";
import { REWARD_BOXES } from "../types/rewardBoxes";
import { PROCESSED_FOODS } from "../types/processedFood";
import { SELLABLE_TREASURES } from "../types/treasure";

export const OFFCHAIN_ITEMS: InventoryItemName[] = [
  "Mark",
  "Trade Point",
  "Love Charm",
  ...getKeys(CLUTTER),
  ...getKeys(SELLABLE_TREASURES),
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
  ...getKeys(PROCESSED_FOODS),
  ...getKeys(WORM),
  "Gold Friends Trophy",
  "Silver Friends Trophy",
  "Bronze Friends Trophy",
  "Basic Land",
  ...getKeys(REWARD_BOXES),
  "Holiday Token 2025",
  "Holiday Ticket 2025",
];
