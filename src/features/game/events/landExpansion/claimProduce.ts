import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  ANIMAL_RESOURCE_DROP,
  ANIMALS,
  AnimalType,
} from "features/game/types/animals";
import { GameState } from "features/game/types/game";
import {
  getAnimalLevel,
  getBoostedAwakeAt,
  getResourceDropAmount,
} from "features/game/lib/animals";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { getKeys } from "features/game/types/craftables";
import { trackActivity } from "features/game/types/bumpkinActivity";

export type ClaimProduceAction = {
  type: "produce.claimed";
  animal: AnimalType;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimProduceAction;
  createdAt?: number;
};

export function claimProduce({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { buildingRequired } = ANIMALS[action.animal];
    const buildingKey = makeAnimalBuildingKey(buildingRequired);
    const animal = copy[buildingKey].animals[action.id];

    if (!animal) {
      throw new Error(
        `Animal ${action.id} not found in building ${buildingKey}`,
      );
    }

    if (animal.state !== "ready") {
      throw new Error("Animal is not ready to claim produce");
    }

    const level = getAnimalLevel(animal.experience, action.animal);

    getKeys(ANIMAL_RESOURCE_DROP[action.animal][level]).forEach((resource) => {
      const baseAmount = ANIMAL_RESOURCE_DROP[action.animal][level][
        resource
      ] as Decimal;
      const boostedAmount = getResourceDropAmount({
        game: copy,
        animalType: action.animal,
        baseAmount: baseAmount.toNumber(),
        resource,
        multiplier: animal.multiplier ?? 0,
      });

      copy.inventory[resource] = (
        copy.inventory[resource] ?? new Decimal(0)
      ).add(boostedAmount ?? new Decimal(0));

      copy.bumpkin.activity = trackActivity(
        `${resource} Collected`,
        copy.bumpkin.activity,
      );
    });

    animal.asleepAt = createdAt;
    animal.awakeAt = getBoostedAwakeAt({
      animalType: animal.type,
      createdAt,
      game: copy,
    });
    animal.state = "idle";
    animal.multiplier = 1;

    return copy;
  });
}
