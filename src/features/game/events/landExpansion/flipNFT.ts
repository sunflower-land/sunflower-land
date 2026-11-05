import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import type { PlaceableLocation } from "features/game/types/collectibles";
import type { NFTName } from "./placeNFT";

export enum FLIP_NFT_ERRORS {
  NO_NFT = "You don't have this NFT",
  NFT_NOT_PLACED = "This NFT is not placed!",
}

export interface FlipNFTAction {
  type: "nft.flipped";
  id: string;
  nft: NFTName;
  location: PlaceableLocation;
}

type Options = {
  state: Readonly<GameState>;
  action: FlipNFTAction;
};

export function flipNFT({ state, action }: Options) {
  return produce(state, (game) => {
    const nft =
      action.nft === "Bud"
        ? game.buds?.[Number(action.id)]
        : game.pets?.nfts?.[Number(action.id)];

    if (!nft) {
      throw new Error(FLIP_NFT_ERRORS.NO_NFT);
    }

    if (!nft.coordinates || (nft.location ?? "farm") !== action.location) {
      throw new Error(FLIP_NFT_ERRORS.NFT_NOT_PLACED);
    }

    nft.flipped = !nft.flipped;

    return game;
  });
}
