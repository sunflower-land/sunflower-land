import { produce } from "immer";
import { GameState } from "features/game/types/game";

import { DollName } from "features/game/lib/crafting";
import Decimal from "decimal.js-light";
import { PetName } from "features/game/types/pets";
import { isPetResting } from "./feedPet";

export const DEFAULT_PET_TOY: DollName = "Doll";

export type WakeUpPetAction = {
  type: "pet.wakeUp";
  name: PetName;
};

type Options = {
  state: Readonly<GameState>;
  action: WakeUpPetAction;
  createdAt?: number;
};

export function wakePet({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const placed = state.collectibles[action.name];
    const pet = state.pets?.[action.name];

    if (!placed || !pet) {
      throw new Error(`Pet ${action.name} not found`);
    }

    if (!isPetResting({ pet, game: state })) {
      throw new Error("Pet is not sleeping");
    }

    const inventory = state.inventory[DEFAULT_PET_TOY] ?? new Decimal(0);

    if (inventory.lessThan(1)) {
      throw new Error("Player does not have a doll");
    }

    copy.inventory[DEFAULT_PET_TOY] = inventory.minus(1);

    pet.readyAt = createdAt;

    return copy;
  });
}
