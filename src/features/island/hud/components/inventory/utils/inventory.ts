import Decimal from "decimal.js-light";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "features/game/types/craftables";
import { getKeys } from "features/game/types/craftables";
import { GameState, Inventory } from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { setPrecision } from "lib/utils/formatNumber";

const PLACEABLE_DIMENSIONS = {
  ...BUILDINGS_DIMENSIONS,
  ...COLLECTIBLES_DIMENSIONS,
  ...RESOURCE_DIMENSIONS,
};

export const getBasketItems = (inventory: Inventory) => {
  return getKeys(inventory)
    .filter((itemName) =>
      setPrecision(new Decimal(inventory[itemName] || 0)).greaterThan(0)
    )
    .reduce((acc, itemName) => {
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

  return getKeys(state.inventory)
    .filter((itemName) =>
      setPrecision(new Decimal(state.inventory[itemName] || 0)).greaterThan(0)
    )
    .reduce((acc, itemName) => {
      const isCollectible = itemName in collectibles;
      const collectiblesPlaced = new Decimal(
        collectibles[itemName as CollectibleName]?.length ?? 0
      );
      const collectibleInventory = state.inventory[itemName] ?? new Decimal(0);
      const allItemsPlaced =
        isCollectible &&
        setPrecision(
          collectibleInventory.minus(collectiblesPlaced)
        ).lessThanOrEqualTo(0);
      if (itemName in COLLECTIBLES_DIMENSIONS && !allItemsPlaced) {
        return {
          ...acc,
          [itemName]: state.inventory[itemName],
        };
      }

      return acc;
    }, {} as Inventory);
};
