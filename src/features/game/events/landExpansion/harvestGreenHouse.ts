import { CriticalHitName, GameState } from "features/game/types/game";
import { isGreenhouseCrop, MAX_POTS } from "./plantGreenhouse";
import {
  GREENHOUSE_CROPS,
  GreenHouseCropName,
} from "features/game/types/crops";
import {
  GREENHOUSE_FRUIT_SEEDS,
  GreenHouseFruitName,
} from "features/game/types/fruits";
import Decimal from "decimal.js-light";
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";
import { produce } from "immer";
import { getFruitYield } from "./fruitHarvested";
import { getCropYieldAmount } from "./plant";

export const GREENHOUSE_CROP_TIME_SECONDS: Record<
  GreenHouseCropName | GreenHouseFruitName,
  number
> = {
  Grape: GREENHOUSE_FRUIT_SEEDS["Grape Seed"].plantSeconds,
  Olive: GREENHOUSE_CROPS.Olive.harvestSeconds,
  Rice: GREENHOUSE_CROPS.Rice.harvestSeconds,
};

export function getReadyAt({
  plant,
  createdAt = Date.now(),
}: {
  plant: GreenHouseCropName | GreenHouseFruitName;
  createdAt?: number;
}) {
  const seconds = GREENHOUSE_CROP_TIME_SECONDS[plant];

  return createdAt + seconds * 1000;
}

export function getGreenhouseCropYieldAmount({
  crop,
  game,
  createdAt,
  criticalDrop = () => false,
}: {
  crop: GreenHouseCropName | GreenHouseFruitName;
  game: GameState;
  createdAt: number;
  criticalDrop?: (name: CriticalHitName) => boolean;
}): number {
  if (isGreenhouseCrop(crop)) {
    const { amount } = getCropYieldAmount({
      crop,
      game,
      criticalDrop,
      createdAt,
    });
    return amount;
  }

  return getFruitYield({ name: crop, game, criticalDrop });
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
  return produce(state, (game) => {
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
      getReadyAt({ plant: pot.plant.name, createdAt: pot.plant.plantedAt })
    ) {
      throw new Error("Plant is not ready");
    }

    // Harvests Crop
    const greenhouseProduce =
      pot.plant.amount ??
      getGreenhouseCropYieldAmount({
        crop: pot.plant.name,
        game,
        createdAt,
        criticalDrop: (name) => !!(pot.plant?.criticalHit?.[name] ?? 0),
      });

    const previousAmount = game.inventory[pot.plant.name] ?? new Decimal(0);
    game.inventory[pot.plant.name] = previousAmount.add(greenhouseProduce);

    // Tracks Analytics
    const activityName: BumpkinActivityName = `${pot.plant.name} Harvested`;

    game.bumpkin.activity = trackActivity(activityName, game.bumpkin.activity);

    // Clears Pot
    delete pot.plant;

    return game;
  });
}
