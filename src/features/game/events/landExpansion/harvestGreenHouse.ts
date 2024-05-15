import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import { MAX_POTS, SEED_TO_PLANT } from "./plantGreenhouse";
import {
  GREENHOUSE_SEEDS,
  GreenHouseCropName,
  GreenHouseCropSeedName,
} from "features/game/types/crops";
import {
  GREENHOUSE_FRUIT_SEEDS,
  GreenHouseFruitName,
  GreenHouseFruitSeedName,
} from "features/game/types/fruits";
import { getKeys } from "features/game/types/craftables";
import Decimal from "decimal.js-light";
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";

type GreenhouseSeed = GreenHouseCropSeedName | GreenHouseFruitSeedName;

function getReadyAt({
  game,
  plant,
  createdAt = Date.now(),
}: {
  game: GameState;
  plant: GreenHouseCropName | GreenHouseFruitName;
  createdAt?: number;
}) {
  const seedName = getKeys(SEED_TO_PLANT).find(
    (seed) => SEED_TO_PLANT[seed] === plant
  ) as GreenhouseSeed;

  const seconds = {
    ...GREENHOUSE_SEEDS(),
    ...GREENHOUSE_FRUIT_SEEDS(),
  }[seedName].plantSeconds;

  return createdAt + seconds * 1000;
}

export type HarvestGreenhouseAction = {
  type: "greenhouse.harvested";
  id: number;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestGreenhouseAction;
  createdAt?: number;
};

export function harvestGreenHouse({
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

  const potId = action.id;
  if (!Number.isInteger(potId) || potId <= 0 || potId > MAX_POTS) {
    throw new Error("Pot does not exist");
  }

  const pot = game.greenhouse.pots[potId] ?? {};

  if (!pot.plant) {
    throw new Error("Plant does not exist");
  }

  if (
    createdAt <
    getReadyAt({ game, plant: pot.plant.name, createdAt: pot.plant.plantedAt })
  ) {
    throw new Error("Plant is not ready");
  }

  // Harvests Crop
  const previousAmount = game.inventory[pot.plant.name] ?? new Decimal(0);
  game.inventory[pot.plant.name] = previousAmount.add(pot.plant.amount);

  // Tracks Analytics
  const activityName: BumpkinActivityName = `${pot.plant.name} Harvested`;

  game.bumpkin.activity = trackActivity(activityName, game.bumpkin.activity);

  // Clears Pot
  delete pot.plant;

  return game;
}
