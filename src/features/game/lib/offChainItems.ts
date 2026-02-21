import { CLUTTER } from "../types/clutter";
import { getKeys, TOOLS } from "../types/craftables";
import { InventoryItemName } from "../types/game";
import {
  CHAPTER_RAFFLE_TICKET_NAME,
  CHAPTER_TICKET_NAME,
  ChapterRaffleTicket,
} from "../types/chapters";
import { SEEDS } from "../types/seeds";
import { TREASURE_TOOLS } from "../types/tools";
import { PET_SHRINES } from "../types/pets";
import { HOURGLASSES } from "../events/landExpansion/burnCollectible";
import { RESOURCES } from "../types/resources";
import { FRUIT_COMPOST, CROP_COMPOST, WORM } from "../types/composters";
import { REWARD_BOXES } from "../types/rewardBoxes";
import { PROCESSED_RESOURCES } from "../types/processedFood";
import { SELLABLE_TREASURES } from "../types/treasure";
import { FISH } from "../types/fishing";
import { CRUSTACEANS } from "../types/crustaceans";
import { CONSUMABLES } from "../types/consumables";

export const OFFCHAIN_ITEMS_SET = new Set<InventoryItemName>([
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
  ...getKeys(PROCESSED_RESOURCES),
  ...getKeys(WORM),
  "Gold Friends Trophy",
  "Silver Friends Trophy",
  "Bronze Friends Trophy",
  "Basic Land",
  ...getKeys(REWARD_BOXES),
  // Fishing + water traps (no hoarding limits)
  ...getKeys(FISH),
  ...CRUSTACEANS,
  "Holiday Token 2025",
  "Holiday Ticket 2025",
  ...Object.values(CHAPTER_RAFFLE_TICKET_NAME).filter(
    (ticket): ticket is ChapterRaffleTicket => ticket !== undefined,
  ),
  ...getKeys(CONSUMABLES),
  ...getKeys({ ...CROP_COMPOST, ...FRUIT_COMPOST }),
  "Town Sign",
]);

export const OFFCHAIN_ITEMS: InventoryItemName[] =
  Array.from(OFFCHAIN_ITEMS_SET);
