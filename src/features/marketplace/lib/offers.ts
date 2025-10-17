import { KNOWN_IDS } from "features/game/types";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import { InventoryItemName } from "features/game/types/game";
import {
  CollectionName,
  MarketplaceTradeableName,
} from "features/game/types/marketplace";

interface MarketplaceItemDetails {
  collection: CollectionName;
  items: Partial<Record<MarketplaceTradeableName, number>>;
}

export function tradeToId({
  details,
}: {
  details: MarketplaceItemDetails;
}): number {
  const { collection, items } = details;
  const name = getKeys(items ?? {})[0]; // Currently only one item supported

  return getItemId({ name, collection });
}

export function getItemId({
  name,
  collection,
}: {
  name: string;
  collection: CollectionName;
}): number {
  if (collection === "buds") {
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
