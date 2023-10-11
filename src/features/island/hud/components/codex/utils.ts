import { getKeys } from "features/game/types/craftables";
import { AssetType, MutantType, Mutants } from "./types";
import { Inventory, InventoryItemName } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";

export type ItemCounts = {
  available: number;
  owned: number;
};

const CONTRACTS: Record<AssetType, string> = {
  collectible: CONFIG.INVENTORY_CONTRACT,
  wearable: CONFIG.BUMPKIN_ITEMS_CONTRACT,
  bud: CONFIG.BUD_CONTRACT,
};

export const getOpenSeaLink = (id: number, type: AssetType) => {
  const network = CONFIG.NETWORK === "mainnet" ? "matic" : "mumbai";
  const base =
    network === "mumbai" ? `https://testnets.opensea.io` : `https://opensea.io`;

  return `${base}/assets/${network}/${CONTRACTS[type]}/${id}`;
};

export const getTotalMutantCounts = (
  mutants: Mutants,
  inventory: Inventory
): ItemCounts => {
  let available = 0;
  let owned = 0;

  for (const mutantType in mutants) {
    const items = mutants[mutantType as MutantType];

    available += getKeys(items).length;
    owned += getKeys(items).reduce((total, name) => {
      const count = inventory[name as InventoryItemName] ?? new Decimal(0);
      return total + Number(count);
    }, 0);
  }

  return { available, owned };
};
