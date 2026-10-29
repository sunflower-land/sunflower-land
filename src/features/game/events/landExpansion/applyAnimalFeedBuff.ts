import Decimal from "decimal.js-light";
import { produce } from "immer";
import { ANIMALS, type AnimalType } from "features/game/types/animals";
import type {
  AnimalFeedBuffName,
  BoostName,
  GameState,
} from "features/game/types/game";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import {
  getAnimalReadyAt,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { hasFeatureAccess } from "lib/flags";
import { isAnimalNeedingLove } from "./loveAnimal";

export const ANIMAL_FEED_BUFF_ITEMS: AnimalFeedBuffName[] = [
  "Salt Lick",
  "Honey Treat",
  "Truffle Seasoning",
];

export enum APPLY_ANIMAL_FEED_BUFF_ERRORS {
  INVALID_ITEM = "Not an animal feed buff item",
  NOT_ENOUGH = "Not enough items",
  ALREADY_BUFFED = "Animal already has a feed buff",
  SICK = "Cannot apply feed buff while animal is sick",
  NEEDS_LOVE = "Pet your animal before using this",
  NO_FEATURE_ACCESS = "Truffle Seasoning is not available yet",
}

function isAnimalAsleep(now: number, readyAt: number): boolean {
  return now < readyAt;
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

export const BASE_FEED_BUFF_HARVESTS = 3;
/** A Truffle Seasoning shortens ONE sleep (the charge is spent on the claim that starts it). */
export const TRUFFLE_SEASONING_SLEEPS = 1;

/**
 * How many produce claims a treat (or Mud, which borrows the same count) lasts.
 * Salt Lick and Honey Treat run three harvests; Truffle Seasoning one sleep.
 */
export function getAnimalHarvests(
  game: GameState,
  item?: AnimalFeedBuffName,
): {
  harvests: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let harvests =
    item === "Truffle Seasoning"
      ? TRUFFLE_SEASONING_SLEEPS
      : BASE_FEED_BUFF_HARVESTS;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  // Vibraphone doubles how long a feed buff lasts
  if (isCollectibleBuilt({ game, name: "Vibraphone" })) {
    harvests *= 2;
    boostsUsed.push({ name: "Vibraphone", value: "x2" });
  }

  return { harvests, boostsUsed };
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

    const readyAt = getAnimalReadyAt(animal, copy);

    if (
      isAnimalAsleep(createdAt, readyAt) &&
      isAnimalNeedingLove(animal, createdAt, readyAt)
    ) {
      throw new Error(APPLY_ANIMAL_FEED_BUFF_ERRORS.NEEDS_LOVE);
    }

    if (animal.feedBuff) {
      throw new Error(APPLY_ANIMAL_FEED_BUFF_ERRORS.ALREADY_BUFFED);
    }

    if (!isAnimalFeedBuffItem(action.item)) {
      throw new Error(APPLY_ANIMAL_FEED_BUFF_ERRORS.INVALID_ITEM);
    }

    // Truffle Seasoning rides on the Pigs' flag: Truffle only exists behind it
    if (
      action.item === "Truffle Seasoning" &&
      !hasFeatureAccess(copy, "PIGPEN")
    ) {
      throw new Error(APPLY_ANIMAL_FEED_BUFF_ERRORS.NO_FEATURE_ACCESS);
    }

    const count = copy.inventory[action.item] ?? new Decimal(0);
    if (count.lessThan(1)) {
      throw new Error(APPLY_ANIMAL_FEED_BUFF_ERRORS.NOT_ENOUGH);
    }

    copy.inventory[action.item] = count.minus(1);

    const { harvests, boostsUsed } = getAnimalHarvests(copy, action.item);

    animal.feedBuff = {
      name: action.item,
      harvestsRemaining: harvests,
    };

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: boostsUsed,
      createdAt,
    });

    return copy;
  });
}
