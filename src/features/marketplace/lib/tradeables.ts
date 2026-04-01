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
import { OPEN_SEA_WEARABLES } from "metadata/metadata";
import { translate } from "lib/i18n/translate";
import { PetNFTName } from "features/game/types/pets";
import { getPetImageForMarketplace } from "features/island/pets/lib/petShared";
import { getWearableImage } from "features/game/lib/getWearableImage";
import { getBudImage } from "lib/buds/types";
import type {
  Tradeable,
  TradeableDetails,
} from "features/game/types/marketplace";
import { resolveMarketplaceMinigameItemImage } from "./resolveMinigameMarketplaceImage";
import { fallbackDisplayNameForMinigameCurrencyKey } from "./minigameMarketplaceCopy";

export type TradeableDisplay = {
  name: MarketplaceTradeableName;
  description: string;
  image: string;
  type: CollectionName;
  buffs: BuffLabel[];
  experience?: number;
  translatedName?: string;
  /** Minigame balance token key (e.g. GoldenNugget) for image fallback on load error. */
  minigameCurrencyKey?: string;
};

export function getTradeableDisplay({
  id,
  type,
  state,
  experience,
  tradeableDetails,
  marketplaceItem,
}: {
  id: number;
  type: CollectionName;
  state: GameState;
  experience?: number;
  /** When loaded, refines minigame labels/currency from API */
  tradeableDetails?: TradeableDetails | null;
  /** Marketplace row when browsing collection (before detail fetch) */
  marketplaceItem?: Tradeable | null;
}): TradeableDisplay {
  if (type === "minigames") {
    const mg =
      tradeableDetails?.collection === "minigames" ? tradeableDetails : null;
    const row =
      marketplaceItem?.collection === "minigames" ? marketplaceItem : null;
    const currency = mg?.currencyName ?? row?.currencyName ?? String(id);
    const label = mg?.minigameLabel ?? row?.minigameLabel ?? "";
    const apiImage = mg?.image ?? row?.image;
    const explicitDisplay =
      mg?.currencyDisplayName?.trim() ?? row?.currencyDisplayName?.trim();
    const readableCurrency =
      explicitDisplay || fallbackDisplayNameForMinigameCurrencyKey(currency);
    const itemDescription =
      mg?.currencyDescription?.trim() ?? row?.currencyDescription?.trim() ?? "";
    /** Trades store items under stringified token id (see API getTradeItem). */
    const name = String(id) as MarketplaceTradeableName;

    return {
      name,
      description: itemDescription,
      image: resolveMarketplaceMinigameItemImage(apiImage, currency),
      minigameCurrencyKey: currency,
      buffs: [],
      type,
      translatedName: label
        ? `${label} · ${readableCurrency}`
        : readableCurrency,
    };
  }

  if (type === "wearables") {
    const name = ITEM_NAMES[id];
    const details = OPEN_SEA_WEARABLES[name];

    return {
      name,
      description: details.description, // TODO support translation
      image: getWearableImage(name),
      buffs: getItemBuffs({ state, item: name, collection: "wearables" }),
      type,
    };
  }

  if (type === "buds") {
    const name = `Bud #${id}` as BudNFTName;

    return {
      name,
      description: translate("description.bud.generic"),
      image: getBudImage(Number(id), "small"),
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
