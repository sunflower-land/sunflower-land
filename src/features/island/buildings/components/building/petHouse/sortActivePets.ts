import {
  PET_CATEGORIES,
  getPetLevel,
  getPetType,
  isPetNapping,
  isPetNeglected,
  type Pet,
  type PetName,
  type PetNFT,
  type PetType,
} from "features/game/types/pets";
import { getKeys } from "lib/object";

export type PetSortOption = "default" | "level" | "energy";

const VALID_SORT_OPTIONS: PetSortOption[] = ["default", "level", "energy"];

/**
 * The chosen pet sort order, persisted locally (not synced to the farm
 * save) so it's a client-side convenience preference shared between the
 * Pets and Feed tabs, surviving tab switches and closing the modal/game.
 */
const LOCAL_STORAGE_KEY = "petHouse.petSort";

export function getPetSort(): PetSortOption {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (cached && VALID_SORT_OPTIONS.includes(cached as PetSortOption)) {
    return cached as PetSortOption;
  }

  return "default";
}

export function setPetSort(sort: PetSortOption) {
  localStorage.setItem(LOCAL_STORAGE_KEY, sort);
}

// Pet type order map (static data - React Compiler will optimize)
const PET_TYPE_ORDER = getKeys(PET_CATEGORIES).reduce(
  (acc, petType, index) => {
    acc[petType] = index;
    return acc;
  },
  {} as Record<PetType, number>,
);

/**
 * Sorts active pets for display. Napping/neglected pets that need attention
 * always float to the top regardless of the chosen sort, since they block
 * feeding/fetching until resolved. Within the remaining pets, `sort` picks
 * the ordering: default (type, then experience), level (highest first), or
 * energy (highest first).
 */
export function sortActivePets(
  activePets: [PetName | number, Pet | PetNFT | undefined][],
  sort: PetSortOption,
  now: number,
): [PetName | number, Pet | PetNFT | undefined][] {
  return [...activePets].sort(([, petA], [, petB]) => {
    if (!petA || !petB) return 0;

    if (isPetNapping(petA, now) && !isPetNapping(petB, now)) return -1;
    if (!isPetNapping(petA, now) && isPetNapping(petB, now)) return 1;

    if (isPetNeglected(petA, now) && !isPetNeglected(petB, now)) return -1;
    if (!isPetNeglected(petA, now) && isPetNeglected(petB, now)) return 1;

    if (sort === "level") {
      return (
        getPetLevel(petB.experience).level - getPetLevel(petA.experience).level
      );
    }

    if (sort === "energy") {
      return petB.energy - petA.energy;
    }

    // Default: sort by pet type order first
    const petTypeA = getPetType(petA);
    const petTypeB = getPetType(petB);

    if (!petTypeA || !petTypeB) return 0;

    const typeComparison = PET_TYPE_ORDER[petTypeA] - PET_TYPE_ORDER[petTypeB];
    if (typeComparison !== 0) return typeComparison;

    // If same type, sort by experience (highest first)
    return petB.experience - petA.experience;
  });
}
