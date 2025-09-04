import { GameState } from "features/game/types/game";
import { PetName } from "features/game/types/pets";
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
    if (petData.state !== "neglected") {
      throw new Error("Pet is not in neglected state");
    }
    petData.experience -= 500;
    petData.state = "happy";
    return stateCopy;
  });
}
