import { KNOWN_IDS } from "features/game/types";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import { InventoryItemName, TradeListing } from "features/game/types/game";
import { getCollectionName } from "./getCollectionName";

export function getListingItem({ listing }: { listing: TradeListing }): number {
  const name = getKeys(listing.items ?? {})[0]; // Currently only one item supported

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
  const name = getKeys(listing.items ?? {})[0]; // Currently only one item supported

  return getCollectionName(name);
}
