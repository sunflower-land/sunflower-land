import { BuffLabel, KNOWN_ITEMS } from "features/game/types";
import { ITEM_NAMES } from "features/game/types/bumpkin";
import { GameState } from "features/game/types/game";
import { getItemBuffs } from "features/game/types/getItemBuffs";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  BudNFTName,
  CollectionName,
  MarketplaceTradeableName,
} from "features/game/types/marketplace";
import { budImageDomain } from "features/island/collectibles/components/Bud";
import { OPEN_SEA_WEARABLES } from "metadata/metadata";
import { translate } from "lib/i18n/translate";
import { PetNFTName } from "features/game/types/pets";
import { getPetImageForMarketplace } from "features/island/pets/lib/petShared";

export type TradeableDisplay = {
  name: MarketplaceTradeableName;
  description: string;
  image: string;
  type: CollectionName;
  buffs: BuffLabel[];
  experience?: number;
  translatedName?: string;
};

export function getTradeableDisplay({
  id,
  type,
  state,
  experience,
}: {
  id: number;
  type: CollectionName;
  state: GameState;
  experience?: number;
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
    const name = `Bud #${id}` as BudNFTName;

    return {
      name,
      description: translate("description.bud.generic"),
      image: `https://${budImageDomain}.sunflower-land.com/small-nfts/${id}.webp`,
      type,
      buffs: getItemBuffs({ state, item: name, collection: "buds" }),
    };
  }

  if (type === "pets") {
    const name = `Pet #${id}` as PetNFTName;

    return {
      name,
      description: translate("description.pet.generic"),
      image: getPetImageForMarketplace(id),
      type,
      buffs: getItemBuffs({ state, item: name, collection: "pets" }),
      experience,
    };
  }

  // Collectibles + Resources
  const name = KNOWN_ITEMS[id];
  const details = ITEM_DETAILS[name];

  return {
    name,
    translatedName: details.translatedName,
    description: details.description,
    image: details.image,
    buffs: getItemBuffs({ state, item: name, collection: "collectibles" }),
    type,
  };
}
