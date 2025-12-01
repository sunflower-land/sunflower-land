import { BoostName, GameState } from "features/game/types/game";

import {
  GREENHOUSE_CROPS,
  GreenHouseCropName,
  GreenHouseCropSeedName,
} from "features/game/types/crops";
import {
  GREENHOUSE_FRUIT,
  GreenHouseFruitName,
  GreenHouseFruitSeedName,
} from "features/game/types/fruits";
import Decimal from "decimal.js-light";

import { GREENHOUSE_CROP_TIME_SECONDS } from "./harvestGreenHouse";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { getCropTime } from "./plant";
import { getFruitTime } from "./fruitPlanted";
import { Resource } from "features/game/lib/getBudYieldBoosts";
import { produce } from "immer";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import {
  FarmActivityName,
  trackFarmActivity,
} from "features/game/types/farmActivity";

export type PlantGreenhouseAction = {
  type: "greenhouse.planted";
  seed: GreenhouseSeed;
  id: number;
};

type Options = {
  state: Readonly<GameState>;
  action: PlantGreenhouseAction;
  createdAt?: number;
};

type GreenhouseSeed = GreenHouseCropSeedName | GreenHouseFruitSeedName;
export const SEED_TO_PLANT: Record<
  GreenhouseSeed,
  GreenHouseCropName | GreenHouseFruitName
> = {
  "Grape Seed": "Grape",
  "Olive Seed": "Olive",
  "Rice Seed": "Rice",
};

export const PLANT_TO_SEED: Record<
  GreenHouseCropName | GreenHouseFruitName,
  GreenhouseSeed
> = {
  Grape: "Grape Seed",
  Olive: "Olive Seed",
  Rice: "Rice Seed",
};

export const OIL_USAGE: Record<GreenhouseSeed, number> = {
  "Grape Seed": 3,
  "Rice Seed": 4,
  "Olive Seed": 6,
};

export const MAX_POTS = 4;

export function isGreenhouseCrop(plant: Resource): plant is GreenHouseCropName {
  return (plant as GreenHouseCropName) in GREENHOUSE_CROPS;
}

export function isGreenhouseFruit(
  fruit: Resource,
): fruit is GreenHouseFruitName {
  return (fruit as GreenHouseFruitName) in GREENHOUSE_FRUIT;
}

type GetPlantedAtArgs = {
  crop: GreenHouseCropName | GreenHouseFruitName;
  game: GameState;
  createdAt: number;
};

function getPlantedAt({ crop, game, createdAt }: GetPlantedAtArgs): {
  plantedAt: number;
  boostsUsed: BoostName[];
} {
  if (!crop) return { plantedAt: 0, boostsUsed: [] };

  const cropTime = GREENHOUSE_CROP_TIME_SECONDS[crop];

  const { seconds: boostedTime, boostsUsed } = getGreenhouseCropTime({
    crop,
    game,
  });

  const offset = cropTime - boostedTime;

  return { plantedAt: createdAt - offset * 1000, boostsUsed };
}

export const getGreenhouseCropTime = ({
  crop,
  game,
}: {
  crop: GreenHouseCropName | GreenHouseFruitName;
  game: GameState;
}): { seconds: number; boostsUsed: BoostName[] } => {
  let seconds = GREENHOUSE_CROP_TIME_SECONDS[crop];
  const boostsUsed: BoostName[] = [];
  if (isGreenhouseCrop(crop)) {
    const { multiplier: baseMultiplier, boostsUsed: cropBoostsUsed } =
      getCropTime({
        game,
        crop,
      });
    seconds *= baseMultiplier;
    boostsUsed.push(...cropBoostsUsed);
  } else {
    const { multiplier: baseMultiplier, boostsUsed: fruitBoostsUsed } =
      getFruitTime({ game });
    seconds *= baseMultiplier;
    boostsUsed.push(...fruitBoostsUsed);
  }

  if (isCollectibleBuilt({ name: "Turbo Sprout", game })) {
    seconds *= 0.5;
    boostsUsed.push("Turbo Sprout");
  }

  if (isTemporaryCollectibleActive({ name: "Tortoise Shrine", game })) {
    seconds *= 2 / 3; // -33% growth time
    boostsUsed.push("Tortoise Shrine");
  }

  if (game.bumpkin.skills["Rice and Shine"]) {
    seconds *= 0.95;
    boostsUsed.push("Rice and Shine");
  }

  // Olive Express: 10% reduction
  if (crop === "Olive" && game.bumpkin.skills["Olive Express"]) {
    seconds *= 0.9;
    boostsUsed.push("Olive Express");
  }

  // Rice Rocket: 10% reduction
  if (crop === "Rice" && game.bumpkin.skills["Rice Rocket"]) {
    seconds *= 0.9;
    boostsUsed.push("Rice Rocket");
  }

  // Vine Velocity: 10% reduction
  if (crop === "Grape" && game.bumpkin.skills["Vine Velocity"]) {
    seconds *= 0.9;
    boostsUsed.push("Vine Velocity");
  }

  return { seconds, boostsUsed };
};

export function getOilUsage({
  seed,
  game,
}: {
  seed: GreenhouseSeed;
  game: GameState;
}): { usage: number; boostsUsed: BoostName[] } {
  let usage = OIL_USAGE[seed];
  const boostsUsed: BoostName[] = [];

  if (game.bumpkin.skills["Greasy Plants"]) {
    usage *= 2;
    boostsUsed.push("Greasy Plants");
  }

  if (game.bumpkin.skills["Slick Saver"]) {
    usage -= 1;
    boostsUsed.push("Slick Saver");
  }

  return { usage, boostsUsed };
}

function getGreenhouseSeedUsage({ game }: { game: GameState }): {
  seedCost: number;
  boostsUsed: BoostName[];
} {
  let seed = 1;
  const boostsUsed: BoostName[] = [];

  if (game.bumpkin.skills["Seeded Bounty"]) {
    seed += 1;
    boostsUsed.push("Seeded Bounty");
  }

  return { seedCost: seed, boostsUsed };
}

export function plantGreenhouse({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    // Requires Greenhouse exists
    if (
      !game.buildings.Greenhouse?.some((building) => !!building.coordinates)
    ) {
      throw new Error("Greenhouse does not exist");
    }

    if (!game.bumpkin) {
      throw new Error("No Bumpkin");
    }

    if (!SEED_TO_PLANT[action.seed]) {
      throw new Error("Not a valid seed");
    }

    const seeds = game.inventory[action.seed] ?? new Decimal(0);
    const { seedCost: seedUsage, boostsUsed: seedBoostsUsed } =
      getGreenhouseSeedUsage({ game });
    if (seeds.lt(seedUsage)) {
      throw new Error(`Missing ${action.seed}`);
    }

    const { usage: oilUsage, boostsUsed: oilBoostsUsed } = getOilUsage({
      seed: action.seed,
      game,
    });

    if (game.greenhouse.oil < oilUsage) {
      throw new Error("Not enough Oil");
    }

    const potId = action.id;
    if (!Number.isInteger(potId) || potId <= 0 || potId > MAX_POTS) {
      throw new Error("Not a valid pot");
    }

    const pot = game.greenhouse.pots[potId] ?? {};

    if (pot.plant) {
      throw new Error("Plant already exists");
    }

    const plantName = SEED_TO_PLANT[action.seed];
    const { plantedAt, boostsUsed } = getPlantedAt({
      createdAt,
      crop: plantName,
      game,
    });
    // Plants
    game.greenhouse.pots[potId] = {
      plant: {
        name: plantName,
        plantedAt,
      },
    };

    // Subtracts seed
    game.inventory[action.seed] = seeds.sub(seedUsage);

    // Use oil
    game.greenhouse.oil -= oilUsage;

    // Tracks Analytics
    const activityName: FarmActivityName = `${plantName} Planted`;

    game.farmActivity = trackFarmActivity(activityName, game.farmActivity);

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: [...boostsUsed, ...oilBoostsUsed, ...seedBoostsUsed],
      createdAt,
    });

    return game;
  });
}
