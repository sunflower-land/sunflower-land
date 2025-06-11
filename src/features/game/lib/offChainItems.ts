import { getKeys, TOOLS } from "../types/craftables";
import { SEEDS } from "../types/seeds";
import { TREASURE_TOOLS } from "../types/tools";

import { SELLABLE_TREASURE } from "../types/treasure";

export const OFFCHAIN_ITEMS = [
  "Mark",
  "Trade Point",
  "Love Charm",
  ...getKeys(SELLABLE_TREASURE),
  ...getKeys(SEEDS),
  ...getKeys(TOOLS),
  ...getKeys(TREASURE_TOOLS),
];
