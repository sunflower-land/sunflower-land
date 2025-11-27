import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { isWearableActive } from "features/game/lib/wearables";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  FLOWER_CROSS_BREED_AMOUNTS,
  FLOWER_SEEDS,
  FlowerCrossBreedName,
  FLOWERS,
  FlowerSeedName,
  isFlowerSeed,
} from "features/game/types/flowers";
import { BoostName, GameState } from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { produce } from "immer";
import { SEASONAL_SEEDS } from "features/game/types/seeds";
import { getKeys } from "features/game/types/decorations";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type PlantFlowerAction = {
  type: "flower.planted";
  id: string;
  seed: FlowerSeedName;
  crossbreed: FlowerCrossBreedName;
};

type Options = {
  state: Readonly<GameState>;
  action: PlantFlowerAction;
  createdAt?: number;
};

export const getFlowerTime = (
  seed: FlowerSeedName,
  game: GameState,
): { seconds: number; boostsUsed: BoostName[] } => {
  const { bumpkin } = game;

  let seconds = FLOWER_SEEDS[seed].plantSeconds;
  const boostsUsed: BoostName[] = [];

  // If wearing Flower Crown 2x speed
  if (isWearableActive({ name: "Flower Crown", game })) {
    seconds *= 0.5;
    boostsUsed.push("Flower Crown");
  }

  if (isTemporaryCollectibleActive({ name: "Moth Shrine", game })) {
    seconds *= 0.75;
    boostsUsed.push("Moth Shrine");
  }

  // If Flower Fox is built gives 10% speed boost
  if (isCollectibleBuilt({ name: "Flower Fox", game })) {
    seconds *= 0.9;
    boostsUsed.push("Flower Fox");
  }

  if (isTemporaryCollectibleActive({ name: "Blossom Hourglass", game })) {
    seconds *= 0.75;
    boostsUsed.push("Blossom Hourglass");
  }

  if (bumpkin.skills["Blooming Boost"]) {
    seconds *= 0.9;
    boostsUsed.push("Blooming Boost");
  }

  if (bumpkin.skills["Flower Power"]) {
    seconds *= 0.8;
  }

  if (bumpkin.skills["Flowery Abode"]) {
    seconds *= 1.5;
    boostsUsed.push("Flowery Abode");
  }

  return { seconds, boostsUsed };
};

type GetPlantedAtArgs = {
  seed: FlowerSeedName;
  createdAt: number;
  boostedTime: number;
};

/**
 * Set a plantedAt in the past to make a flower grow faster
 */
export function getPlantedAt({
  seed,
  createdAt,
  boostedTime,
}: GetPlantedAtArgs): number {
  const flowerTime = FLOWER_SEEDS[seed].plantSeconds;

  const offset = flowerTime - boostedTime;

  return createdAt - offset * 1000;
}

export function plantFlower({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { flowers, bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const flowerBed = flowers.flowerBeds[action.id];

    if (!flowerBed) {
      throw new Error(translate("harvestflower.noFlowerBed"));
    }

    if (flowerBed.x === undefined && flowerBed.y === undefined) {
      throw new Error("Flower bed is not placed");
    }

    if (flowerBed.flower?.plantedAt) {
      throw new Error(translate("harvestflower.alr.plant"));
    }

    if (!isFlowerSeed(action.seed)) {
      throw new Error("Not a flower seed");
    }

    if (!SEASONAL_SEEDS[state.season.season].includes(action.seed)) {
      throw new Error(`${action.seed} is not in season`);
    }

    const seedCount = stateCopy.inventory[action.seed] ?? new Decimal(0);

    if (seedCount.lessThan(1)) {
      throw new Error("Not enough seeds");
    }

    const crossBreedCount =
      stateCopy.inventory[action.crossbreed] ?? new Decimal(0);
    const crossBreedAmount =
      FLOWER_CROSS_BREED_AMOUNTS[action.seed][action.crossbreed];

    if (!crossBreedAmount) {
      throw new Error("Not a valid crossbreed");
    }

    if (crossBreedCount.lessThan(crossBreedAmount)) {
      throw new Error("Not enough crossbreeds");
    }

    stateCopy.inventory[action.seed] = seedCount.minus(1);
    stateCopy.inventory[action.crossbreed] =
      crossBreedCount.minus(crossBreedAmount);

    const seedFlowers = getKeys(FLOWERS).filter(
      (flowerName) => FLOWERS[flowerName].seed === action.seed,
    );
    const flower = seedFlowers.find((seedFlower) =>
      (flowers.discovered[seedFlower] ?? []).includes(action.crossbreed),
    );

    const { seconds, boostsUsed } = getFlowerTime(action.seed, stateCopy);

    flowerBed.flower = {
      plantedAt: getPlantedAt({
        seed: action.seed,
        createdAt,
        boostedTime: seconds,
      }),
      name: flower ?? "Red Lotus",
      crossbreed: action.crossbreed,
      dirty: !flower,
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

    const updatedBeehives = updateBeehives({
      game: stateCopy,
      createdAt,
    });

    stateCopy.beehives = updatedBeehives;

    return stateCopy;
  });
}
