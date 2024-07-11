import { FactionRank } from "../lib/factionRanks";
import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";

export type BoostType = InventoryItemName | BumpkinItem | `${FactionRank} rank`;

export type BoostValue = `+${number}%`;
