import Decimal from "decimal.js-light";
import {
  getPetLevel,
  getPetFetches,
  isPetNapping,
  isPetNeglected,
  PET_RESOURCES,
  PetName,
  PetResourceName,
} from "features/game/types/pets";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type FetchPetAction = {
  type: "pet.fetched";
  pet: PetName;
  fetch: PetResourceName;
};

type Options = {
  state: GameState;
  action: FetchPetAction;
  createdAt?: number;
};

export function fetchPet({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { pet, fetch } = action;

    const petData = stateCopy.pets?.common?.[pet];
    if (!petData) {
      throw new Error("Pet not found");
    }

    if (isPetNapping(petData, createdAt)) {
      throw new Error("Pet is napping");
    }

    if (isPetNeglected(petData, createdAt)) {
      throw new Error("Pet is neglected");
    }

    const fetchData = getPetFetches(pet);

    const fetchEntry = fetchData.fetches.find(
      (fetchEntry) => fetchEntry.name === fetch,
    );

    if (!fetchEntry) {
      throw new Error("Fetch not found");
    }

    const { level: petLevel } = getPetLevel(petData.experience);
    if (petLevel < fetchEntry.level) {
      throw new Error("Pet level doesn't match fetch required level");
    }

    const energyRequired = PET_RESOURCES[fetch].energy;
    if (petData.energy < energyRequired) {
      throw new Error("Pet doesn't have enough energy");
    }

    petData.energy -= energyRequired;

    const yieldAmount = petData.fetches?.[fetch] ?? 1;
    stateCopy.inventory[fetch] = (
      stateCopy.inventory[fetch] ?? new Decimal(0)
    ).add(yieldAmount);

    petData.fetches = {
      ...petData.fetches,
      [fetch]: 1, // next yield is set in api
    };

    return stateCopy;
  });
}
