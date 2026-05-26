import type { FactionRank } from "../lib/factionRanks";
import type { BumpkinItem } from "./bumpkin";
import type { InventoryItemName } from "./game";

export type BoostType = InventoryItemName | BumpkinItem | `${FactionRank} rank`;

export type BoostValue = `+${number}%`;
