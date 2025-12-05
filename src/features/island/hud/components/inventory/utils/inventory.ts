import Decimal from "decimal.js-light";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { ResourceItem } from "features/game/expansion/placeable/lib/collisionDetection";
import {
  BuildingName,
  BUILDINGS_DIMENSIONS,
} from "features/game/types/buildings";
import { BumpkinItem } from "features/game/types/bumpkin";
import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "features/game/types/craftables";
import { getKeys } from "features/game/types/craftables";
import {
  GameState,
  Inventory,
  InventoryItemName,
  Rock,
  Tree,
} from "features/game/types/game";
import {
  CollectionName,
  MarketplaceTradeableName,
} from "features/game/types/marketplace";
import { PetNFTs } from "features/game/types/pets";
import {
  RESOURCE_STATE_ACCESSORS,
  RESOURCE_DIMENSIONS,
  ResourceName,
  RESOURCE_MULTIPLIER,
  UpgradeableResource,
  BASIC_RESOURCES,
  BasicResourceName,
  RESOURCES_UPGRADES_TO,
  ADVANCED_RESOURCES,
} from "features/game/types/resources";
import { getCollectionName } from "features/marketplace/lib/getCollectionName";
import { setPrecision } from "lib/utils/formatNumber";

const PLACEABLE_DIMENSIONS = {
  ...BUILDINGS_DIMENSIONS,
  ...COLLECTIBLES_DIMENSIONS,
  ...RESOURCE_DIMENSIONS,
};

type ListedItems = Record<
  CollectionName,
  Partial<Record<MarketplaceTradeableName, number>>
>;

export const getActiveListedItems = (state: GameState): ListedItems => {
  if (!state.trades.listings) {
    return {
      wearables: {},
      collectibles: {},
      buds: {},
      pets: {},
    };
  }

  return Object.values(state.trades.listings).reduce<ListedItems>(
    (acc, listing) => {
      if (listing.boughtAt && listing.buyerId) return acc;

      getObjectEntries(listing.items).forEach(([itemName, quantity]) => {
        const amount = quantity ?? 0;
        const collection = listing.collection ?? getCollectionName(itemName);

        acc[collection][itemName] = (acc[collection][itemName] ?? 0) + amount;
      });

      return acc;
    },
    {
      wearables: {},
      collectibles: {},
      buds: {},
      pets: {},
    },
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

export const getChestPets = (pets: PetNFTs): PetNFTs => {
  return Object.fromEntries(
    Object.entries(pets ?? {}).filter(([id, pet]) => !pet.coordinates),
  );
};

export const getChestItems = (state: GameState): Inventory => {
  const availableItems = getKeys(state.inventory).reduce((acc, itemName) => {
    if (itemName in RESOURCE_STATE_ACCESSORS) {
      const stateAccessor =
        RESOURCE_STATE_ACCESSORS[itemName as Exclude<ResourceName, "Boulder">];
      const placedNodes = Object.values(stateAccessor(state) ?? {}).filter(
        (resource) => {
          if (
            itemName in RESOURCES_UPGRADES_TO ||
            itemName in ADVANCED_RESOURCES
          ) {
            const placed = resource.x !== undefined && resource.y !== undefined;
            const hasName = "name" in resource;
            const nameMatch = hasName && resource.name === itemName;
            const isBaseResource =
              !hasName &&
              BASIC_RESOURCES.includes(itemName as BasicResourceName);

            return (nameMatch || isBaseResource) && placed;
          }

          return true;
        },
      );

      return {
        ...acc,
        [itemName]: new Decimal(
          state.inventory[itemName]?.minus(placedNodes.length) ?? 0,
        ),
      };
    }

    if (itemName in COLLECTIBLES_DIMENSIONS) {
      return {
        ...acc,
        [itemName]: new Decimal(
          state.inventory[itemName]
            ?.minus(
              state.collectibles[itemName as CollectibleName]?.filter(
                (collectible) => collectible.coordinates,
              ).length ?? 0,
            )
            ?.minus(
              state.home.collectibles[itemName as CollectibleName]?.filter(
                (collectible) => collectible.coordinates,
              ).length ?? 0,
            ) ?? 0,
        ),
      };
    }

    if (itemName in BUILDINGS_DIMENSIONS) {
      return {
        ...acc,
        [itemName]: new Decimal(
          state.inventory[itemName]?.minus(
            state.buildings[itemName as BuildingName]?.filter(
              (building) => building.coordinates,
            ).length ?? 0,
          ) ?? 0,
        ),
      };
    }

    return acc;
  }, {} as Inventory);

  const validItems = getKeys(availableItems).reduce((acc, name) => {
    if (availableItems[name]?.greaterThanOrEqualTo(0)) {
      return { ...acc, [name]: availableItems[name] };
    }
    return { ...acc, [name]: new Decimal(0) };
  }, {} as Inventory);

  return validItems;
};

export function getCountAndType(
  state: GameState,
  name: InventoryItemName | BumpkinItem,
) {
  let count = new Decimal(0);
  let itemType: "wearable" | "inventory" = "inventory";
  if (isCollectible(name)) {
    count =
      getChestItems(state)[name as InventoryItemName] ??
      state.inventory[name as InventoryItemName] ??
      new Decimal(0);
  } else {
    count = new Decimal(
      availableWardrobe(state)[name as BumpkinItem] ??
        state.wardrobe[name as BumpkinItem] ??
        0,
    );
    itemType = "wearable";
  }

  return { count: setPrecision(count, 2), itemType };
}

export const isPlaceableCollectible = (
  item: InventoryItemName,
): item is CollectibleName => item in COLLECTIBLES_DIMENSIONS;

export const isPlaceableBuilding = (
  item: InventoryItemName,
): item is BuildingName => item in BUILDINGS_DIMENSIONS;

export const isPlaceableResource = (
  item: InventoryItemName,
): item is Exclude<ResourceName, "Boulder"> => item in RESOURCE_STATE_ACCESSORS;

export const isTreeOrRock = (node: ResourceItem): node is Tree | Rock =>
  "wood" in node || "stone" in node;

export const isUpgradableResource = (
  itemName: ResourceName,
): itemName is UpgradeableResource => itemName in RESOURCE_MULTIPLIER;
