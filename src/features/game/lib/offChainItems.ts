import { CLUTTER } from "../types/clutter";
import { getKeys, TOOLS } from "../types/craftables";
import { InventoryItemName } from "../types/game";
import { SEASON_TICKET_NAME } from "../types/seasons";
import { SEEDS } from "../types/seeds";
import { TREASURE_TOOLS } from "../types/tools";
import { SELLABLE_TREASURE } from "../types/treasure";

export const OFFCHAIN_ITEMS: InventoryItemName[] = [
  "Mark",
  "Trade Point",
  "Love Charm",
  ...getKeys(CLUTTER),
  ...getKeys(SELLABLE_TREASURE),
  ...getKeys(SEEDS),
  ...getKeys(TOOLS),
  ...getKeys(TREASURE_TOOLS),
  ...Object.values(SEASON_TICKET_NAME),
  "Cheer",
];
