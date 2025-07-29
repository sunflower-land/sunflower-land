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
import { MarketplaceTradeableName } from "features/game/types/marketplace";
import {
  RESOURCE_STATE_ACCESSORS,
  RESOURCE_DIMENSIONS,
  ResourceName,
} from "features/game/types/resources";
import { setPrecision } from "lib/utils/formatNumber";

const PLACEABLE_DIMENSIONS = {
  ...BUILDINGS_DIMENSIONS,
  ...COLLECTIBLES_DIMENSIONS,
  ...RESOURCE_DIMENSIONS,
};

export const getActiveListedItems = (
  state: GameState,
): Record<MarketplaceTradeableName, number> => {
  if (!state.trades.listings)
    return {} as Record<MarketplaceTradeableName, number>;

  return Object.values(state.trades.listings).reduce(
    (acc, listing) => {
      if (listing.boughtAt && listing.buyerId) return acc;

      Object.entries(listing.items).forEach(([itemName, quantity]) => {
        const name = itemName as MarketplaceTradeableName;

        if (acc[name]) {
          acc[name] += quantity as number;
        } else {
          acc[name] = quantity as number;
        }
      });

      return acc;
    },
    {} as Record<MarketplaceTradeableName, number>,
  );
};

export const getBasketItems = (inventory: Inventory) => {
  return getKeys(inventory)
    .filter((itemName) =>
      setPrecision(inventory[itemName] ?? 0, 2).greaterThan(0),
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
    Object.entries(state.buds ?? {}).filter(([id, bud]) => !bud.coordinates),
  );
};

export const getChestItems = (state: GameState): Inventory => {
  const availableItems = getKeys(state.inventory).reduce((acc, itemName) => {
    if (itemName in RESOURCE_STATE_ACCESSORS) {
      const stateAccessor =
        RESOURCE_STATE_ACCESSORS[itemName as Exclude<ResourceName, "Boulder">];
      return {
        ...acc,
        [itemName]: new Decimal(
          state.inventory[itemName]?.minus(
            Object.values(stateAccessor(state) ?? {}).filter(
              (resource) =>
                resource.x !== undefined && resource.y !== undefined,
            ).length,
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
