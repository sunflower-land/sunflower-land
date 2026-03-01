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
  FarmHands,
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
import { PetName, PetNFTs } from "features/game/types/pets";
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
    Object.entries(state.buds ?? {}).filter(([, bud]) => !bud.coordinates),
  );
};

export const getChestPets = (pets: PetNFTs): PetNFTs => {
  return Object.fromEntries(
    Object.entries(pets ?? {}).filter(([, pet]) => !pet.coordinates),
  );
};

export const getChestFarmHands = (farmHands: FarmHands) => {
  return Object.fromEntries(
    Object.entries(farmHands.bumpkins ?? {}).filter(
      ([, farmHand]) => !farmHand.coordinates,
    ),
  );
};

/**
 * Items that require "chest" counting (i.e. available/unplaced amount).
 *
 * This MUST stay aligned with `getChestItems` logic: only items that can be
 * placed on the map should subtract placed instances from inventory.
 */
export const requiresChestCount = (name: InventoryItemName) =>
  name in RESOURCE_STATE_ACCESSORS ||
  name in COLLECTIBLES_DIMENSIONS ||
  name in BUILDINGS_DIMENSIONS;

/**
 * Returns the available/unplaced amount for a single inventory item.
 *
 * This is the single source of truth used by BOTH `getChestItems` and
 * `getCountAndType`, preventing drift if chest counting logic changes.
 */
export const getChestItemCount = (
  state: GameState,
  name: InventoryItemName,
): Decimal => {
  const inventoryCount = state.inventory[name] ?? new Decimal(0);

  if (name in RESOURCE_STATE_ACCESSORS) {
    const stateAccessor =
      RESOURCE_STATE_ACCESSORS[name as Exclude<ResourceName, "Boulder">];
    const placedNodes = Object.values(stateAccessor(state) ?? {}).filter(
      (resource) => {
        const placed = resource.x !== undefined && resource.y !== undefined;
        if (name in RESOURCES_UPGRADES_TO || name in ADVANCED_RESOURCES) {
          const hasName = "name" in resource;
          const nameMatch = hasName && resource.name === name;
          const isBaseResource =
            !hasName && BASIC_RESOURCES.includes(name as BasicResourceName);

          return (nameMatch || isBaseResource) && placed;
        }

        return placed;
      },
    );

    const available = new Decimal(inventoryCount.minus(placedNodes.length));
    return available.greaterThanOrEqualTo(0) ? available : new Decimal(0);
  }

  if (name in COLLECTIBLES_DIMENSIONS) {
    const placed =
      (state.collectibles[name as CollectibleName]?.filter(
        (collectible) => collectible.coordinates,
      ).length ?? 0) +
      (state.home.collectibles[name as CollectibleName]?.filter(
        (collectible) => collectible.coordinates,
      ).length ?? 0) +
      (state.petHouse?.pets[name as PetName]?.filter((pet) => pet.coordinates)
        .length ?? 0);

    const available = new Decimal(inventoryCount.minus(placed));
    return available.greaterThanOrEqualTo(0) ? available : new Decimal(0);
  }

  if (name in BUILDINGS_DIMENSIONS) {
    const placed =
      state.buildings[name as BuildingName]?.filter(
        (building) => building.coordinates,
      ).length ?? 0;

    const available = new Decimal(inventoryCount.minus(placed));
    return available.greaterThanOrEqualTo(0) ? available : new Decimal(0);
  }

  // Non-placeables: chest counting doesn't apply, so it's just inventory.
  return inventoryCount;
};

export const getChestItems = (state: GameState): Inventory => {
  const availableItems = getKeys(state.inventory).reduce<Inventory>(
    (acc, itemName) => {
      if (!requiresChestCount(itemName)) return acc;

      acc[itemName] = getChestItemCount(state, itemName);

      return acc;
    },
    {},
  );
  // `getChestItemCount` already clamps to >= 0 for placeables,
  // so this is the final result.
  return availableItems;
};

/**
 * True when the player has at least one placeable chest item and has not
 * placed any collectibles yet (used to show "place your first item" helper).
 */
export const hasChestItemAndNoCollectiblesPlaced = (
  state: GameState,
): boolean => {
  const chestItems = getChestItems(state);
  const hasChestItem = getKeys(chestItems).some((name) =>
    (chestItems[name] ?? new Decimal(0)).gt(0),
  );
  if (!hasChestItem) return false;
  const hasPlacedCollectible = getObjectEntries(state.collectibles ?? {}).some(
    ([, items]) => (items ?? []).some((item) => item.coordinates !== undefined),
  );
  return !hasPlacedCollectible;
};

export function getCountAndType(
  state: GameState,
  name: InventoryItemName | BumpkinItem,
) {
  let count = new Decimal(0);
  let itemType: "wearable" | "inventory" = "inventory";
  if (isCollectible(name)) {
    count = getChestItemCount(state, name);
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
