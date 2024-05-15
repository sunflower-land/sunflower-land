import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";

import {
  GreenHouseCropName,
  GreenHouseCropSeedName,
} from "features/game/types/crops";
import {
  GreenHouseFruitName,
  GreenHouseFruitSeedName,
} from "features/game/types/fruits";
import Decimal from "decimal.js-light";
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";

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

export const MAX_POTS = 4;

export function plantGreenhouse({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

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
  if (seeds.lt(1)) {
    throw new Error(`Missing ${action.seed}`);
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
      amount: 1,
      name: plantName,
      plantedAt: createdAt,
    },
  };

  // Subtracts seed
  game.inventory[action.seed] = seeds.sub(1);

  // Tracks Analytics
  const activityName: BumpkinActivityName = `${plantName} Planted`;

  game.bumpkin.activity = trackActivity(activityName, game.bumpkin.activity);

  return game;
}
