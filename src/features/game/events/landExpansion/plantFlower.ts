import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { isWearableActive } from "features/game/lib/wearables";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  FLOWER_CROSS_BREED_AMOUNTS,
  FLOWER_SEEDS,
  FlowerCrossBreedName,
  FlowerSeedName,
  isFlowerSeed,
} from "features/game/types/flowers";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

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

export const getFlowerTime = (seed: FlowerSeedName, game: GameState) => {
  let seconds = FLOWER_SEEDS()[seed].plantSeconds;

  // If wearing Flower Crown 2x speed
  if (isWearableActive({ name: "Flower Crown", game })) {
    seconds *= 0.5;
  }

  return seconds;
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
  const flowerTime = FLOWER_SEEDS()[seed].plantSeconds;

  const offset = flowerTime - boostedTime;

  return createdAt - offset * 1000;
}

export function plantFlower({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy: GameState = cloneDeep(state);
  const { flowers, bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const flowerBed = flowers.flowerBeds[action.id];

  if (!flowerBed) {
    throw new Error("Flower bed does not exist");
  }

  if (flowerBed.flower?.plantedAt) {
    throw new Error("Flower is already planted");
  }

  if (!isFlowerSeed(action.seed)) {
    throw new Error("Not a flower seed");
  }

  const seedCount = stateCopy.inventory[action.seed] ?? new Decimal(0);

  if (seedCount.lessThan(1)) {
    throw new Error("Not enough seeds");
  }

  const crossBreedCount =
    stateCopy.inventory[action.crossbreed] ?? new Decimal(0);
  const crossBreedAmount = FLOWER_CROSS_BREED_AMOUNTS[action.crossbreed];

  if (crossBreedCount.lessThan(crossBreedAmount)) {
    throw new Error("Not enough crossbreeds");
  }

  stateCopy.inventory[action.seed] = seedCount.minus(1);
  stateCopy.inventory[action.crossbreed] =
    crossBreedCount.minus(crossBreedAmount);

  flowerBed.flower = {
    plantedAt: getPlantedAt({
      seed: action.seed,
      createdAt,
      boostedTime: getFlowerTime(action.seed, stateCopy),
    }),
    amount: 1,
    name: "Red Pansy",
    dirty: true,
  };

  bumpkin.activity = trackActivity(
    `${action.seed} Planted`,
    bumpkin?.activity,
    new Decimal(1)
  );

  const updatedBeehives = updateBeehives({
    beehives: stateCopy.beehives,
    flowerBeds: stateCopy.flowers.flowerBeds,
    createdAt,
  });

  stateCopy.beehives = updatedBeehives;

  return stateCopy;
}
