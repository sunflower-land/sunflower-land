import Decimal from "decimal.js-light";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  GreenHouseFruitSeedName,
  isPatchFruitSeed,
  PATCH_FRUIT_SEEDS,
  PatchFruitSeedName,
} from "features/game/types/fruits";
import { BoostName, GameState } from "features/game/types/game";
import { randomInt } from "lib/utils/random";
import { isWearableActive } from "features/game/lib/wearables";
import { produce } from "immer";
import { SEASONAL_SEEDS } from "features/game/types/seeds";
import { isFullMoonBerry } from "./seedBought";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

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
): { plantedAt: number; boostsUsed: BoostName[] } {
  if (!patchFruitSeedName) return { plantedAt: createdAt, boostsUsed: [] };

  const fruitTime = PATCH_FRUIT_SEEDS[patchFruitSeedName].plantSeconds;
  const { seconds: boostedTime, boostsUsed } = getFruitPatchTime(
    patchFruitSeedName,
    game,
  );

  const offset = fruitTime - boostedTime;

  return { plantedAt: createdAt - offset * 1000, boostsUsed };
}

export const isBasicFruitSeed = (
  name: PatchFruitSeedName | GreenHouseFruitSeedName,
) => name === "Blueberry Seed" || name === "Orange Seed";

export const isAdvancedFruitSeed = (
  name: PatchFruitSeedName | GreenHouseFruitSeedName,
) => name === "Apple Seed" || name === "Banana Plant";

/**
 * Generic boost for all fruit types - normal + greenhouse
 */
export function getFruitTime({ game }: { game: GameState }): {
  multiplier: number;
  boostsUsed: BoostName[];
} {
  let seconds = 1;
  const boostsUsed: BoostName[] = [];

  const hasSuperTotem = isTemporaryCollectibleActive({
    name: "Super Totem",
    game,
  });
  const hasTimeWarpTotem = isTemporaryCollectibleActive({
    name: "Time Warp Totem",
    game,
  });
  if (hasSuperTotem || hasTimeWarpTotem) {
    seconds = seconds * 0.5;
    if (hasSuperTotem) boostsUsed.push("Super Totem");
    if (hasTimeWarpTotem) boostsUsed.push("Time Warp Totem");
  }

  return { multiplier: seconds, boostsUsed };
}

/**
 * Based on boosts, how long a fruit will take to grow
 */
export const getFruitPatchTime = (
  patchFruitSeedName: PatchFruitSeedName,
  game: GameState,
): { seconds: number; boostsUsed: BoostName[] } => {
  const { bumpkin } = game;
  let seconds = PATCH_FRUIT_SEEDS[patchFruitSeedName]?.plantSeconds ?? 0;

  const { multiplier: baseMultiplier, boostsUsed } = getFruitTime({ game });
  seconds *= baseMultiplier;

  // Squirrel Monkey: 50% reduction
  if (
    patchFruitSeedName === "Orange Seed" &&
    isCollectibleBuilt({ name: "Squirrel Monkey", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push("Squirrel Monkey");
  }

  // Nana: 10% reduction
  if (
    patchFruitSeedName === "Banana Plant" &&
    isCollectibleBuilt({ name: "Nana", game })
  ) {
    seconds = seconds * 0.9;
    boostsUsed.push("Nana");
  }

  // Banana Onesie: 20% reduction
  if (
    patchFruitSeedName === "Banana Plant" &&
    isWearableActive({ name: "Banana Onesie", game })
  ) {
    seconds = seconds * 0.8;
    boostsUsed.push("Banana Onesie");
  }

  // Fruit Tune Box: 20% reduction
  if (isCollectibleBuilt({ name: "Fruit Tune Box", game })) {
    seconds = seconds * 0.8;
    boostsUsed.push("Fruit Tune Box");
  }

  // Lemon Tea Bath: 50% reduction
  if (
    patchFruitSeedName === "Lemon Seed" &&
    isCollectibleBuilt({ name: "Lemon Tea Bath", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push("Lemon Tea Bath");
  }

  // Lemon Frog: 25% reduction
  if (
    patchFruitSeedName === "Lemon Seed" &&
    isCollectibleBuilt({ name: "Lemon Frog", game })
  ) {
    seconds = seconds * 0.75;
    boostsUsed.push("Lemon Frog");
  }

  // Tomato Clown: 50% reduction
  if (
    patchFruitSeedName === "Tomato Seed" &&
    isCollectibleBuilt({ name: "Tomato Clown", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push("Tomato Clown");
  }

  // Cannon
  if (
    patchFruitSeedName === "Tomato Seed" &&
    isCollectibleBuilt({ name: "Cannonball", game })
  ) {
    seconds = seconds * 0.75;
    boostsUsed.push("Cannonball");
  }

  // Catchup Skill: 10% reduction
  if (bumpkin.skills["Catchup"]) {
    seconds = seconds * 0.9;
    boostsUsed.push("Catchup");
  }

  // Long Pickings - -50% growth in Apple and Banana, but 2x in the rest
  if (bumpkin.skills["Long Pickings"]) {
    if (isAdvancedFruitSeed(patchFruitSeedName)) {
      seconds = seconds * 0.5;
    } else {
      seconds = seconds * 2;
    }
    boostsUsed.push("Long Pickings");
  }

  if (bumpkin.skills["Short Pickings"]) {
    if (isBasicFruitSeed(patchFruitSeedName)) {
      seconds = seconds * 0.5;
    } else {
      seconds = seconds * 2;
    }
    boostsUsed.push("Short Pickings");
  }

  if (isTemporaryCollectibleActive({ name: "Orchard Hourglass", game })) {
    seconds *= 0.75;
    boostsUsed.push("Orchard Hourglass");
  }

  if (isTemporaryCollectibleActive({ name: "Toucan Shrine", game })) {
    seconds *= 0.75;
    boostsUsed.push("Toucan Shrine");
  }

  return { seconds, boostsUsed };
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

    if (patch.x === undefined && patch.y === undefined) {
      throw new Error("Fruit patch is not placed");
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
      !SEASONAL_SEEDS[stateCopy.season.season].includes(action.seed) &&
      !isFullMoonBerry(action.seed)
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
    const { plantedAt, boostsUsed } = getPlantedAt(
      action.seed,
      stateCopy,
      createdAt,
    );
    patch.fruit = {
      name: fruitName,
      plantedAt,
      harvestedAt: 0,
      // Value will be overridden by BE
      harvestsLeft: harvestCount,
    };

    stateCopy.farmActivity = trackFarmActivity(
      `${action.seed} Planted`,
      stateCopy.farmActivity,
    );

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    return stateCopy;
  });
}
