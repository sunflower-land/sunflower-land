import Decimal from "decimal.js-light";
import { getFetchYield } from "features/game/events/pets/fetchPet";
import type { GameState } from "features/game/types/game";
import {
  getPetFetches,
  getPetLevel,
  getPetType,
  isPetNapping,
  isPetNeglected,
  isPetNFT,
  PET_RESOURCES,
  type Pet,
  type PetNFT,
  type PetName,
  type PetResourceName,
} from "features/game/types/pets";
import { getKeys, getObjectEntries } from "lib/object";

export type BulkFetchEntry = {
  petId: PetName | number;
  fetch: PetResourceName;
  amount: number;
};

export type BulkFetchPlan = {
  /** Flat plan: how many times to fetch each resource from each pet. */
  fetches: BulkFetchEntry[];
  /**
   * Projected total yielded per resource. May slightly exceed the request when
   * a single fetch's yield overshoots the remaining demand.
   */
  fulfilled: Partial<Record<PetResourceName, Decimal>>;
  /** Amount of each requested resource that could not be met. */
  shortfall: Partial<Record<PetResourceName, Decimal>>;
  /** Working energy remaining per pet after the plan, keyed by String(petId). */
  energyAfter: Record<string, number>;
};

type PlanBulkFetchParams = {
  activePets: [PetName | number, Pet | PetNFT | undefined][];
  state: GameState;
  desired: Partial<Record<PetResourceName, number>>;
  now: number;
};

type PetWork = {
  petId: PetName | number;
  key: string;
  energy: number;
  yields: Partial<Record<PetResourceName, Decimal>>;
};

/**
 * Plans the "best" set of pet fetches to satisfy a shopping-list of resources
 * across all of a player's pets.
 *
 * Strategy — a deterministic, best-effort greedy:
 *  1. Only awake, non-neglected pets with unlocked fetches are eligible.
 *  2. Requested resources are allocated scarcest-first (fewest capable pets),
 *     so a versatile pet's energy is not spent on a resource many pets share.
 *  3. For each resource, each single fetch goes to the pet with the highest
 *     yield (fewest fetches → least energy for that resource). Because
 *     scarcest resources are allocated first, the pets that rarer resources
 *     depend on are already reserved, so favouring yield here does not starve
 *     them. Ties break toward the pet least useful elsewhere (fewest OTHER
 *     still-needed resources), then more remaining energy, then a stable id.
 *
 * Yields are deterministic (`getFetchYield`) and energy is the only limiter, so
 * the projection is exact. Anything that cannot be met is reported as
 * `shortfall` rather than throwing — the executing `pets.bulkFetch` event
 * re-validates every fetch anyway.
 *
 * Being a greedy per-resource pick, this is not a global optimum: a versatile
 * pet with limited energy can be spent on a shared resource a specialist could
 * have covered, occasionally leaving another request short (an exact optimum is
 * an assignment problem).
 */
export function planBulkFetch({
  activePets,
  state,
  desired,
  now,
}: PlanBulkFetchParams): BulkFetchPlan {
  // 1. Build the eligible pet working set (awake, cared-for, has unlocked fetches).
  const pets: PetWork[] = [];
  activePets.forEach(([petId, pet]) => {
    if (!pet) return;
    if (isPetNapping(pet, now) || isPetNeglected(pet, now)) return;
    if (!getPetType(pet)) return; // NFT without a type has no fetches

    const { level } = getPetLevel(pet.experience);
    const unlocked = getPetFetches(pet).fetches.filter(
      (fetch) => level >= fetch.level,
    );
    if (unlocked.length === 0) return;

    const isNFT = isPetNFT(pet);
    const yields: Partial<Record<PetResourceName, Decimal>> = {};
    unlocked.forEach(({ name }) => {
      yields[name] = getFetchYield({
        petLevel: level,
        fetchResource: name,
        isPetNFT: isNFT,
        state,
      }).yieldAmount;
    });

    pets.push({ petId, key: String(petId), energy: pet.energy, yields });
  });

  // 2. Outstanding demand (every positive request; unmet ones surface as shortfall).
  const remaining: Partial<Record<PetResourceName, Decimal>> = {};
  getObjectEntries(desired).forEach(([resource, amount]) => {
    if (!amount || amount <= 0) return;
    remaining[resource] = new Decimal(amount);
  });

  const canFetch = (pet: PetWork, resource: PetResourceName) =>
    pet.yields[resource] !== undefined &&
    pet.energy >= PET_RESOURCES[resource].energy;

  // 3. Allocation order: scarcest resource first, then higher energy cost, then name.
  const capableCount: Partial<Record<PetResourceName, number>> = {};
  const order = getKeys(remaining);
  order.forEach((resource) => {
    capableCount[resource] = pets.filter(
      (pet) => pet.yields[resource] !== undefined,
    ).length;
  });
  order.sort((a, b) => {
    if (capableCount[a] !== capableCount[b]) {
      return (capableCount[a] ?? 0) - (capableCount[b] ?? 0);
    }
    const energyA = PET_RESOURCES[a].energy;
    const energyB = PET_RESOURCES[b].energy;
    if (energyA !== energyB) return energyB - energyA;
    return a.localeCompare(b);
  });

  // 4. Greedy allocation, one fetch at a time.
  const counts: Record<string, Partial<Record<PetResourceName, number>>> = {};
  const fulfilled: Partial<Record<PetResourceName, Decimal>> = {};

  const otherNeededUses = (pet: PetWork, resource: PetResourceName) =>
    order.filter(
      (other) =>
        other !== resource &&
        (remaining[other] ?? new Decimal(0)).gt(0) &&
        canFetch(pet, other),
    ).length;

  order.forEach((resource) => {
    const cost = PET_RESOURCES[resource].energy;
    let outstanding = remaining[resource] ?? new Decimal(0);

    while (outstanding.gt(0)) {
      const candidates = pets.filter((pet) => canFetch(pet, resource));
      if (candidates.length === 0) break;

      candidates.sort((a, b) => {
        // Energy-efficient: the highest-yield pet needs the fewest fetches, so
        // the least energy, for this resource. Scarcest-first ordering has
        // already reserved the pets that rarer resources depend on, so a
        // versatile high-yield pet (e.g. an NFT) is used here, not saved.
        const yieldA = a.yields[resource] as Decimal;
        const yieldB = b.yields[resource] as Decimal;
        if (!yieldA.eq(yieldB)) return yieldB.minus(yieldA).toNumber();

        // Among equal-yield pets, prefer the one least useful elsewhere, then
        // the one with more energy, then a stable id.
        const usesA = otherNeededUses(a, resource);
        const usesB = otherNeededUses(b, resource);
        if (usesA !== usesB) return usesA - usesB;

        if (a.energy !== b.energy) return b.energy - a.energy;
        return a.key.localeCompare(b.key);
      });

      const chosen = candidates[0];
      const yielded = chosen.yields[resource] as Decimal;
      chosen.energy -= cost;
      outstanding = outstanding.minus(yielded);

      counts[chosen.key] = counts[chosen.key] ?? {};
      counts[chosen.key][resource] = (counts[chosen.key][resource] ?? 0) + 1;
      fulfilled[resource] = (fulfilled[resource] ?? new Decimal(0)).add(
        yielded,
      );
    }

    remaining[resource] = outstanding;
  });

  // 5. Build outputs.
  const fetches: BulkFetchEntry[] = [];
  pets.forEach((pet) => {
    const petCounts = counts[pet.key];
    if (!petCounts) return;
    getObjectEntries(petCounts).forEach(([fetch, amount]) => {
      if (amount && amount > 0) {
        fetches.push({ petId: pet.petId, fetch, amount });
      }
    });
  });

  const shortfall: Partial<Record<PetResourceName, Decimal>> = {};
  getObjectEntries(remaining).forEach(([resource, outstanding]) => {
    if (outstanding && outstanding.gt(0)) shortfall[resource] = outstanding;
  });

  const energyAfter: Record<string, number> = {};
  pets.forEach((pet) => {
    energyAfter[pet.key] = pet.energy;
  });

  return { fetches, fulfilled, shortfall, energyAfter };
}
