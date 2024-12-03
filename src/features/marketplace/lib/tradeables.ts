import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { BuffLabel, KNOWN_IDS, KNOWN_ITEMS } from "features/game/types";
import { BumpkinItem, ITEM_IDS, ITEM_NAMES } from "features/game/types/bumpkin";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CollectionName,
  MarketplaceTradeableName,
} from "features/game/types/marketplace";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import { OPEN_SEA_WEARABLES } from "metadata/metadata";

export type TradeableDisplay = {
  name: string;
  description: string;
  image: string;
  type: CollectionName;
  buff?: BuffLabel;
};
export function getTradeableDisplay({
  id,
  type,
}: {
  id: number;
  type: CollectionName;
}): TradeableDisplay {
  if (type === "wearables") {
    const name = ITEM_NAMES[id];
    const details = OPEN_SEA_WEARABLES[name];

    return {
      name,
      description: details.description, // TODO support translation
      image: new URL(`/src/assets/wearables/${id}.webp`, import.meta.url).href,
      buff: BUMPKIN_ITEM_BUFF_LABELS[name],
      type,
    };
  }

  if (type === "buds") {
    const name = `Bud #${id}`;

    return {
      name,
      description: "?",
      image: `https://${budImageDomain}.sunflower-land.com/images/${id}.webp`,
      type,
      //   buff: TODO
    };
  }

  // Collectibles + Resources
  const name = KNOWN_ITEMS[id];
  const details = ITEM_DETAILS[name];

  return {
    name,
    description: details.description,
    image: details.image,
    buff: COLLECTIBLE_BUFF_LABELS[name],
    type,
  };
}

export function getCollectionName(
  itemName: MarketplaceTradeableName,
): CollectionName {
  if (itemName in TRADE_LIMITS) return "resources";

  if ((itemName as InventoryItemName) in KNOWN_IDS) {
    return "collectibles";
  }

  if ((itemName as BumpkinItem) in ITEM_IDS) {
    return "wearables";
  }

  if (itemName.startsWith("Bud")) {
    return "buds";
  }

  throw new Error("Unknown collection");
}
