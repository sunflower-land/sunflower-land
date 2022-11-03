import { Inventory } from "components/InventoryItems";
import Decimal from "decimal.js-light";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "features/game/types/craftables";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";

const PLACEABLE_DIMENSIONS = {
  ...BUILDINGS_DIMENSIONS,
  ...COLLECTIBLES_DIMENSIONS,
};

export const getBasketItems = (inventory: Inventory) => {
  return getKeys(inventory).reduce((acc, itemName) => {
    if (itemName in PLACEABLE_DIMENSIONS) {
      return acc;
    }

    return {
      ...acc,
      [itemName]: inventory[itemName],
    };
  }, {} as Inventory);
};

export const getChestItems = (state: GameState) => {
  const { collectibles } = state;
  return getKeys(state.inventory).reduce((acc, itemName) => {
    const isCollectible = itemName in collectibles;
    const collectiblesPlaced = new Decimal(
      collectibles[itemName as CollectibleName]?.length ?? 0
    );
    const collectibleInventory = state.inventory[itemName] ?? new Decimal(0);
    if (
      itemName in COLLECTIBLES_DIMENSIONS &&
      !(isCollectible && collectiblesPlaced.eq(collectibleInventory))
    ) {
      return {
        ...acc,
        [itemName]: state.inventory[itemName],
      };
    }

    return acc;
  }, {} as Inventory);
};
