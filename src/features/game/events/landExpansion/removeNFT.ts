import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { NFTName } from "./placeNFT";
import { PlaceableLocation } from "features/game/types/collectibles";

export enum REMOVE_NFT_ERRORS {
  INVALID_NFT = "This NFT does not exist",
  NFT_NOT_PLACED = "This NFT is not placed",
}

export type RemoveNFTAction = {
  type: "nft.removed";
  id: string;
  nft: NFTName;
  location: PlaceableLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveNFTAction;
  createdAt?: number;
};

export function removeNFT({
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
      throw new Error(REMOVE_NFT_ERRORS.INVALID_NFT);
    }

    if (!nft.coordinates) {
      throw new Error(REMOVE_NFT_ERRORS.NFT_NOT_PLACED);
    }

    delete nft.coordinates;
    delete nft.location;

    return stateCopy;
  });
}
