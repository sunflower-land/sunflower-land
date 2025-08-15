import { produce } from "immer";
import { GameState } from "features/game/types/game";

import {
  isPetNeglected,
  getPetLevel,
  PET_RESOURCES,
  PetName,
  PetResource,
  PETS,
} from "features/game/types/pets";
import Decimal from "decimal.js-light";
import { isPetResting } from "./feedPet";

export type FetchPetAction = {
  type: "pet.fetched";
  name: PetName;
  resource: PetResource;
};

type Options = {
  state: Readonly<GameState>;
  action: FetchPetAction;
  createdAt?: number;
};

export function fetchPet({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const placed = stateCopy.collectibles[action.name];

    if (!placed) {
      throw new Error(`Pet ${action.name} not found`);
    }

    let pet = stateCopy.pets?.[action.name];

    if (isPetResting({ pet, game: stateCopy })) {
      throw new Error("Pet is sleeping");
    }

    if (isPetNeglected({ pet, game: stateCopy })) {
      throw new Error("Pet is neglected");
    }

    if (!pet) {
      pet = {
        level: 1,
        multiplier: 1,
      };
    }

    // Can pet get resources
    const resource = PETS[action.name].fetches.find(
      (fetch) => fetch.name === action.resource,
    );

    if (!resource) {
      throw new Error(`Pet ${action.name} cannot fetch ${action.resource}`);
    }

    if (resource.level > getPetLevel(pet)) {
      throw new Error(`Pet ${action.name} is not at level ${resource.level}`);
    }

    // Check if pet has enough energy
    if ((pet.energy ?? 0) < PET_RESOURCES[action.resource].energy) {
      throw new Error(`Pet ${action.name} does not have enough energy`);
    }

    // Add the resource to the inventory
    stateCopy.inventory[action.resource] = (
      stateCopy.inventory[action.resource] ?? new Decimal(0)
    ).add(1);

    // Remove the energy from the pet
    pet.energy = (pet.energy ?? 0) - PET_RESOURCES[action.resource].energy;

    stateCopy.pets = {
      ...(stateCopy.pets ?? {}),
      [action.name]: pet,
    };

    return stateCopy;
  });
}
