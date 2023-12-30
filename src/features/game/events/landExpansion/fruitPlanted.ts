import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  FruitSeedName,
  FRUIT_SEEDS,
  isFruitSeed,
} from "features/game/types/fruits";
import { Bumpkin, Collectibles, GameState } from "features/game/types/game";
import { randomInt } from "lib/utils/random";
import cloneDeep from "lodash.clonedeep";
import { getFruitYield } from "./fruitHarvested";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type PlantFruitAction = {
  type: "fruit.planted";
  index: string;
  seed: FruitSeedName;
};

function getHarvestsLeft() {
  return randomInt(3, 6);
}

function getPlantedAt(
  fruitSeedName: FruitSeedName,
  wearables: BumpkinParts,
  game: GameState,
  createdAt: number
) {
  if (!fruitSeedName) return createdAt;

  const fruitTime = FRUIT_SEEDS()[fruitSeedName].plantSeconds;
  const boostedTime = getFruitTime(fruitSeedName, game, wearables);

  const offset = fruitTime - boostedTime;

  return createdAt - offset * 1000;
}

/**
 * Based on boosts, how long a fruit will take to grow
 */
export const getFruitTime = (
  fruitSeedName: FruitSeedName,
  game: GameState,
  wearables: BumpkinParts
) => {
  let seconds = FRUIT_SEEDS()[fruitSeedName]?.plantSeconds ?? 0;

  // Squirrel Monkey: 50% reduction
  if (
    fruitSeedName === "Orange Seed" &&
    isCollectibleBuilt({ name: "Squirrel Monkey", game })
  ) {
    seconds = seconds * 0.5;
  }

  // Nana: 10% reduction
  if (
    fruitSeedName === "Banana Plant" &&
    isCollectibleBuilt({ name: "Nana", game })
  ) {
    seconds = seconds * 0.9;
  }

  if (
    fruitSeedName === "Banana Plant" &&
    wearables.onesie === "Banana Onesie"
  ) {
    seconds = seconds * 0.8;
  }

  return seconds;
};

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
  const { fruitPatches, bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
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

  if (isCollectibleBuilt({ name: "Immortal Pear", game: stateCopy })) {
    harvestCount += 1;
  }

  stateCopy.inventory[action.seed] = stateCopy.inventory[action.seed]?.minus(1);

  const fruitName = FRUIT_SEEDS()[action.seed].yield;

  patch.fruit = {
    name: fruitName,
    plantedAt: getPlantedAt(
      action.seed,
      (stateCopy.bumpkin as Bumpkin).equipped,
      stateCopy,
      createdAt
    ),
    amount: getFruitYield({
      name: fruitName,
      game: stateCopy,
      buds: stateCopy.buds ?? {},
      wearables: bumpkin.equipped,
      fertiliser: patch.fertiliser?.name,
    }),
    harvestedAt: 0,
    // Value will be overridden by BE
    harvestsLeft: harvestCount,
  };

  bumpkin.activity = trackActivity(
    `${action.seed} Planted`,
    bumpkin?.activity,
    new Decimal(1)
  );

  return stateCopy;
}
