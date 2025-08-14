import { KNOWN_IDS } from "features/game/types";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { InventoryItemName } from "features/game/types/game";
import {
  MarketplaceTradeableName,
  CollectionName,
} from "features/game/types/marketplace";

export function getCollectionName(
  itemName: MarketplaceTradeableName,
): Exclude<CollectionName, "resources"> {
  if (itemName in KNOWN_IDS) {
    return "collectibles";
  }

  if (itemName in ITEM_IDS) {
    return "wearables";
  }

  if (itemName.startsWith("Bud")) {
    return "buds";
  }

  throw new Error("Unknown collection");
}
