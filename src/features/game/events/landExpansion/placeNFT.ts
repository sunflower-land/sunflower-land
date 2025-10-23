import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { PlaceableLocation } from "features/game/types/collectibles";
import { GameState } from "features/game/types/game";
import { isPetNFTRevealed } from "features/game/types/pets";
import { produce } from "immer";

export type NFTName = "Bud" | "Pet";

export type PlaceNFTAction = {
  type: "nft.placed";
  id: string;
  nft: NFTName;
  coordinates: Coordinates;
  location: PlaceableLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceNFTAction;
  createdAt?: number;
};

export function placeNFT({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const nft =
      action.nft === "Bud"
        ? copy.buds?.[Number(action.id)]
        : copy.pets?.nfts?.[Number(action.id)];

    if (
      action.nft === "Pet" &&
      !isPetNFTRevealed(Number(action.id), createdAt)
    ) {
      throw new Error("This Pet NFT is not revealed");
    }

    if (!nft) throw new Error("This NFT does not exist");

    if (nft.coordinates) throw new Error("This NFT is already placed");

    nft.coordinates = action.coordinates;
    nft.location = action.location;

    return copy;
  });
}
