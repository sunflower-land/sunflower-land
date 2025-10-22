import { KNOWN_IDS } from "features/game/types";
import { ITEM_IDS } from "features/game/types/bumpkin";
import {
  MarketplaceTradeableName,
  CollectionName,
} from "features/game/types/marketplace";

export function getCollectionName(
  itemName: MarketplaceTradeableName,
): CollectionName {
  if (itemName in KNOWN_IDS) {
    return "collectibles";
  }

  if (itemName in ITEM_IDS) {
    return "wearables";
  }

  if (itemName.startsWith("Bud")) {
    return "buds";
  }

  if (itemName.startsWith("Pet #")) {
    return "pets";
  }

  throw new Error("Unknown collection");
}
