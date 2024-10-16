import { produce } from "immer";
import Decimal from "decimal.js-light";
import { ANIMALS, AnimalType } from "features/game/types/animals";
import { GameState } from "features/game/types/game";
import {
  getAnimalLevel,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { getKeys } from "features/game/types/craftables";
import { ANIMAL_RESOURCE_DROP } from "./feedAnimal";

export type LevelUpAnimalAction = {
  type: "animal.leveledUp";
  animal: AnimalType;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: LevelUpAnimalAction;
  createdAt?: number;
};

export function levelUpAnimal({
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

    if (animal.state !== "levelUp") {
      throw new Error("Animal is not ready to level up");
    }

    const newLevel = getAnimalLevel(animal.experience, animal.type);

    getKeys(ANIMAL_RESOURCE_DROP[action.animal][newLevel]).forEach(
      (resource) => {
        const amount = ANIMAL_RESOURCE_DROP[action.animal][newLevel][resource];
        copy.inventory[resource] = (
          copy.inventory[resource] ?? new Decimal(0)
        ).add(amount ?? new Decimal(0));
      },
    );

    animal.asleepAt = createdAt;
    animal.state = "idle";

    return copy;
  });
}
