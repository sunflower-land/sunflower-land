import {
  BoostName,
  CriticalHitName,
  GameState,
} from "features/game/types/game";
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

import { produce } from "immer";
import { getFruitYield } from "./fruitHarvested";
import { getCropYieldAmount } from "./harvest";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import {
  FarmActivityName,
  trackFarmActivity,
} from "features/game/types/farmActivity";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";

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
  prngArgs,
}: {
  crop: GreenHouseCropName | GreenHouseFruitName;
  game: GameState;
  createdAt: number;
  prngArgs: { farmId: number; counter: number };
}): { amount: number; boostsUsed: BoostName[] } {
  let amount = 1;
  const boostsUsed: BoostName[] = [];

  if (isGreenhouseCrop(crop)) {
    const { amount: cropAmount, boostsUsed: cropBoostsUsed } =
      getCropYieldAmount({
        crop,
        game,
        createdAt,
        prngArgs,
      });
    amount = cropAmount;
    boostsUsed.push(...cropBoostsUsed);

    if (
      crop === "Olive" &&
      isWearableActive({ game, name: "Olive Royalty Shirt" })
    ) {
      amount += 0.25;
      boostsUsed.push("Olive Royalty Shirt");
    }

    if (crop === "Olive" && isWearableActive({ name: "Olive Shield", game })) {
      amount += 1;
      boostsUsed.push("Olive Shield");
    }

    // Rice
    if (crop === "Rice" && isWearableActive({ name: "Non La Hat", game })) {
      amount += 1;
      boostsUsed.push("Non La Hat");
    }

    if (crop === "Rice" && isCollectibleBuilt({ name: "Rice Panda", game })) {
      amount += 0.25;
      boostsUsed.push("Rice Panda");
    }
  } else {
    const { amount: fruitAmount, boostsUsed: fruitBoostsUsed } = getFruitYield({
      name: crop,
      game,
      prngArgs,
    });
    amount = fruitAmount;
    boostsUsed.push(...fruitBoostsUsed);
  }

  const itemId = KNOWN_IDS[crop];
  const criticalDrop = (criticalHitName: CriticalHitName, chance: number) =>
    prngChance({ ...prngArgs, itemId, chance, criticalHitName });

  const {
    bumpkin: { skills },
  } = game;

  if (skills["Greenhouse Gamble"] && criticalDrop("Greenhouse Gamble", 25)) {
    amount += 1;
    boostsUsed.push("Greenhouse Gamble");
  }

  if (isCollectibleBuilt({ name: "Pharaoh Gnome", game })) {
    amount += 2;
    boostsUsed.push("Pharaoh Gnome");
  }

  if (skills["Glass Room"]) {
    amount += 0.1;
    boostsUsed.push("Glass Room");
  }

  if (skills["Seeded Bounty"]) {
    amount += 0.5;
    boostsUsed.push("Seeded Bounty");
  }

  if (skills["Greasy Plants"]) {
    amount += 1;
    boostsUsed.push("Greasy Plants");
  }

  return { amount, boostsUsed };
}

export type HarvestGreenhouseAction = {
  type: "greenhouse.harvested";
  id: number;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestGreenhouseAction;
  createdAt?: number;
  farmId: number;
};

export function harvestGreenHouse({
  state,
  action,
  createdAt = Date.now(),
  farmId,
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
    const counter = game.farmActivity[`${pot.plant.name} Harvested`] ?? 0;
    const { amount: greenhouseProduce, boostsUsed } = pot.plant.amount
      ? { amount: pot.plant.amount, boostsUsed: [] }
      : getGreenhouseCropYieldAmount({
          crop: pot.plant.name,
          game,
          createdAt,
          prngArgs: { farmId, counter },
        });

    const previousAmount = game.inventory[pot.plant.name] ?? new Decimal(0);
    game.inventory[pot.plant.name] = previousAmount.add(greenhouseProduce);

    // Tracks Analytics
    const activityName: FarmActivityName = `${pot.plant.name} Harvested`;

    game.farmActivity = trackFarmActivity(activityName, game.farmActivity);

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: boostsUsed,
      createdAt,
    });

    // Clears Pot
    delete pot.plant;

    return game;
  });
}
