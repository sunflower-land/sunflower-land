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
import { trackFarmActivity } from "features/game/types/farmActivity";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

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

    const buildings = copy.buildings[buildingRequired];
    if (!buildings?.some((building) => !!building.coordinates)) {
      throw new Error("Building does not exist");
    }

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
      const { amount: boostedAmount, boostsUsed } = getResourceDropAmount({
        game: copy,
        animalType: action.animal,
        baseAmount: baseAmount.toNumber(),
        resource,
        multiplier: animal.multiplier ?? 0,
      });

      copy.inventory[resource] = (
        copy.inventory[resource] ?? new Decimal(0)
      ).add(boostedAmount ?? new Decimal(0));

      copy.farmActivity = trackFarmActivity(
        `${resource} Collected`,
        copy.farmActivity,
      );

      copy.boostsUsedAt = updateBoostUsed({
        game: copy,
        boostNames: boostsUsed,
        createdAt,
      });
    });

    // Apply reward items if any
    if (animal.reward?.items) {
      animal.reward.items.forEach((rewardItem) => {
        copy.inventory[rewardItem.name] = (
          copy.inventory[rewardItem.name] ?? new Decimal(0)
        ).add(rewardItem.amount);
      });

      // Remove reward items from the animal
      delete animal.reward;
    }

    animal.asleepAt = createdAt;
    const { awakeAt, boostsUsed } = getBoostedAwakeAt({
      animalType: animal.type,
      createdAt,
      game: copy,
    });
    animal.awakeAt = awakeAt;
    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: boostsUsed,
      createdAt,
    });
    animal.state = "idle";
    animal.multiplier = 1;

    return copy;
  });
}
