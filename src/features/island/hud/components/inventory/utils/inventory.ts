import { Inventory } from "components/InventoryItems";
import { PLACEABLES_DIMENSIONS } from "features/game/types/buildings";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";

export const getBasketItems = (inventory: Inventory) => {
  return getKeys(inventory).reduce((acc, itemName) => {
    if (itemName in PLACEABLES_DIMENSIONS) {
      return acc;
    }

    return {
      ...acc,
      [itemName]: inventory[itemName],
    };
  }, {} as Inventory);
};

export const getChestItems = (state: GameState) => {
  return getKeys(state.inventory).reduce((acc, itemName) => {
    if (itemName in PLACEABLES_DIMENSIONS && !(itemName in state.buildings)) {
      return {
        ...acc,
        [itemName]: state.inventory[itemName],
      };
    }

    return acc;
  }, {} as Inventory);
};
