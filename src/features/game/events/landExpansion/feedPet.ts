import { produce } from "immer";
import {
  BoostName,
  GameState,
  InventoryItemName,
} from "features/game/types/game";

import {
  isPetNeglected,
  Pet,
  getPetLevel,
  PET_RESOURCES,
  PetName,
  PetResource,
  PET_FOOD_EXPERIENCE,
  getPetExperience,
} from "features/game/types/pets";
import Decimal from "decimal.js-light";
import { isCollectibleActive } from "features/game/lib/collectibleBuilt";
import { ConsumableName } from "features/game/types/consumables";

const CRAVINGS: ConsumableName[] = [
  "Pumpkin Cake",
  "Beetroot Cake",
  "Parsnip Cake",
  "Boiled Eggs",
  "Kale Stew",
  "Bumpkin Salad",
  "Pumpkin Soup",
  "Olive Flounder",
  "Power Smoothie",
  "Sushi Roll",
];

export const DEFAULT_PET_CRAVINGS: InventoryItemName[] = [
  "Pumpkin Soup",
  "Bumpkin Broth",
  "Goblin's Treat",
];

export function getPetCravings({
  pet,
  game,
}: {
  pet?: Pet;
  game: GameState;
}): { name: InventoryItemName; completedAt?: number }[] {
  const cravings = pet?.cravings;

  // If on old version return the cravings
  if (!!cravings && !!cravings[0]?.completedAt) {
    return cravings;
  }

  return DEFAULT_PET_CRAVINGS.map((c) => ({ name: c }));
}

export type FeedPetAction = {
  type: "pet.fed";
  name: PetName;
  food: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedPetAction;
  createdAt?: number;
};

export function isPetResting({
  pet,
  game,
  now = Date.now(),
}: {
  pet?: Pet;
  game: GameState;
  now?: number;
}): boolean {
  if (!pet?.readyAt) {
    return false;
  }

  return pet.readyAt > now;
}

export function getPetRestLeft({
  pet,
  now = Date.now(),
  game,
}: {
  pet?: Pet;
  now?: number;
  game: GameState;
}): number {
  if (!pet?.readyAt) {
    return 0;
  }

  return pet.readyAt - now;
}

export function getPetReadyAt({
  game,
  now = Date.now(),
  pet,
  fetched,
}: {
  game: GameState;
  now?: number;
  pet: Pet;
  fetched: PetResource;
}): { readyAt: number; boostsUsed: BoostName[] } {
  let duration = PET_RESOURCES[fetched].cooldownMs;
  const boostsUsed: BoostName[] = [];

  if (isCollectibleActive({ name: "Hound Shrine", game })) {
    duration = duration * 0.75;
    boostsUsed.push("Hound Shrine");
  }

  const level = getPetLevel(pet);

  if (level >= 50) {
    duration = duration * 0.8;
  } else if (level >= 10) {
    duration = duration * 0.9;
  }

  return { readyAt: now + duration, boostsUsed };
}

export function feedPet({
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

    if (isPetNeglected({ pet, game: stateCopy })) {
      throw new Error("Pet is neglected");
    }

    const requests = getPetCravings({ pet, game: stateCopy });

    const requestIndex = requests.findIndex(
      (request) => request.name === action.food && !request.completedAt,
    );

    if (requestIndex === -1) {
      throw new Error(`Pet does not crave ${action.food}`);
    }

    const foodAmount = stateCopy.inventory[action.food] ?? new Decimal(0);
    if (foodAmount.lt(1)) {
      throw new Error(`Missing ${action.food}`);
    }

    if (!pet) {
      pet = {
        level: 1,
        multiplier: 1,
      };
    }

    pet.experience = getPetExperience(pet) + PET_FOOD_EXPERIENCE;
    pet.energy = (pet.energy ?? 0) + PET_FOOD_EXPERIENCE;

    // Mark the request as completed
    pet.cravings = requests.map((request, index) =>
      index === requestIndex ? { ...request, completedAt: createdAt } : request,
    );

    const multiplier = 1;

    stateCopy.inventory[action.food] = foodAmount.sub(1);
    stateCopy.pets = {
      ...(stateCopy.pets ?? {}),
      [action.name]: pet,
    };

    return stateCopy;
  });
}
