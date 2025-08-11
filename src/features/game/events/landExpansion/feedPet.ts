import { produce } from "immer";
import { GameState, InventoryItemName } from "features/game/types/game";

import { PetName, PetResource, PETS } from "features/game/types/pets";
import Decimal from "decimal.js-light";

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
    const fedAt = pet?.fetchedAt ?? 0;

    if (createdAt - fedAt < PET_SLEEP_DURATION_MS) {
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

    stateCopy.inventory[action.resource] = petResource.add(1);
    stateCopy.inventory[craves] = foodAmount.sub(1);
    stateCopy.pets = {
      ...(stateCopy.pets ?? {}),
      [action.name]: {
        craves: action.resource,
        fetchedAt: createdAt,
      },
    };

    return stateCopy;
  });
}
