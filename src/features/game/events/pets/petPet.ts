import { GameState } from "features/game/types/game";
import { PetName, isPetNapping } from "features/game/types/pets";
import { produce } from "immer";

export type PetPetAction = {
  type: "pet.pet";
  pet: PetName;
};

type Options = {
  state: GameState;
  action: PetPetAction;
  createdAt?: number;
};

export function petPet({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { pet } = action;
    const petData = stateCopy.pets?.common?.[pet];
    if (!petData) {
      throw new Error("Pet not found");
    }
    if (!isPetNapping(petData, createdAt)) {
      throw new Error("Pet is not napping");
    }
    petData.experience += 10;
    petData.pettedAt = createdAt;

    return stateCopy;
  });
}
