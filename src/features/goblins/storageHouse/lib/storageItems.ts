import Decimal from "decimal.js-light";
import { CROPS } from "features/game/types/crops";
import { FRUIT } from "features/game/types/fruits";
import {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
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
        (itemName in COMMODITIES &&
          itemName !== "Chicken" &&
          itemName !== "Crimstone" &&
          itemName !== "Sunstone");

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
export function getBankItems(game: GameState) {
  const { inventory, previousInventory } = game;
  return (Object.keys(inventory) as InventoryItemName[]).reduce(
    (acc, itemName) => {
      if (
        itemName in CROPS() ||
        itemName in FRUIT() ||
        (itemName in COMMODITIES && itemName !== "Chicken")
      ) {
        return acc;
      }

      const previousAmount = previousInventory[itemName] ?? new Decimal(0);
      const currentAmount = inventory[itemName] ?? new Decimal(0);

      // Use the lesser
      const amount = previousAmount.lessThan(currentAmount)
        ? previousAmount
        : currentAmount;

      return {
        ...acc,
        [itemName]: amount,
      };
    },
    {} as Inventory
  );
}
