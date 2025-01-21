import Decimal from "decimal.js-light";
import {
  isCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  GreenHouseFruitSeedName,
  isPatchFruitSeed,
  PATCH_FRUIT_SEEDS,
  PatchFruitSeedName,
} from "features/game/types/fruits";
import { GameState } from "features/game/types/game";
import { randomInt } from "lib/utils/random";
import { getFruitYield } from "./fruitHarvested";
import { isWearableActive } from "features/game/lib/wearables";
import { produce } from "immer";
import { SEASONAL_SEEDS } from "features/game/types/seeds";
import { hasFeatureAccess } from "lib/flags";
import { isFullMoonBerry } from "./seedBought";

export type PlantFruitAction = {
  type: "fruit.planted";
  index: string;
  seed: PatchFruitSeedName;
};
function getDefaultHarvestsLeft() {
  return randomInt(3, 6);
}

function getHarvestsLeft({
  state,
  harvestsLeft = getDefaultHarvestsLeft,
}: {
  state: GameState;
  harvestsLeft?: () => number;
}) {
  let harvestCount = harvestsLeft();

  if (isCollectibleBuilt({ name: "Immortal Pear", game: state })) {
    if (state.bumpkin.skills["Pear Turbocharge"]) {
      harvestCount += 2;
    } else {
      harvestCount += 1;
    }
  }
  return { harvestCount };
}

function getHarvestRange({ state }: { state: GameState }) {
  let minHarvest = 3;
  let maxHarvest = 6;
  if (isCollectibleBuilt({ name: "Immortal Pear", game: state })) {
    if (state.bumpkin.skills["Pear Turbocharge"]) {
      minHarvest += 2;
      maxHarvest += 2;
    } else {
      minHarvest += 1;
      maxHarvest += 1;
    }
  }

  return { minHarvest, maxHarvest };
}

export function getPlantedAt(
  patchFruitSeedName: PatchFruitSeedName,
  game: GameState,
  createdAt: number,
) {
  if (!patchFruitSeedName) return createdAt;

  const fruitTime = PATCH_FRUIT_SEEDS[patchFruitSeedName].plantSeconds;
  const boostedTime = getFruitPatchTime(patchFruitSeedName, game);

  const offset = fruitTime - boostedTime;

  return createdAt - offset * 1000;
}

const isBasicFruitSeed = (name: PatchFruitSeedName | GreenHouseFruitSeedName) =>
  name === "Blueberry Seed" || name === "Orange Seed";

const isAdvancedFruitSeed = (
  name: PatchFruitSeedName | GreenHouseFruitSeedName,
) => name === "Apple Seed" || name === "Banana Plant";

/**
 * Generic boost for all fruit types - normal + greenhouse
 */
export function getFruitTime({
  game,
  name,
}: {
  game: GameState;
  name: GreenHouseFruitSeedName | PatchFruitSeedName;
}) {
  let seconds = 1;

  if (
    isCollectibleActive({ name: "Super Totem", game }) ||
    isCollectibleActive({ name: "Time Warp Totem", game })
  ) {
    seconds = seconds * 0.5;
  }

  if (isCollectibleActive({ name: "Orchard Hourglass", game })) {
    seconds = seconds * 0.75;
  }

  // Vine Velocity: 10% reduction
  if (name === "Grape Seed" && game.bumpkin.skills["Vine Velocity"]) {
    seconds = seconds * 0.9;
  }

  if (name === "Grape Seed" && game.bumpkin.skills["Rice and Shine"]) {
    seconds = seconds * 0.95;
  }

  return seconds;
}

/**
 * Based on boosts, how long a fruit will take to grow
 */
export const getFruitPatchTime = (
  patchFruitSeedName: PatchFruitSeedName,
  game: GameState,
) => {
  const { bumpkin } = game;
  let seconds = PATCH_FRUIT_SEEDS[patchFruitSeedName]?.plantSeconds ?? 0;

  const baseMultiplier = getFruitTime({ game, name: patchFruitSeedName });
  seconds *= baseMultiplier;

  // Squirrel Monkey: 50% reduction
  if (
    patchFruitSeedName === "Orange Seed" &&
    isCollectibleBuilt({ name: "Squirrel Monkey", game })
  ) {
    seconds = seconds * 0.5;
  }

  // Nana: 10% reduction
  if (
    patchFruitSeedName === "Banana Plant" &&
    isCollectibleBuilt({ name: "Nana", game })
  ) {
    seconds = seconds * 0.9;
  }

  // Banana Onesie: 20% reduction
  if (
    patchFruitSeedName === "Banana Plant" &&
    isWearableActive({ name: "Banana Onesie", game })
  ) {
    seconds = seconds * 0.8;
  }

  // Lemon Tea Bath: 50% reduction
  if (
    patchFruitSeedName === "Lemon Seed" &&
    isCollectibleBuilt({ name: "Lemon Tea Bath", game })
  ) {
    seconds = seconds * 0.5;
  }

  // Lemon Frog: 25% reduction
  if (
    patchFruitSeedName === "Lemon Seed" &&
    isCollectibleBuilt({ name: "Lemon Frog", game })
  ) {
    seconds = seconds * 0.75;
  }

  // Tomato Clown: 50% reduction
  if (
    patchFruitSeedName === "Tomato Seed" &&
    isCollectibleBuilt({ name: "Tomato Clown", game })
  ) {
    seconds = seconds * 0.5;
  }

  // Cannon
  if (
    patchFruitSeedName === "Tomato Seed" &&
    isCollectibleBuilt({ name: "Cannonball", game })
  ) {
    seconds = seconds * 0.75;
  }

  // Catchup Skill: 10% reduction
  if (bumpkin.skills["Catchup"]) {
    seconds = seconds * 0.9;
  }

  // Long Pickings - -50% growth in Apple and Banana, but 2x in the rest
  if (bumpkin.skills["Long Pickings"]) {
    if (isAdvancedFruitSeed(patchFruitSeedName)) {
      seconds = seconds * 0.5;
    } else {
      seconds = seconds * 2;
    }
  }

  if (bumpkin.skills["Short Pickings"]) {
    if (isBasicFruitSeed(patchFruitSeedName)) {
      seconds = seconds * 0.5;
    } else {
      seconds = seconds * 2;
    }
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
  harvestsLeft = getDefaultHarvestsLeft,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { fruitPatches, bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const patch = fruitPatches[action.index];

    if (!patch) {
      throw new Error("Fruit patch does not exist");
    }

    if (patch.fruit?.plantedAt) {
      throw new Error("Fruit is already planted");
    }

    if (!isPatchFruitSeed(action.seed)) {
      throw new Error("Not a fruit seed");
    }

    const seedCount = stateCopy.inventory[action.seed] || new Decimal(0);

    if (seedCount.lessThan(1)) {
      throw new Error("Not enough seeds");
    }

    if (
      hasFeatureAccess(stateCopy, "SEASONAL_SEEDS") &&
      !SEASONAL_SEEDS[stateCopy.season.season].includes(action.seed)
    ) {
      throw new Error("This seed is not available in this season");
    }

    if (isFullMoonBerry(action.seed)) {
      harvestsLeft = () => 4;
    }

    const { harvestCount } = getHarvestsLeft({
      state: stateCopy,
      harvestsLeft,
    });

    const { minHarvest, maxHarvest } = getHarvestRange({ state: stateCopy });

    const invalidAmount =
      harvestCount > maxHarvest || harvestCount < minHarvest;

    if (invalidAmount) {
      throw new Error("Invalid harvests left amount");
    }

    stateCopy.inventory[action.seed] =
      stateCopy.inventory[action.seed]?.minus(1);

    const fruitName = PATCH_FRUIT_SEEDS[action.seed].yield;

    patch.fruit = {
      name: fruitName,
      plantedAt: getPlantedAt(action.seed, stateCopy, createdAt),
      amount: getFruitYield({
        name: fruitName,
        game: stateCopy,
        fertiliser: patch.fertiliser?.name,
      }),
      harvestedAt: 0,
      // Value will be overridden by BE
      harvestsLeft: harvestCount,
    };

    bumpkin.activity = trackActivity(
      `${action.seed} Planted`,
      bumpkin?.activity,
      new Decimal(1),
    );

    return stateCopy;
  });
}
