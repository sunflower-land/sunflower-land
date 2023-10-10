import { getKeys } from "features/game/types/craftables";
import { MutantType, Mutants } from "./types";
import { Inventory, InventoryItemName } from "features/game/types/game";
import Decimal from "decimal.js-light";

export type ItemCounts = {
  available: number;
  owned: number;
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
