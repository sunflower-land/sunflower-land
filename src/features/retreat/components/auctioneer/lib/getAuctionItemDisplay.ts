import { Auction, NFTAuction } from "features/game/lib/auctionMachine";
import { BuffLabel } from "features/game/types";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import {
  AuctionNFT,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getImageUrl } from "lib/utils/getImageURLS";
import { translate } from "lib/i18n/translate";

import petNFTEgg from "assets/icons/pet_nft_egg.png";
import lightning from "assets/icons/lightning.png";

const NFT_IMAGE_DESCRIPTION_MAPPING: Record<
  AuctionNFT,
  { image: string; description: string }
> = {
  Pet: {
    image: petNFTEgg,
    description: translate("description.unrevealedNFT.description"),
  },
};

type Display = {
  image: string;
  buffLabels?: BuffLabel[];
  item: InventoryItemName | BumpkinItem | AuctionNFT;
  typeLabel: string;
  description: string;
};

export function getAuctionItemDisplay({
  auction,
  skills,
  collectibles,
}: {
  auction: Auction | NFTAuction;
  skills: GameState["bumpkin"]["skills"];
  collectibles: GameState["collectibles"];
}): Display {
  if (auction.type === "collectible") {
    const image = ITEM_DETAILS[auction.collectible].image;
    const buffLabels = COLLECTIBLE_BUFF_LABELS[auction.collectible]?.({
      skills,
      collectibles,
    });

    return {
      image,
      buffLabels,
      item: auction.collectible,
      typeLabel: translate("collectible"),
      description: ITEM_DETAILS[auction.collectible].description,
    };
  }

  if (auction.type === "wearable") {
    const image = getImageUrl(ITEM_IDS[auction.wearable]);
    const buffLabels = BUMPKIN_ITEM_BUFF_LABELS[auction.wearable];

    return {
      image,
      buffLabels,
      item: auction.wearable,
      typeLabel: translate("wearable"),
      description: "",
    };
  }

  return {
    image: NFT_IMAGE_DESCRIPTION_MAPPING[auction.nft].image,
    buffLabels: [
      {
        shortDescription: translate("description.unrevealedNFT.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ] as BuffLabel[],
    item: auction.nft,
    typeLabel: "NFT",
    description: NFT_IMAGE_DESCRIPTION_MAPPING[auction.nft].description,
  };
}

interface CollectibleAuctionItemImageParams {
  type: "collectible";
  collectible: InventoryItemName;
}

interface WearableAuctionItemImageParams {
  type: "wearable";
  wearable: BumpkinItem;
}

interface NftAuctionItemImageParams {
  type: "nft";
  nft: AuctionNFT;
}

export function getAuctionItemImage(
  details:
    | CollectibleAuctionItemImageParams
    | WearableAuctionItemImageParams
    | NftAuctionItemImageParams,
) {
  if (details.type === "collectible") {
    return ITEM_DETAILS[details.collectible].image;
  }

  if (details.type === "wearable") {
    return getImageUrl(ITEM_IDS[details.wearable]);
  }

  return NFT_IMAGE_DESCRIPTION_MAPPING[details.nft].image;
}
