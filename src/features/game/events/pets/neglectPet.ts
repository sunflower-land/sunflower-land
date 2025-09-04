import { GameState } from "features/game/types/game";
import { isPetNeglected, PetName } from "features/game/types/pets";
import { produce } from "immer";

export type NeglectPetAction = {
  type: "pet.neglected";
  pet: PetName;
};

type Options = {
  state: GameState;
  action: NeglectPetAction;
  createdAt?: number;
};

export function neglectPet({ state, action, createdAt }: Options) {
  return produce(state, (stateCopy) => {
    const { pet } = action;
    const petData = stateCopy.pets?.common?.[pet];
    if (!petData) {
      throw new Error("Pet not found");
    }
    const isNeglected = isPetNeglected(petData, createdAt);

    if (!isNeglected) {
      throw new Error("Pet is not in neglected state");
    }
    petData.experience = Math.max(0, petData.experience - 500);
    petData.requests.fedAt = createdAt;

    return stateCopy;
  });
}
