import { GameState } from "features/game/types/game";
import {
  PetName,
  isPetNapping,
  isPetOfTypeFed,
  isPetNFT as isPetNFTData,
} from "features/game/types/pets";
import { produce } from "immer";

export type PetPetAction = {
  type: "pet.pet";
  petId: PetName | number;
};

type Options = {
  state: GameState;
  action: PetPetAction;
  createdAt?: number;
};

export function petPet({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { petId } = action;
    const isPetNFT = typeof petId === "number";
    const petData = isPetNFT
      ? stateCopy.pets?.nfts?.[petId]
      : stateCopy.pets?.common?.[petId];

    if (!petData) {
      throw new Error("Pet not found");
    }
    if (!isPetNapping(petData, createdAt)) {
      throw new Error("Pet is not napping");
    }

    if (isPetNFTData(petData)) {
      if (!petData.traits) {
        throw new Error("Pet traits not found");
      }

      if (
        isPetOfTypeFed({
          nftPets: stateCopy.pets?.nfts ?? {},
          petType: petData.traits.type,
          id: petData.id,
          now: createdAt,
        })
      ) {
        throw new Error("Pet of type has been fed today");
      }
    }

    petData.experience += 10;
    petData.pettedAt = createdAt;

    return stateCopy;
  });
}
