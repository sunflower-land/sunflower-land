import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type WalkPetAction = {
  type: "pet.walked";
  petId: number;
};

type Options = {
  state: GameState;
  action: WalkPetAction;
  createdAt?: number;
};

export function walkPet({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { petId } = action;
    const petData = stateCopy.pets?.nfts?.[petId];
    if (!petData) {
      throw new Error("Pet not found");
    }

    const currentWalkingPet = Object.values(stateCopy.pets?.nfts ?? {}).find(
      (pet) => pet.walking,
    );

    if (currentWalkingPet && currentWalkingPet.id !== petId) {
      // Unset the current walking pet
      currentWalkingPet.walking = false;
    }

    if (petData.walking) {
      petData.walking = false;
    } else {
      petData.walking = true;
    }
  });
}
