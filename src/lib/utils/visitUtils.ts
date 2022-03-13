import Decimal from "decimal.js-light";
import { fromWei } from "web3-utils";

import {
  Inventory,
  InventoryItemName,
  FieldItem,
} from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";
import { getItemUnit } from "features/game/lib/conversion";

export function balancesToInventory(balances: Array<any>) {
  const names = Object.keys(KNOWN_IDS) as InventoryItemName[];

  const reduced = balances.reduce(
    (items: Inventory, balance: string, index: number) => {
      const unit = getItemUnit(names[index]);
      const value = new Decimal(fromWei(balance, unit));

      if (value.equals(0)) {
        return items;
      }

      return { ...items, [names[index]]: value };
    },
    {} as Inventory
  );

  return reduced;
}

/**
 * Check inventory items to unlock fields
 */
export function populateFields(inventory: Inventory) {
  const sunflower = { name: "Sunflower", plantedAt: 0 };
  const fields = {} as Record<number, FieldItem>;
  const indices = [];

  // zone two
  if (inventory["Pumpkin Soup"]) {
    indices.push(5, 6, 7, 8, 9);
  }

  // zone three
  if (inventory["Sauerkraut"]) {
    indices.push(10, 11, 12, 13, 14, 15);
  }

  // zone four
  if (inventory["Roasted Cauliflower"]) {
    indices.push(16, 17, 18, 19, 20, 21);
  }

  for (let i = 0; i < 22; i += 1) {
    // fill zone one
    if ((i >= 0 && i <= 4) || indices.includes(i)) {
      fields[i] = sunflower as FieldItem;
    }
  }

  return fields;
}
