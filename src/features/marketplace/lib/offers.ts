import { KNOWN_IDS, KNOWN_ITEMS } from "features/game/types";
import { BumpkinItem, ITEM_IDS, ITEM_NAMES } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import { InventoryItemName } from "features/game/types/game";
import {
  CollectionName,
  MarketplaceTradeableName,
} from "features/game/types/marketplace";
import {
  BUMPKIN_WITHDRAWABLES,
  WITHDRAWABLES,
} from "features/game/types/withdrawables";

interface MarketplaceItemDetails {
  collection: CollectionName;
  items: Partial<Record<MarketplaceTradeableName, number>>;
}

export function getItemId({
  details,
}: {
  details: MarketplaceItemDetails;
}): number {
  const { collection, items } = details;
  const name = getKeys(items ?? {})[0]; // Currently only one item supported

  if (collection === "buds") {
    const [_, id] = name.split("#");
    return Number(id);
  }

  if (collection === "wearables") {
    return ITEM_IDS[name as BumpkinItem];
  }

  return KNOWN_IDS[name as InventoryItemName];
}

export type TradeType = "instant" | "onchain";

export function getTradeType({
  collection,
  id,
}: {
  collection: CollectionName;
  id: number;
}) {
  let tradeType: TradeType = "instant";

  if (collection === "buds") {
    tradeType = "onchain";
  }

  if (collection === "collectibles" && WITHDRAWABLES[KNOWN_ITEMS[id]]()) {
    tradeType = "onchain";
  }

  if (collection === "wearables" && BUMPKIN_WITHDRAWABLES[ITEM_NAMES[id]]()) {
    tradeType = "onchain";
  }

  return tradeType;
}
