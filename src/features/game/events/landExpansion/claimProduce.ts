import Decimal from "decimal.js-light";
import { produce } from "immer";
import { ANIMALS, AnimalType } from "features/game/types/animals";
import { GameState } from "features/game/types/game";
import { getAnimalLevel } from "features/game/lib/animals";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { ANIMAL_RESOURCE_DROP } from "./feedAnimal";
import { getKeys } from "features/game/types/craftables";

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

    const level = getAnimalLevel(animal.experience, animal.type);

    getKeys(ANIMAL_RESOURCE_DROP[action.animal][level]).forEach((resource) => {
      const amount = ANIMAL_RESOURCE_DROP[action.animal][level][resource];
      copy.inventory[resource] = (
        copy.inventory[resource] ?? new Decimal(0)
      ).add(amount ?? new Decimal(0));
    });

    animal.asleepAt = createdAt;
    animal.state = "idle";

    return copy;
  });
}
