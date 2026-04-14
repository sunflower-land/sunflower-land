import { GameState } from "features/game/types/game";
import {
  isPetNeglected,
  isPetOfTypeFed,
  PetName,
  isPetNFT as isPetNFTData,
} from "features/game/types/pets";
import { produce } from "immer";

export type NeglectPetAction = {
  type: "pet.neglected";
  petId: PetName | number;
};

type Options = {
  state: GameState;
  action: NeglectPetAction;
  createdAt?: number;
};

export function neglectPet({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { petId } = action;
    const isPetNFT = typeof petId === "number";

    const petData = isPetNFT
      ? stateCopy.pets?.nfts?.[petId]
      : stateCopy.pets?.common?.[petId];

    if (!petData) {
      throw new Error("Pet not found");
    }
    const isNeglected = isPetNeglected(petData, createdAt);

    if (!isNeglected) {
      throw new Error("Pet is not in neglected state");
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

    petData.experience = Math.max(0, petData.experience - 500);
    petData.cheeredAt = createdAt;

    return stateCopy;
  });
}
