import Decimal from "decimal.js-light";
import { CROPS } from "features/game/types/crops";
import { PATCH_FRUIT } from "features/game/types/fruits";
import {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { COMMODITIES } from "features/game/types/resources";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";

export function getBankItems(game: GameState) {
  const { previousInventory } = game;

  const inventory = getChestItems(game);

  return (Object.keys(inventory) as InventoryItemName[]).reduce(
    (acc, itemName) => {
      if (
        itemName in CROPS ||
        itemName in PATCH_FRUIT ||
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
