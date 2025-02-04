import { GameState } from "features/game/types/game";

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
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";
import { GREENHOUSE_CROP_TIME_SECONDS } from "./harvestGreenHouse";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { getCropTime, getCropYieldAmount } from "./plant";
import { getFruitYield } from "./fruitHarvested";
import { getFruitTime } from "./fruitPlanted";
import { Resource } from "features/game/lib/getBudYieldBoosts";
import { produce } from "immer";

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

export function getGreenhouseYieldAmount({
  crop,
  game,
  createdAt,
}: {
  crop: GreenHouseCropName | GreenHouseFruitName;
  game: GameState;
  createdAt: number;
}): number {
  if (isGreenhouseCrop(crop)) {
    return getCropYieldAmount({ crop, game, createdAt });
  }

  return getFruitYield({ name: crop, game });
}

type GetPlantedAtArgs = {
  crop: GreenHouseCropName | GreenHouseFruitName;
  game: GameState;
  createdAt: number;
};

function getPlantedAt({ crop, game, createdAt }: GetPlantedAtArgs): number {
  if (!crop) return 0;

  const cropTime = GREENHOUSE_CROP_TIME_SECONDS[crop];

  const boostedTime = getGreenhouseCropTime({ crop, game });

  const offset = cropTime - boostedTime;

  return createdAt - offset * 1000;
}

export const getGreenhouseCropTime = ({
  crop,
  game,
}: {
  crop: GreenHouseCropName | GreenHouseFruitName;
  game: GameState;
}) => {
  let seconds = GREENHOUSE_CROP_TIME_SECONDS[crop];

  if (isGreenhouseCrop(crop)) {
    const baseMultiplier = getCropTime({ game, crop });
    seconds *= baseMultiplier;
  } else {
    const baseMultiplier = getFruitTime({
      game,
      name: PLANT_TO_SEED[crop] as GreenHouseFruitSeedName,
    });
    seconds *= baseMultiplier;
  }

  if (game.bumpkin === undefined) return seconds;

  if (isCollectibleBuilt({ name: "Turbo Sprout", game })) {
    seconds *= 0.5;
  }

  return seconds;
};

export function getOilUsage({
  seed,
  game,
}: {
  seed: GreenhouseSeed;
  game: GameState;
}) {
  let usage = OIL_USAGE[seed];

  if (game.bumpkin.skills["Greasy Plants"]) {
    usage *= 2;
  }

  if (game.bumpkin.skills["Slick Saver"]) {
    usage -= 1;
  }

  return usage;
}

function getGreenhouseSeedUsage({ game }: { game: GameState }) {
  let seed = 1;

  if (game.bumpkin.skills["Seeded Bounty"]) {
    seed += 1;
  }

  return seed;
}

export function plantGreenhouse({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    // Requires Greenhouse exists
    if (!game.buildings.Greenhouse) {
      throw new Error("Greenhouse does not exist");
    }

    if (!game.bumpkin) {
      throw new Error("No Bumpkin");
    }

    if (!SEED_TO_PLANT[action.seed]) {
      throw new Error("Not a valid seed");
    }

    const seeds = game.inventory[action.seed] ?? new Decimal(0);
    const seedUsage = getGreenhouseSeedUsage({ game });
    if (seeds.lt(seedUsage)) {
      throw new Error(`Missing ${action.seed}`);
    }

    const oilUsage = getOilUsage({ seed: action.seed, game });

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
    // Plants
    game.greenhouse.pots[potId] = {
      plant: {
        amount: getGreenhouseYieldAmount({
          crop: plantName,
          game,
          createdAt,
        }),
        name: plantName,
        plantedAt: getPlantedAt({ createdAt, crop: plantName, game }),
      },
    };

    // Subtracts seed
    game.inventory[action.seed] = seeds.sub(seedUsage);

    // Use oil
    game.greenhouse.oil -= oilUsage;

    // Tracks Analytics
    const activityName: BumpkinActivityName = `${plantName} Planted`;

    game.bumpkin.activity = trackActivity(activityName, game.bumpkin.activity);

    return game;
  });
}
