import { BuffLabel, KNOWN_IDS, KNOWN_ITEMS } from "features/game/types";
import { BumpkinItem, ITEM_IDS, ITEM_NAMES } from "features/game/types/bumpkin";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { getKeys } from "features/game/types/decorations";
import { InventoryItemName, TradeOffer } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { CollectionName } from "features/game/types/marketplace";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import { translateTerms } from "lib/i18n/translate";
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
      image: details.image,
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
    description: translateTerms(details.description),
    image: details.image,
    buff: COLLECTIBLE_BUFF_LABELS[name],
    type,
  };
}

export function getOfferItem({ offer }: { offer: TradeOffer }): number {
  const { collection, items } = offer;
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
