import { produce } from "immer";
import { GameState } from "features/game/types/game";

import {
  getPetExperience,
  isPetNeglected,
  PET_FOOD_EXPERIENCE,
  PetName,
} from "features/game/types/pets";

export type NeglectPetAction = {
  type: "pet.neglected";
  name: PetName;
};

type Options = {
  state: Readonly<GameState>;
  action: NeglectPetAction;
  createdAt?: number;
};

export function neglectPet({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const placed = copy.collectibles[action.name];
    const pet = copy.pets?.[action.name];

    if (!placed || !pet) {
      throw new Error(`Pet ${action.name} not found`);
    }

    if (!isPetNeglected({ pet, game: state })) {
      throw new Error("Pet is not neglected");
    }

    // Remove the craving
    pet.cravings = pet.cravings?.slice(1);

    const experience = getPetExperience(pet);

    // Drop the 5 Food worth of XP
    pet.experience = Math.max(experience - 5 * PET_FOOD_EXPERIENCE, 0);

    pet.readyAt = createdAt;

    return copy;
  });
}
