import Decimal from "decimal.js-light";
import { fromWei } from "web3-utils";

import { Inventory, InventoryItemName } from "features/game/types/game";
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
    {} as Inventory,
  );

  return reduced;
}
