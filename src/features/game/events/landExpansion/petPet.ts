import { produce } from "immer";
import { GameState } from "features/game/types/game";

import {
  getPetExperience,
  isPetNeglected,
  Pet,
  PET_PET_EXPERIENCE,
  PetName,
} from "features/game/types/pets";

export type PetPetAction = {
  type: "pet.petted";
  name: PetName;
};

type Options = {
  state: Readonly<GameState>;
  action: PetPetAction;
  createdAt?: number;
};

export const PET_AFFECTION_COOLDOWN = 2 * 60 * 60 * 1000;

export function getPettableAt({ game, pet }: { game: GameState; pet: Pet }): {
  readyAt: number;
} {
  const duration = PET_AFFECTION_COOLDOWN;

  return { readyAt: (pet.pettedAt ?? 0) + duration };
}

export function canPetPet({
  game,
  pet,
}: {
  game: GameState;
  pet?: Pet;
}): boolean {
  if (!pet) return false;

  return getPettableAt({ game, pet }).readyAt < Date.now();
}

export function petPet({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const placed = stateCopy.collectibles[action.name];

    if (!placed) {
      throw new Error(`Pet ${action.name} not found`);
    }

    const pet = stateCopy.pets?.[action.name];

    if (!pet) {
      throw new Error(`Pet ${action.name} not found`);
    }

    if (isPetNeglected({ pet, game: stateCopy })) {
      throw new Error("Pet is neglected");
    }

    if (!canPetPet({ pet, game: stateCopy })) {
      throw new Error("Pet is not ready to be petted");
    }

    pet.pettedAt = createdAt;
    pet.experience = getPetExperience(pet) + PET_PET_EXPERIENCE;

    return stateCopy;
  });
}
