import { CROPS } from "features/game/types/crops";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { RESOURCES } from "features/game/types/resources";

export function getDeliverableItems(inventory: Inventory) {
  return (Object.keys(inventory) as InventoryItemName[]).reduce(
    (acc, itemName) => {
      if (
        itemName in CROPS() ||
        (itemName in RESOURCES && itemName !== "Chicken")
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
