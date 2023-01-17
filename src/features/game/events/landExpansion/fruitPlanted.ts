import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  FruitName,
  FruitSeedName,
  FRUIT_SEEDS,
  isFruitSeed,
} from "features/game/types/fruits";
import { Collectibles, GameState } from "features/game/types/game";
import { randomInt } from "lib/utils/random";
import cloneDeep from "lodash.clonedeep";
import { getFruitYield } from "./fruitHarvested";

export type PlantFruitAction = {
  type: "fruit.planted";
  expansionIndex: number;
  index: number;
  seed: FruitSeedName;
};

function getHarvestsLeft() {
  return randomInt(3, 6);
}

function getPlantedAt(
  fruitName: FruitName,
  collectibles: Collectibles,
  createdAt: number
) {
  if (
    fruitName === "Orange" &&
    isCollectibleBuilt("Squirrel Monkey", collectibles)
  ) {
    return createdAt + FRUIT_SEEDS()["Orange Seed"].plantSeconds / 2;
  }

  return createdAt;
}

type Options = {
  state: Readonly<GameState>;
  action: PlantFruitAction;
  createdAt?: number;
  harvestsLeft?: () => number;
};

export function plantFruit({
  state,
  action,
  createdAt = Date.now(),
  harvestsLeft = getHarvestsLeft,
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { expansions, bumpkin } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  if (!expansion.fruitPatches) {
    throw new Error("Expansion does not have any fruit patches");
  }

  const { fruitPatches } = expansion;

  if (action.index < 0) {
    throw new Error("Fruit patch does not exist");
  }

  if (!Number.isInteger(action.index)) {
    throw new Error("Fruit patch does not exist");
  }

  const patch = fruitPatches[action.index];

  if (!patch) {
    throw new Error("Fruit patch does not exist");
  }

  if (patch.fruit?.plantedAt) {
    throw new Error("Fruit is already planted");
  }

  if (!isFruitSeed(action.seed)) {
    throw new Error("Not a fruit seed");
  }

  const seedCount = stateCopy.inventory[action.seed] || new Decimal(0);

  if (seedCount.lessThan(1)) {
    throw new Error("Not enough seeds");
  }

  let harvestCount = harvestsLeft();
  const invalidAmount = harvestCount > 6 || harvestCount < 3;

  if (invalidAmount) {
    throw new Error("Invalid harvests left amount");
  }

  if (isCollectibleBuilt("Immortal Pear", stateCopy.collectibles)) {
    harvestCount += 1;
  }

  stateCopy.inventory[action.seed] = stateCopy.inventory[action.seed]?.minus(1);

  const fruitName = FRUIT_SEEDS()[action.seed].yield;

  patch.fruit = {
    name: fruitName,
    plantedAt: getPlantedAt(fruitName, stateCopy.collectibles, createdAt),
    amount: getFruitYield(fruitName, stateCopy.collectibles),
    harvestedAt: 0,
    // Value will be overriden by BE
    harvestsLeft: harvestCount,
  };

  bumpkin.activity = trackActivity(
    `${action.seed} Planted`,
    bumpkin?.activity,
    new Decimal(1)
  );

  return stateCopy;
}
