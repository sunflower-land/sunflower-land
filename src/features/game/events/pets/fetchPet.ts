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
import { BoostName, GameState } from "features/game/types/game";
import { produce } from "immer";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
import { isWearableActive } from "features/game/lib/wearables";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

export const getFetchPercentage = ({
  petLevel,
  fetchResource,
  isPetNFT,
}: {
  petLevel: number;
  fetchResource: PetResourceName;
  isPetNFT: boolean;
}) => {
  let fetchPercentage = 0;
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

  return fetchPercentage;
};

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
  const boostUsed: BoostName[] = [];

  if (
    isWearableActive({ game: state, name: "Squirrel Onesie" }) &&
    fetchResource === "Acorn"
  ) {
    yieldAmount += 1;
    boostUsed.push("Squirrel Onesie");
  }

  if (
    fetchResource === "Acorn" &&
    isCollectibleBuilt({ name: "Oaken", game: state }) &&
    prngChance({
      farmId,
      itemId: KNOWN_IDS[fetchResource],
      counter,
      chance: 25,
      criticalHitName: "Oaken",
    })
  ) {
    yieldAmount += 1;
    boostUsed.push("Oaken");
  }

  const fetchPercentage = getFetchPercentage({
    petLevel,
    fetchResource,
    isPetNFT,
  });

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

  return { yieldAmount, boostUsed };
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

    const initialFetchCount = stateCopy.farmActivity[`${fetch} Fetched`] ?? 0;
    const counter = petData.fetches?.[fetch] ?? initialFetchCount;

    const { yieldAmount, boostUsed } = getFetchYield({
      petLevel,
      fetchResource: fetch,
      isPetNFT,
      farmId,
      counter,
      state: stateCopy,
    });

    petData.fetches = {
      ...petData.fetches,
      [fetch]: counter + 1,
    };

    stateCopy.inventory[fetch] = (
      stateCopy.inventory[fetch] ?? new Decimal(0)
    ).add(yieldAmount);

    delete petData.fetchSeeds;

    stateCopy.farmActivity = trackFarmActivity(
      `${fetch} Fetched`,
      stateCopy.farmActivity,
    );

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostUsed,
      createdAt,
    });

    return stateCopy;
  });
}
