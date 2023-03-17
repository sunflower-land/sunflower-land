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

  const availableItems = getKeys(state.inventory).reduce((acc, itemName) => {
    if (itemName === "Tree") {
      return {
        ...acc,
        Tree: new Decimal(
          state.inventory.Tree?.minus(Object.keys(state.trees).length) ?? 0
        ),
      };
    }

    if (itemName === "Stone Rock") {
      return {
        ...acc,
        "Stone Rock": new Decimal(
          state.inventory["Stone Rock"]?.minus(
            Object.keys(state.stones).length
          ) ?? 0
        ),
      };
    }

    if (itemName === "Iron Rock") {
      return {
        ...acc,
        "Iron Rock": new Decimal(
          state.inventory["Iron Rock"]?.minus(Object.keys(state.iron).length) ??
            0
        ),
      };
    }

    if (itemName === "Gold Rock") {
      return {
        ...acc,
        "Gold Rock": new Decimal(
          state.inventory["Gold Rock"]?.minus(Object.keys(state.gold).length) ??
            0
        ),
      };
    }

    if (itemName === "Crop Plot") {
      return {
        ...acc,
        "Crop Plot": new Decimal(
          state.inventory["Crop Plot"]?.minus(
            Object.keys(state.plots).length
          ) ?? 0
        ),
      };
    }

    if (itemName === "Fruit Patch") {
      return {
        ...acc,
        "Fruit Patch": new Decimal(
          state.inventory["Fruit Patch"]?.minus(
            Object.keys(state.fruitPatches).length
          ) ?? 0
        ),
      };
    }

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

  const validItems = getKeys(availableItems)
    .filter((itemName) => availableItems[itemName]?.greaterThan(0))
    .reduce(
      (acc, name) => ({ ...acc, [name]: availableItems[name] }),
      {} as Inventory
    );

  return validItems;
};
