import { CROPS } from "features/game/types/crops";
import { FRUIT } from "features/game/types/fruits";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { COMMODITIES } from "features/game/types/resources";
import { WITHDRAWABLES } from "features/game/types/withdrawables";

/**
 * Items for the storage house
 */
export function getDeliverableItems(inventory: Inventory) {
  return (Object.keys(inventory) as InventoryItemName[]).reduce(
    (acc, itemName) => {
      const isDeliverable =
        itemName in CROPS() ||
        itemName in FRUIT() ||
        (itemName in COMMODITIES && itemName !== "Chicken");

      if (isDeliverable && WITHDRAWABLES[itemName]()) {
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
        itemName in FRUIT() ||
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
