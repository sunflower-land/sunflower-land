import type { BoostName, GameState } from "features/game/types/game";
import type { GreenhouseCompostName } from "features/game/types/composters";

import {
  GREENHOUSE_CROPS,
  type GreenHouseCropName,
  type GreenHouseCropSeedName,
} from "features/game/types/crops";
import {
  GREENHOUSE_FRUIT,
  type GreenHouseFruitName,
  type GreenHouseFruitSeedName,
} from "features/game/types/fruits";
import Decimal from "decimal.js-light";

import { GREENHOUSE_CROP_TIME_SECONDS } from "features/game/lib/greenhouseGrowTimes";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { getCropTime } from "./plant";
import { getFruitTime } from "./fruitPlanted";
import { hasFeatureAccess } from "lib/flags";
import type { Resource } from "features/game/lib/getBudYieldBoosts";
import { produce } from "immer";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import {
  type FarmActivityName,
  trackFarmActivity,
} from "features/game/types/farmActivity";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";

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
  greenhouseFertiliser?: GreenhouseCompostName;
};

function getPlantedAt({
  crop,
  game,
  createdAt,
  greenhouseFertiliser,
}: GetPlantedAtArgs): {
  plantedAt: number;
  baseDurationMs?: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  if (!crop) return { plantedAt: 0, boostsUsed: [] };

  const cropTime = GREENHOUSE_CROP_TIME_SECONDS[crop];

  const { seconds: boostedTime, boostsUsed } = getGreenhouseCropTime({
    crop,
    game,
    greenhouseFertiliser,
  });

  if (hasFeatureAccess(game, "SPEED_BOOSTS")) {
    // Speed-rate model: keep the real plant time and store the grow duration
    // with only permanent boosts folded in (getGreenhouseCropTime excludes the
    // temporary ones under the flag); the temporary boosts — totems, Harvest
    // Hourglass, Tortoise Shrine, Greenhouse Glow — apply live as speed
    // windows over the grow instead (see getGreenhouseReadyAt).
    return {
      plantedAt: createdAt,
      baseDurationMs: boostedTime * 1000,
      boostsUsed,
    };
  }

  const offset = cropTime - boostedTime;

  return { plantedAt: createdAt - offset * 1000, boostsUsed };
}

export const getGreenhouseCropTime = ({
  crop,
  game,
  greenhouseFertiliser,
}: {
  crop: GreenHouseCropName | GreenHouseFruitName;
  game: GameState;
  greenhouseFertiliser?: GreenhouseCompostName;
}): { seconds: number; boostsUsed: { name: BoostName; value: string }[] } => {
  let seconds = GREENHOUSE_CROP_TIME_SECONDS[crop];
  const boostsUsed: { name: BoostName; value: string }[] = [];

  // Under SPEED_BOOSTS the temporary boosts — totems + Harvest Hourglass
  // (excluded inside getCropTime/getFruitTime), Tortoise Shrine and Greenhouse
  // Glow (gated below) — are windowed speed boosts derived live over the grow
  // (see getGreenhouseBoostWindows / getGreenhouseGlowWindows), so they're
  // excluded from the baked time AND from boostsUsed here; only permanent
  // boosts stay baked. Flag off keeps the legacy discount-at-start.
  const windowed = hasFeatureAccess(game, "SPEED_BOOSTS");

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

  if (
    !windowed &&
    isTemporaryCollectibleActive({ name: "Tortoise Shrine", game })
  ) {
    seconds *= 2 / 3; // -33% growth time
    boostsUsed.push({ name: "Tortoise Shrine", value: "x0.67" });
  }

  const { skills } = game.bumpkin;

  const riceAndShineLevel = getSkillLevel(skills, "Rice and Shine");
  if (riceAndShineLevel) {
    const m = SKILL_RANKS["Rice and Shine"].ranks[riceAndShineLevel - 1];
    seconds *= m;
    boostsUsed.push({ name: "Rice and Shine", value: `x${m}` });
  }

  // Olive Express: Olive growth-time reduction
  const oliveExpressLevel = getSkillLevel(skills, "Olive Express");
  if (crop === "Olive" && oliveExpressLevel) {
    const m = SKILL_RANKS["Olive Express"].ranks[oliveExpressLevel - 1];
    seconds *= m;
    boostsUsed.push({ name: "Olive Express", value: `x${m}` });
  }

  // Rice Rocket: Rice growth-time reduction
  const riceRocketLevel = getSkillLevel(skills, "Rice Rocket");
  if (crop === "Rice" && riceRocketLevel) {
    const m = SKILL_RANKS["Rice Rocket"].ranks[riceRocketLevel - 1];
    seconds *= m;
    boostsUsed.push({ name: "Rice Rocket", value: `x${m}` });
  }

  // Vine Velocity: Grape growth-time reduction
  const vineVelocityLevel = getSkillLevel(skills, "Vine Velocity");
  if (crop === "Grape" && vineVelocityLevel) {
    const m = SKILL_RANKS["Vine Velocity"].ranks[vineVelocityLevel - 1];
    seconds *= m;
    boostsUsed.push({ name: "Vine Velocity", value: `x${m}` });
  }

  if (!windowed && greenhouseFertiliser === "Greenhouse Glow") {
    seconds *= 0.8;
    boostsUsed.push({ name: "Greenhouse Glow", value: "x0.8" });
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
  const { skills } = game.bumpkin;

  const greasyPlantsLevel = getSkillLevel(skills, "Greasy Plants");
  if (greasyPlantsLevel) {
    const m = SKILL_RANKS["Greasy Plants"].oilMultiplier[greasyPlantsLevel - 1];
    usage *= m;
    boostsUsed.push({ name: "Greasy Plants", value: `x${m}` });
  }

  const slickSaverLevel = getSkillLevel(skills, "Slick Saver");
  if (slickSaverLevel) {
    const v = SKILL_RANKS["Slick Saver"].ranks[slickSaverLevel - 1];
    usage -= v;
    boostsUsed.push({ name: "Slick Saver", value: `-${v}` });
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
    const { plantedAt, baseDurationMs, boostsUsed } = getPlantedAt({
      createdAt,
      crop: plantName,
      game,
      greenhouseFertiliser: pot.fertiliser?.name,
    });
    game.greenhouse.pots[potId] = {
      ...pot,
      plant: {
        name: plantName,
        plantedAt,
        ...(baseDurationMs !== undefined ? { baseDurationMs } : {}),
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
