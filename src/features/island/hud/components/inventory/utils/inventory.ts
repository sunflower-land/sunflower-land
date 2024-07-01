import Decimal from "decimal.js-light";
import {
  BuildingName,
  BUILDINGS_DIMENSIONS,
} from "features/game/types/buildings";
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
      setPrecision(new Decimal(inventory[itemName] || 0)).greaterThan(0),
    )
    .reduce((acc, itemName) => {
      if (itemName in PLACEABLE_DIMENSIONS) return acc;
      if (itemName === "Basic Land") return acc;

      return {
        ...acc,
        [itemName]: inventory[itemName],
      };
    }, {} as Inventory);
};

export const getChestBuds = (
  state: GameState,
): NonNullable<GameState["buds"]> => {
  return Object.fromEntries(
    Object.entries(state.buds ?? {}).filter(([, bud]) => !bud.coordinates),
  );
};

export const getChestItems = (state: GameState) => {
  const availableItems = getKeys(state.inventory).reduce((acc, itemName) => {
    if (itemName === "Tree") {
      return {
        ...acc,
        Tree: new Decimal(
          state.inventory.Tree?.minus(Object.keys(state.trees).length) ?? 0,
        ),
      };
    }

    if (itemName === "Stone Rock") {
      return {
        ...acc,
        "Stone Rock": new Decimal(
          state.inventory["Stone Rock"]?.minus(
            Object.keys(state.stones).length,
          ) ?? 0,
        ),
      };
    }

    if (itemName === "Iron Rock") {
      return {
        ...acc,
        "Iron Rock": new Decimal(
          state.inventory["Iron Rock"]?.minus(Object.keys(state.iron).length) ??
            0,
        ),
      };
    }

    if (itemName === "Gold Rock") {
      return {
        ...acc,
        "Gold Rock": new Decimal(
          state.inventory["Gold Rock"]?.minus(Object.keys(state.gold).length) ??
            0,
        ),
      };
    }

    if (itemName === "Crimstone Rock") {
      return {
        ...acc,
        "Crimstone Rock": new Decimal(
          state.inventory["Crimstone Rock"]?.minus(
            Object.keys(state.crimstones).length,
          ) ?? 0,
        ),
      };
    }

    if (itemName === "Sunstone Rock") {
      return {
        ...acc,
        "Sunstone Rock": new Decimal(
          state.inventory["Sunstone Rock"]?.minus(
            Object.keys(state.sunstones).length,
          ) ?? 0,
        ),
      };
    }

    if (itemName === "Crop Plot") {
      return {
        ...acc,
        "Crop Plot": new Decimal(
          state.inventory["Crop Plot"]?.minus(
            Object.keys(state.crops).length,
          ) ?? 0,
        ),
      };
    }

    if (itemName === "Fruit Patch") {
      return {
        ...acc,
        "Fruit Patch": new Decimal(
          state.inventory["Fruit Patch"]?.minus(
            Object.keys(state.fruitPatches).length,
          ) ?? 0,
        ),
      };
    }

    if (itemName === "Beehive") {
      return {
        ...acc,
        Beehive: new Decimal(
          state.inventory.Beehive?.minus(Object.keys(state.beehives).length) ??
            0,
        ),
      };
    }

    if (itemName === "Flower Bed") {
      return {
        ...acc,
        "Flower Bed": new Decimal(
          state.inventory["Flower Bed"]?.minus(
            Object.keys(state.flowers.flowerBeds).length,
          ) ?? 0,
        ),
      };
    }

    if (itemName === "Oil Reserve") {
      return {
        ...acc,
        "Oil Reserve": new Decimal(
          state.inventory["Oil Reserve"]?.minus(
            Object.keys(state.oilReserves).length,
          ) ?? 0,
        ),
      };
    }

    if (itemName in COLLECTIBLES_DIMENSIONS) {
      return {
        ...acc,
        [itemName]: new Decimal(
          state.inventory[itemName]
            ?.minus(
              state.collectibles[itemName as CollectibleName]?.length ?? 0,
            )
            ?.minus(
              state.home.collectibles[itemName as CollectibleName]?.length ?? 0,
            ) ?? 0,
        ),
      };
    }

    if (itemName in BUILDINGS_DIMENSIONS) {
      return {
        ...acc,
        [itemName]: new Decimal(
          state.inventory[itemName]?.minus(
            state.buildings[itemName as BuildingName]?.length ?? 0,
          ) ?? 0,
        ),
      };
    }

    return acc;
  }, {} as Inventory);

  const validItems = getKeys(availableItems)
    .filter((itemName) => availableItems[itemName]?.greaterThan(0))
    .reduce(
      (acc, name) => ({ ...acc, [name]: availableItems[name] }),
      {} as Inventory,
    );

  return validItems;
};
