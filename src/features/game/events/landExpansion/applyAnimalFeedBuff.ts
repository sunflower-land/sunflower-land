import Decimal from "decimal.js-light";
import { produce } from "immer";
import { ANIMALS, AnimalType } from "features/game/types/animals";
import {
  Animal,
  AnimalFeedBuffName,
  GameState,
} from "features/game/types/game";
import { makeAnimalBuildingKey } from "features/game/lib/animals";

export const ANIMAL_FEED_BUFF_ITEMS: AnimalFeedBuffName[] = [
  "Salt Lick",
  "Honey Treat",
];

export enum APPLY_ANIMAL_FEED_BUFF_ERRORS {
  INVALID_ITEM = "Not an animal feed buff item",
  NOT_ENOUGH = "Not enough items",
  ALREADY_BUFFED = "Animal already has a feed buff",
  SICK = "Cannot apply feed buff while animal is sick",
  NEEDS_LOVE = "Pet your animal before using this",
}

/** Matches `animalMachine` `isAnimalNeedsLove` (uses event time, not wall clock). */
export function isAnimalNeedingLove(animal: Animal, now: number): boolean {
  const nap = animal.awakeAt - animal.asleepAt;
  const third = nap / 3;
  return animal.asleepAt + third < now && animal.lovedAt + third < now;
}

/**
 * Earliest timestamp at which this animal's current sleep cycle would
 * permit `loveAnimal`. Mirrors the gates in `loveAnimal` (loveAnimal.ts):
 * both `asleepAt + period` and `lovedAt + period` must have elapsed,
 * where `period = (awakeAt - asleepAt) / 3`. Callers should still check
 * `t < animal.awakeAt` — once the animal is awake the cycle is over and
 * no further love applies. The returned value can therefore be `>= awakeAt`
 * when no slot remains in this cycle (e.g. both slots already used); the
 * caller decides how to render that.
 */
export function getNextLoveAvailableAt(animal: Animal): number {
  const third = (animal.awakeAt - animal.asleepAt) / 3;
  return Math.max(animal.asleepAt + third, animal.lovedAt + third);
}

function isAnimalAsleep(animal: Animal, now: number): boolean {
  return now < animal.awakeAt;
}

export type ApplyAnimalFeedBuffAction = {
  type: "animal.feedBuffApplied";
  animal: AnimalType;
  id: string;
  item: AnimalFeedBuffName;
};

type Options = {
  state: Readonly<GameState>;
  action: ApplyAnimalFeedBuffAction;
  createdAt?: number;
};

export function isAnimalFeedBuffItem(item: string): item is AnimalFeedBuffName {
  return ANIMAL_FEED_BUFF_ITEMS.includes(item as AnimalFeedBuffName);
}

export function applyAnimalFeedBuff({
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

    if (animal.state === "sick") {
      throw new Error(APPLY_ANIMAL_FEED_BUFF_ERRORS.SICK);
    }

    if (
      isAnimalAsleep(animal, createdAt) &&
      isAnimalNeedingLove(animal, createdAt)
    ) {
      throw new Error(APPLY_ANIMAL_FEED_BUFF_ERRORS.NEEDS_LOVE);
    }

    if (animal.feedBuff) {
      throw new Error(APPLY_ANIMAL_FEED_BUFF_ERRORS.ALREADY_BUFFED);
    }

    if (!isAnimalFeedBuffItem(action.item)) {
      throw new Error(APPLY_ANIMAL_FEED_BUFF_ERRORS.INVALID_ITEM);
    }

    const count = copy.inventory[action.item] ?? new Decimal(0);
    if (count.lessThan(1)) {
      throw new Error(APPLY_ANIMAL_FEED_BUFF_ERRORS.NOT_ENOUGH);
    }

    copy.inventory[action.item] = count.minus(1);

    animal.feedBuff = {
      name: action.item,
      harvestsRemaining: 3,
    };

    return copy;
  });
}
