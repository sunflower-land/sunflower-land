import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  ANIMAL_RESOURCE_DROP,
  ANIMALS,
  AnimalType,
  isMutantAnimalChapterName,
} from "features/game/types/animals";
import { BoostName, GameState, MutantAnimal } from "features/game/types/game";
import {
  getAnimalLevel,
  getBoostedAwakeAt,
  getResourceDropAmount,
} from "features/game/lib/animals";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { getKeys } from "lib/object";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { getCurrentChapter } from "features/game/types/chapters";
import { CHAPTER_MUTANTS } from "features/game/types/chapterMutants";
import { randomInt } from "lib/utils/random";

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

export const MUTANT_ANIMAL_CHANCE_DIVIDEND = 5000;

export const getMutantAnimalChanceDividend = (
  animalType: AnimalType,
  animalLevel: number,
  game: GameState,
): { multiplier: number; boostsUsed: BoostName[] } => {
  const isChicken = animalType === "Chicken";
  const { inventory, bumpkin } = game;

  const baseChance = MUTANT_ANIMAL_CHANCE_DIVIDEND - (animalLevel - 1) * 150;
  let multiplier = 1;
  const boostsUsed: BoostName[] = [];

  if (isChicken && isCollectibleBuilt({ name: "Rooster", game })) {
    multiplier -= 0.5;
    boostsUsed.push("Rooster");
  }

  if (inventory["Barn Manager"]?.gt(0)) {
    multiplier -= 0.1;
    boostsUsed.push("Barn Manager");
  }
  if (inventory["Wrangler"]?.gt(0)) {
    multiplier -= 0.1;
    boostsUsed.push("Wrangler");
  }

  return { multiplier: Math.floor(baseChance * multiplier), boostsUsed };
};

export function getMutantAnimalReward(
  animalType: AnimalType,
  animalLevel: number,
  game: GameState,
  createdAt: number,
  options?: { honeyTreat?: boolean },
): {
  reward: MutantAnimal | undefined;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const chapter = getCurrentChapter(createdAt);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (!isMutantAnimalChapterName(chapter)) {
    return { reward: undefined, boostsUsed };
  }

  const { multiplier: dividend, boostsUsed: dividendBoosts } =
    getMutantAnimalChanceDividend(animalType, animalLevel, game);

  let rollDividend = dividend;
  const rollBoosts: { name: BoostName; value: string }[] = dividendBoosts.map(
    (name) => ({ name, value: "" }),
  );
  if (options?.honeyTreat) {
    rollDividend = Math.max(2, Math.floor(dividend / 2));
    rollBoosts.push({ name: "Honey Treat", value: "2× mutant chance" });
  }

  const random = randomInt(0, rollDividend);
  const isChapterMutant = random === 0;

  if (isChapterMutant) {
    const reward = CHAPTER_MUTANTS[chapter][animalType];
    if (reward) {
      return {
        reward: reward as MutantAnimal,
        boostsUsed: rollBoosts,
      };
    }
  }

  return { reward: undefined, boostsUsed: rollBoosts };
}

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

    const saltLickActive = animal.feedBuff?.name === "Salt Lick";

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

      let amountToAdd = new Decimal(boostedAmount ?? 0);
      const resourceBoosts = [...boostsUsed];
      if (saltLickActive) {
        amountToAdd = amountToAdd.mul(1.05);
        resourceBoosts.push({ name: "Salt Lick", value: "×1.05" });
      }

      copy.inventory[resource] = (
        copy.inventory[resource] ?? new Decimal(0)
      ).add(amountToAdd);

      copy.farmActivity = trackFarmActivity(
        `${resource} Collected`,
        copy.farmActivity,
      );

      copy.boostsUsedAt = updateBoostUsed({
        game: copy,
        boostNames: resourceBoosts,
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

    const { reward: mutantAnimal, boostsUsed: mutantAnimalBoostsUsed } =
      getMutantAnimalReward(action.animal, level, copy, createdAt, {
        honeyTreat: animal.feedBuff?.name === "Honey Treat",
      });

    if (mutantAnimal) {
      animal.reward = {
        items: [{ name: mutantAnimal, amount: 1 }],
      };
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

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: mutantAnimalBoostsUsed,
      createdAt,
    });

    if (animal.feedBuff) {
      animal.feedBuff.harvestsRemaining -= 1;
      if (animal.feedBuff.harvestsRemaining <= 0) {
        delete animal.feedBuff;
      }
    }

    return copy;
  });
}
