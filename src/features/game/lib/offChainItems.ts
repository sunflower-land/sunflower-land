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
import { CRUSTACEANS } from "../types/crustaceans";
import { CONSUMABLES } from "../types/consumables";
import { TRADE_LIMITS } from "../actions/tradeLimits";
import { ANIMAL_FOODS } from "../types/animals";
import { EXOTIC_CROPS } from "../types/beans";
import { DOLLS } from "./crafting";

const BASE_OFFCHAIN_ITEMS = new Set<InventoryItemName>([
  "Mark",
  "Trade Point",
  "Love Charm",
  "Potion Ticket",
  ...getKeys({
    ...CLUTTER,
    ...SELLABLE_TREASURES,
    ...SEEDS,
    ...TOOLS,
    ...TREASURE_TOOLS,
    ...PET_SHRINES,
    ...RESOURCES,
    ...PROCESSED_RESOURCES,
    ...WORM,
    ...REWARD_BOXES,
    ...CONSUMABLES,
    ...CROP_COMPOST,
    ...FRUIT_COMPOST,
    ...TRADE_LIMITS,
    ...ANIMAL_FOODS,
    ...EXOTIC_CROPS,
    ...DOLLS,
  }),
  ...Object.values(CHAPTER_TICKET_NAME),
  ...Object.values(CHAPTER_RAFFLE_TICKET_NAME).filter(
    (ticket): ticket is ChapterRaffleTicket => ticket !== undefined,
  ),
  ...HOURGLASSES,
  ...CRUSTACEANS,
  "Cheer",
  "Obsidian Shrine",
  "Time Warp Totem",
  "Super Totem",
  "Gold Friends Trophy",
  "Silver Friends Trophy",
  "Bronze Friends Trophy",
  "Basic Land",
  "Holiday Token 2025",
  "Holiday Ticket 2025",
  "Town Sign",
  "Acorn",
]);

export const OFFCHAIN_ITEMS = Array.from(BASE_OFFCHAIN_ITEMS);
