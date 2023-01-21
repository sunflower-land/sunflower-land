import { CROPS } from "features/game/types/crops";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { COMMODITIES } from "features/game/types/resources";

/**
 * Items for the storage house
 */
export function getDeliverableItems(inventory: Inventory) {
  return (Object.keys(inventory) as InventoryItemName[]).reduce(
    (acc, itemName) => {
      if (
        itemName in CROPS() ||
        (itemName in COMMODITIES && itemName !== "Chicken")
      ) {
        return {
          ...acc,
          [itemName]: inventory[itemName],
        };
      }

      return acc;
    },
    {} as Inventory
  );
}

/**
 * Items for the bank
 */
export function getBankItems(inventory: Inventory) {
  return (Object.keys(inventory) as InventoryItemName[]).reduce(
    (acc, itemName) => {
      if (
        itemName in CROPS() ||
        (itemName in COMMODITIES && itemName !== "Chicken")
      ) {
        return acc;
      }

      return {
        ...acc,
        [itemName]: inventory[itemName],
      };
    },
    {} as Inventory
  );
}
