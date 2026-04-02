import { KNOWN_IDS } from "features/game/types";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getKeys } from "lib/object";
import { InventoryItemName, TradeListing } from "features/game/types/game";
import { CollectionName } from "features/game/types/marketplace";
import { getCollectionName } from "./getCollectionName";

function listingCollectionAsName(
  collection: TradeListing["collection"],
): CollectionName {
  return collection;
}

function isPlayerEconomyTradeListing(listing: TradeListing): boolean {
  const c = listing.collection as string;
  return c === "economies" || c === "minigames";
}

export function getListingItem({ listing }: { listing: TradeListing }): number {
  const name = getKeys(listing.items ?? {})[0]; // Currently only one item supported

  if (isPlayerEconomyTradeListing(listing)) {
    return Number(name);
  }

  const collection = getCollectionName(name);

  if (collection === "buds") {
    // TODO: FIX THIS SPLIT NOW THAT WE DON"T USE #
    const [_, id] = name.split("#");

    return Number(id);
  }

  if (collection === "pets") {
    const [_, id] = name.split("#");
    return Number(id);
  }

  if (collection === "wearables") {
    return ITEM_IDS[name as BumpkinItem];
  }

  return KNOWN_IDS[name as InventoryItemName];
}

export function getListingCollection({ listing }: { listing: TradeListing }) {
  if (isPlayerEconomyTradeListing(listing)) {
    return listingCollectionAsName(listing.collection);
  }

  const name = getKeys(listing.items ?? {})[0]; // Currently only one item supported

  return getCollectionName(name);
}
