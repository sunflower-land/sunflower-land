import Decimal from "decimal.js-light";
import {
  getPetLevel,
  getPetFetches,
  isPetNapping,
  isPetNeglected,
  PET_RESOURCES,
  type PetName,
  type PetResourceName,
} from "features/game/types/pets";
import type { BoostName, GameState } from "features/game/types/game";
import { produce, type Draft } from "immer";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { isWearableActive } from "features/game/lib/wearables";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

/**
 * Thrown by {@link fetchPet} when a pet lacks the energy for a fetch. Bulk
 * fetching treats this as the expected "this pet is tapped out" stop signal,
 * as opposed to other errors (invalid/stale action) which should reject.
 */
export class PetNotEnoughEnergyError extends Error {
  constructor() {
    super("Pet doesn't have enough energy");
    this.name = "PetNotEnoughEnergyError";
  }
}

export const getPetLevelFetchYield = ({
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
  state,
}: {
  petLevel: number;
  fetchResource: PetResourceName;
  isPetNFT: boolean;
  state: GameState;
}) {
  let yieldAmount = new Decimal(1);
  const boostUsed: { name: BoostName; value: string }[] = [];

  if (
    isWearableActive({ game: state, name: "Squirrel Onesie" }) &&
    fetchResource === "Acorn"
  ) {
    yieldAmount = yieldAmount.add(1);
    boostUsed.push({ name: "Squirrel Onesie", value: "+1" });
  }

  if (
    fetchResource === "Acorn" &&
    isCollectibleBuilt({ name: "Oaken", game: state })
  ) {
    yieldAmount = yieldAmount.add(0.25);
    boostUsed.push({ name: "Oaken", value: "+0.25" });
  }

  if (fetchResource !== "Fossil Shell") {
    const fetchPercentage = getPetLevelFetchYield({
      petLevel,
      fetchResource,
      isPetNFT,
    });
    const nativeBoost = fetchPercentage / 100;
    if (nativeBoost > 0) {
      yieldAmount = yieldAmount.add(nativeBoost);
      boostUsed.push({ name: "Native", value: `+${nativeBoost}` });
    }
  }

  if (petLevel >= 18 && fetchResource === "Acorn") {
    yieldAmount = yieldAmount.add(1);
  }

  if (petLevel >= 60 && isPetNFT) {
    const excludedResources: PetResourceName[] = ["Acorn", "Moonfur"];
    if (!excludedResources.includes(fetchResource)) {
      yieldAmount = yieldAmount.add(1);
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
  createdAt?: number;
};

/**
 * Applies a single fetch directly to an Immer draft. Shared by {@link fetchPet}
 * and the bulk fetch handler so a bulk action can run every fetch on one draft
 * instead of paying for a `produce` per unit. Throws the same errors as
 * `fetchPet` (including {@link PetNotEnoughEnergyError} when out of energy).
 */
export function applyFetch(
  stateCopy: Draft<GameState>,
  {
    petId,
    fetch,
    createdAt,
  }: {
    petId: PetName | number;
    fetch: PetResourceName;
    createdAt: number;
  },
) {
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
    throw new PetNotEnoughEnergyError();
  }

  petData.energy -= energyRequired;

  const { yieldAmount, boostUsed } = getFetchYield({
    petLevel,
    fetchResource: fetch,
    isPetNFT,
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

  stateCopy.boostsUsedAt = updateBoostUsed({
    game: stateCopy,
    boostNames: boostUsed,
    createdAt,
  });
}

export function fetchPet({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    applyFetch(stateCopy, {
      petId: action.petId,
      fetch: action.fetch,
      createdAt,
    });
  });
}
