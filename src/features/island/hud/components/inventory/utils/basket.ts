import { Inventory } from "components/InventoryItems";
import {
  PlaceableName,
  PLACEABLES_DIMENSIONS,
} from "features/game/types/buildings";
import { getKeys } from "features/game/types/craftables";

export type Basket = {};

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

export const getChestItems = (inventory: Inventory) => {
  return getKeys(inventory).reduce((acc, itemName) => {
    if (itemName in PLACEABLES_DIMENSIONS) {
      return {
        ...acc,
        [itemName]: inventory[itemName],
      };
    }

    return acc;
  }, {} as Inventory);
};
