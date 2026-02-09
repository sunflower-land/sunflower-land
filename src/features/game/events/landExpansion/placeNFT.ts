import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { PlaceableLocation } from "features/game/types/collectibles";
import { GameState } from "features/game/types/game";
import {
  getPetType,
  getPlacedNFTPetTypesInPetHouse,
  getPlacedNFTPetsCount,
  isPetNFTRevealed,
  PET_HOUSE_CAPACITY,
  PetNFT,
} from "features/game/types/pets";
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

    // Only Pet NFTs can be placed in the pet house, not Buds
    if (action.nft === "Bud" && action.location === "petHouse") {
      throw new Error("Buds cannot be placed in the pet house");
    }

    // Check pet house capacity for NFT pets
    if (action.nft === "Pet" && action.location === "petHouse") {
      const level = copy.petHouse?.level ?? 1;
      const capacity = PET_HOUSE_CAPACITY[level]?.nftPets ?? 0;
      const currentCount = getPlacedNFTPetsCount(copy.pets);

      if (currentCount >= capacity) {
        throw new Error("Pet house is at capacity for NFT pets");
      }

      // One NFT per type in pet house: block if this pet's type is already placed
      const placedTypes = getPlacedNFTPetTypesInPetHouse(copy.pets);
      const petType = getPetType(nft as PetNFT);
      if (petType && placedTypes.includes(petType)) {
        throw new Error(
          "A pet of this type is already placed in the pet house",
        );
      }
    }

    nft.coordinates = action.coordinates;
    nft.location = action.location;

    return copy;
  });
}
