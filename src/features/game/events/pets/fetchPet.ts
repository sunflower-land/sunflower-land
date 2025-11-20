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
import { trackFarmActivity } from "features/game/types/farmActivity";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
import { isWearableActive } from "features/game/lib/wearables";

export function getFetchYield({
  petLevel,
  fetchResource,
  isPetNFT,
  farmId,
  counter,
  state,
}: {
  petLevel: number;
  fetchResource: PetResourceName;
  isPetNFT: boolean;
  farmId: number;
  counter: number;
  state: GameState;
}) {
  let yieldAmount = 1;
  let fetchPercentage = 0;

  if (
    isWearableActive({ game: state, name: "Squirrel Onesie" }) &&
    fetchResource === "Acorn"
  ) {
    yieldAmount += 1;
  }

  if (petLevel < 15) return { yieldAmount }; // skips the rest of the logic if pet is less than level 15

  // check not really needed but just in case
  if (petLevel >= 15) {
    fetchPercentage += 10;
  }
  if (petLevel >= 50) {
    fetchPercentage += 5;
  }
  if (petLevel >= 100) {
    fetchPercentage += 10;
  }
  if (petLevel >= 150 && isPetNFT && fetchResource === "Moonfur") {
    fetchPercentage += 25; // total 50%
  }

  if (
    prngChance({
      farmId,
      itemId: KNOWN_IDS[fetchResource],
      counter,
      chance: fetchPercentage,
      criticalHitName: "Native",
    })
  ) {
    yieldAmount += 1;
  }

  if (petLevel >= 18 && fetchResource === "Acorn") {
    yieldAmount += 1;
  }

  if (petLevel >= 60 && isPetNFT) {
    const excludedResources: PetResourceName[] = ["Acorn", "Moonfur"];
    if (!excludedResources.includes(fetchResource)) {
      yieldAmount += 1;
    }
  }

  return { yieldAmount };
}

export type FetchPetAction = {
  type: "pet.fetched";
  petId: PetName | number;
  fetch: PetResourceName;
};

type Options = {
  state: GameState;
  action: FetchPetAction;
  farmId: number;
  createdAt?: number;
};

export function fetchPet({
  state,
  action,
  farmId,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { petId, fetch } = action;

    const isPetNFT = typeof petId === "number";

    const petData = isPetNFT
      ? stateCopy.pets?.nfts?.[petId]
      : stateCopy.pets?.common?.[petId];

    if (!petData) {
      throw new Error("Pet not found");
    }

    if (isPetNapping(petData, createdAt)) {
      throw new Error("Pet is napping");
    }

    if (isPetNeglected(petData, createdAt)) {
      throw new Error("Pet is neglected");
    }

    const fetchData = getPetFetches(petData);

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

    const { yieldAmount } = getFetchYield({
      petLevel,
      fetchResource: fetch,
      isPetNFT,
      farmId,
      counter: stateCopy.farmActivity[`${fetch} Fetched`] ?? 0,
      state: stateCopy,
    });

    stateCopy.inventory[fetch] = (
      stateCopy.inventory[fetch] ?? new Decimal(0)
    ).add(yieldAmount);

    delete petData.fetchSeeds;

    stateCopy.farmActivity = trackFarmActivity(
      `${fetch} Fetched`,
      stateCopy.farmActivity,
    );

    return stateCopy;
  });
}
