import { produce } from "immer";
import {
  BoostName,
  GameState,
  InventoryItemName,
} from "features/game/types/game";

import {
  Pet,
  PET_RESOURCES,
  PetName,
  PetResource,
  PETS,
} from "features/game/types/pets";
import Decimal from "decimal.js-light";
import { isCollectibleActive } from "features/game/lib/collectibleBuilt";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export const DEFAULT_PET_FOOD: InventoryItemName = "Pumpkin Soup";

export type FeedPetAction = {
  type: "pet.fed";
  name: PetName;
  resource: PetResource;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedPetAction;
  createdAt?: number;
};

const PET_SLEEP_DURATION_MS = 12 * 60 * 60 * 1000;

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
}: {
  game: GameState;
  now?: number;
}): { readyAt: number; boostsUsed: BoostName[] } {
  let duration = PET_SLEEP_DURATION_MS;
  const boostsUsed: BoostName[] = [];

  if (isCollectibleActive({ name: "Hound Shrine", game })) {
    duration = duration * 0.75;
    boostsUsed.push("Hound Shrine");
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

    const pet = stateCopy.pets?.[action.name];

    if (isPetResting({ pet, game: stateCopy })) {
      throw new Error("Pet is sleeping");
    }

    const craves = pet?.craves ?? DEFAULT_PET_FOOD;

    const foodAmount = stateCopy.inventory[craves] ?? new Decimal(0);
    if (foodAmount.lt(1)) {
      throw new Error(`Missing ${craves}`);
    }

    const petConfig = PETS[action.name];
    if (!petConfig.fetches.includes(action.resource)) {
      throw new Error(`Pet cannot fetch ${action.resource}`);
    }

    const petResource = stateCopy.inventory[action.resource] ?? new Decimal(0);

    const { readyAt, boostsUsed } = getPetReadyAt({
      game: stateCopy,
      now: createdAt,
    });

    stateCopy.inventory[action.resource] = petResource.add(1);
    stateCopy.inventory[craves] = foodAmount.sub(1);
    stateCopy.pets = {
      ...(stateCopy.pets ?? {}),
      [action.name]: {
        craves: action.resource,
        readyAt,
      },
    };

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    return stateCopy;
  });
}
