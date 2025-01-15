import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { BuffLabel, KNOWN_IDS, KNOWN_ITEMS } from "features/game/types";
import { BumpkinItem, ITEM_IDS, ITEM_NAMES } from "features/game/types/bumpkin";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getItemBuffs } from "features/game/types/getItemBuffs";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CollectionName,
  MarketplaceTradeableName,
} from "features/game/types/marketplace";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import { OPEN_SEA_WEARABLES } from "metadata/metadata";
import { BudName } from "features/game/types/buds";
import { translate } from "lib/i18n/translate";

export type TradeableDisplay = {
  name: string;
  description: string;
  image: string;
  type: CollectionName;
  buffs: BuffLabel[];
};

export function getTradeableDisplay({
  id,
  type,
  state,
}: {
  id: number;
  type: CollectionName;
  state: GameState;
}): TradeableDisplay {
  if (type === "wearables") {
    const name = ITEM_NAMES[id];
    const details = OPEN_SEA_WEARABLES[name];

    return {
      name,
      description: details.description, // TODO support translation
      image: new URL(`/src/assets/wearables/${id}.webp`, import.meta.url).href,
      buffs: getItemBuffs({ state, item: name, collection: "wearables" }),
      type,
    };
  }

  if (type === "buds") {
    const name = `Bud #${id}` as BudName;

    return {
      name,
      description: translate("description.bud.generic"),
      image: `https://${budImageDomain}.sunflower-land.com/small-nfts/${id}.webp`,
      type,
      buffs: getItemBuffs({ state, item: name, collection: "buds" }),
    };
  }

  // Collectibles + Resources
  const name = KNOWN_ITEMS[id];
  const details = ITEM_DETAILS[name];

  return {
    name,
    description: details.description,
    image: details.image,
    buffs: getItemBuffs({ state, item: name, collection: "collectibles" }),
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
