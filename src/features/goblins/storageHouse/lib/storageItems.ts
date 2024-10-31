import Decimal from "decimal.js-light";
import { PLOT_CROPS } from "features/game/types/crops";
import { PATCH_FRUIT } from "features/game/types/fruits";
import {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { COMMODITIES } from "features/game/types/resources";
import { WITHDRAWABLES } from "features/game/types/withdrawables";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";

export function getDeliverableItems({ state }: { state: GameState }) {
  const { previousInventory } = state;

  const inventory = getBasketItems(state.inventory);

  return (Object.keys(inventory) as InventoryItemName[]).reduce(
    (acc, itemName) => {
      const isDeliverable =
        itemName in PLOT_CROPS ||
        itemName in PATCH_FRUIT() ||
        (itemName in COMMODITIES &&
          itemName !== "Chicken" &&
          itemName !== "Crimstone" &&
          itemName !== "Sunstone");

      if (isDeliverable && WITHDRAWABLES[itemName]()) {
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
      }

      return acc;
    },
    {} as Inventory,
  );
}

export function getBankItems(game: GameState) {
  const { previousInventory } = game;

  const inventory = getChestItems(game);

  return (Object.keys(inventory) as InventoryItemName[]).reduce(
    (acc, itemName) => {
      if (
        itemName in PLOT_CROPS ||
        itemName in PATCH_FRUIT() ||
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
    {} as Inventory,
  );
}
