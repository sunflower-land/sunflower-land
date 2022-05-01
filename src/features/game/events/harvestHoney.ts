import Decimal from "decimal.js-light";
import {
  FlowerColor,
  FlowerType,
  GameState,
  Inventory,
  InventoryItemName,
  Tree,
} from "../types/game";

export enum POLLINATE_ERRORS {
  MISSING_BEE = "No bee",
  NO_BEES = "No bees left",
  NO_FLOWER = "No flower",
  STILL_GROWING = "Flower is still growing",
}

// 24 hours cooldown
export const FLOWER_RECOVERY_SECONDS = 24 * 60 * 60;

export function canPollinate(flower: FlowerType, now: number = Date.now()) {
  return now - flower.pollinatedAt > FLOWER_RECOVERY_SECONDS * 1000;
}

type GetPollinatedAtAtgs = {
  inventory: Inventory;
  pollinatedAt: number;
};

/**
 * Set a chopped in the past to make it replenish faster
 */
function getPollinatedAt({
  inventory,
  pollinatedAt,
}: GetPollinatedAtAtgs): number {
  return pollinatedAt;
}

/**
 * Returns the amount of bee required to pollinate a flower
 */
export function getRequiredBeeAmount(inventory: Inventory) {
  return new Decimal(3);
}

export type HoneyAction = {
  type: "flower.pollinated";
  index: number;
  item: InventoryItemName;
};

type Options = {
  state: GameState;
  action: HoneyAction;
  pollinatedAt?: number;
};

const flowers: Record<number, FlowerColor> = {
  0: "Blue Flower",
  1: "White Flower",
};

const FLOWER_START_AT_MS = Date.UTC(2022, 3, 16, 12);




export function availableFlower(now: number = Date.now()): FlowerColor {
  // Get the current time
  const difference = now - FLOWER_START_AT_MS;
  // 24 hour periods to collect a certain egg
  const periodsElapsed = Math.floor(difference / 1000 / 60 / 60 / 24);
  // Figure out how many periods of twenty-four hours have passed.
  const flowerIndex = 0

  return flowers[flowerIndex];
}













export function Pollinate({
  state,
  action,
  pollinatedAt = Date.now(),
}: Options): GameState {
  const requiredBees = getRequiredBeeAmount(state.inventory);
  if (action.item !== "Bee" && requiredBees.gt(0)) {
    throw new Error(POLLINATE_ERRORS.MISSING_BEE);
  }

  const beeAmount = state.inventory.Bee || new Decimal(0);
  if (beeAmount.lessThan(requiredBees)) {
    throw new Error(POLLINATE_ERRORS.NO_BEES);
  }

  const flower = state.flowers[action.index];

  if (!flower) {
    throw new Error(POLLINATE_ERRORS.NO_FLOWER);
  }

  if (!canPollinate(flower, pollinatedAt)) {
    throw new Error(POLLINATE_ERRORS.STILL_GROWING);
  }

  const honeyAmount = state.inventory.Honey || new Decimal(0);

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Bee: beeAmount.sub(requiredBees),
      Honey: honeyAmount.add(flower.honey),
    },
    flowers: {
      ...state.flowers,
      [action.index]: {
        pollinatedAt: getPollinatedAt({
          pollinatedAt,
          inventory: state.inventory,
        }),
        // Placeholder, random numbers generated on server side
        honey: new Decimal(3),
      },
    },
  };
}
