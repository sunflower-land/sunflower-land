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
  boostsUsed: { name: BoostName; value: string }[];
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
}): { seconds: number; boostsUsed: { name: BoostName; value: string }[] } => {
  let seconds = GREENHOUSE_CROP_TIME_SECONDS[crop];
  const boostsUsed: { name: BoostName; value: string }[] = [];
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
    boostsUsed.push({ name: "Turbo Sprout", value: "x0.5" });
  }

  if (isTemporaryCollectibleActive({ name: "Tortoise Shrine", game })) {
    seconds *= 2 / 3; // -33% growth time
    boostsUsed.push({ name: "Tortoise Shrine", value: "x0.67" });
  }

  if (game.bumpkin.skills["Rice and Shine"]) {
    seconds *= 0.95;
    boostsUsed.push({ name: "Rice and Shine", value: "x0.95" });
  }

  // Olive Express: 10% reduction
  if (crop === "Olive" && game.bumpkin.skills["Olive Express"]) {
    seconds *= 0.9;
    boostsUsed.push({ name: "Olive Express", value: "x0.9" });
  }

  // Rice Rocket: 10% reduction
  if (crop === "Rice" && game.bumpkin.skills["Rice Rocket"]) {
    seconds *= 0.9;
    boostsUsed.push({ name: "Rice Rocket", value: "x0.9" });
  }

  // Vine Velocity: 10% reduction
  if (crop === "Grape" && game.bumpkin.skills["Vine Velocity"]) {
    seconds *= 0.9;
    boostsUsed.push({ name: "Vine Velocity", value: "x0.9" });
  }

  return { seconds, boostsUsed };
};

export function getOilUsage({
  seed,
  game,
}: {
  seed: GreenhouseSeed;
  game: GameState;
}): { usage: number; boostsUsed: { name: BoostName; value: string }[] } {
  let usage = OIL_USAGE[seed];
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (game.bumpkin.skills["Greasy Plants"]) {
    usage *= 2;
    boostsUsed.push({ name: "Greasy Plants", value: "x2" });
  }

  if (game.bumpkin.skills["Slick Saver"]) {
    usage -= 1;
    boostsUsed.push({ name: "Slick Saver", value: "-1" });
  }

  return { usage, boostsUsed };
}

function getGreenhouseSeedUsage({ game }: { game: GameState }): {
  seedCost: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let seed = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (game.bumpkin.skills["Seeded Bounty"]) {
    seed += 1;
    boostsUsed.push({ name: "Seeded Bounty", value: "+1" });
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
