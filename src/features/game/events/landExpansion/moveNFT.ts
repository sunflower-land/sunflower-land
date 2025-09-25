import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { NFTName } from "./placeNFT";
import { PlaceableLocation } from "features/game/types/collectibles";

export enum MOVE_NFT_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_NFT = "You don't have this bud",
  NFT_NOT_PLACED = "This NFT is not placed!",
}

export type MoveNFTAction = {
  type: "nft.moved";
  coordinates: Coordinates;
  id: string;
  nft: NFTName;
  location: PlaceableLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveNFTAction;
  createdAt?: number;
};

export function moveBud({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const nft =
      action.nft === "Bud"
        ? stateCopy.buds?.[Number(action.id)]
        : stateCopy.pets?.nfts?.[Number(action.id)];

    if (!nft) {
      throw new Error(MOVE_NFT_ERRORS.NO_NFT);
    }

    if (!nft.coordinates) {
      throw new Error(MOVE_NFT_ERRORS.NFT_NOT_PLACED);
    }

    nft.coordinates = action.coordinates;

    return stateCopy;
  });
}
