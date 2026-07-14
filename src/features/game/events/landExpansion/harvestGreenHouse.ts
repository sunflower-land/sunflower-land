import type {
  BoostName,
  CriticalHitName,
  GameState,
} from "features/game/types/game";
import { isGreenhouseCrop, MAX_POTS } from "./plantGreenhouse";
import type { GreenHouseCropName } from "features/game/types/crops";
import type { GreenHouseFruitName } from "features/game/types/fruits";
import { isGreenhouseReady } from "./greenhouseReadiness";
import Decimal from "decimal.js-light";

import { produce } from "immer";
import { getFruitYield } from "./fruitHarvested";
import { getCropYieldAmount } from "./harvest";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import {
  type FarmActivityName,
  trackFarmActivity,
} from "features/game/types/farmActivity";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import type { GreenhouseCompostName } from "features/game/types/composters";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";

export function getGreenhouseCropYieldAmount({
  crop,
  game,
  createdAt,
  prngArgs,
  fertiliser,
}: {
  crop: GreenHouseCropName | GreenHouseFruitName;
  game: GameState;
  createdAt: number;
  prngArgs: { farmId: number; counter: number };
  fertiliser?: GreenhouseCompostName;
}): { amount: number; boostsUsed: { name: BoostName; value: string }[] } {
  let amount = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];

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
      boostsUsed.push({ name: "Olive Royalty Shirt", value: "+0.25" });
    }

    if (crop === "Olive" && isWearableActive({ name: "Olive Shield", game })) {
      amount += 1;
      boostsUsed.push({ name: "Olive Shield", value: "+1" });
    }

    // Rice
    if (crop === "Rice" && isWearableActive({ name: "Non La Hat", game })) {
      amount += 1;
      boostsUsed.push({ name: "Non La Hat", value: "+1" });
    }

    if (crop === "Rice" && isCollectibleBuilt({ name: "Rice Panda", game })) {
      amount += 0.25;
      boostsUsed.push({ name: "Rice Panda", value: "+0.25" });
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

  const greenhouseGambleLevel = getSkillLevel(skills, "Greenhouse Gamble");
  if (
    greenhouseGambleLevel &&
    criticalDrop(
      "Greenhouse Gamble",
      SKILL_RANKS["Greenhouse Gamble"].ranks[greenhouseGambleLevel - 1],
    )
  ) {
    amount += 1;
    boostsUsed.push({ name: "Greenhouse Gamble", value: "+1" });
  }

  if (isCollectibleBuilt({ name: "Pharaoh Gnome", game })) {
    amount += 2;
    boostsUsed.push({ name: "Pharaoh Gnome", value: "+2" });
  }

  const glassRoomLevel = getSkillLevel(skills, "Glass Room");
  if (glassRoomLevel) {
    const v = SKILL_RANKS["Glass Room"].ranks[glassRoomLevel - 1];
    amount += v;
    boostsUsed.push({ name: "Glass Room", value: `+${v}` });
  }

  const seededBountyLevel = getSkillLevel(skills, "Seeded Bounty");
  if (seededBountyLevel) {
    const v = SKILL_RANKS["Seeded Bounty"].ranks[seededBountyLevel - 1];
    amount += v;
    boostsUsed.push({ name: "Seeded Bounty", value: `+${v}` });
  }

  const greasyPlantsLevel = getSkillLevel(skills, "Greasy Plants");
  if (greasyPlantsLevel) {
    const v = SKILL_RANKS["Greasy Plants"].yield[greasyPlantsLevel - 1];
    amount += v;
    boostsUsed.push({ name: "Greasy Plants", value: `+${v}` });
  }

  if (fertiliser === "Greenhouse Goodie") {
    amount += 0.2;
    boostsUsed.push({ name: "Greenhouse Goodie", value: "+0.2" });
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

    if (!isGreenhouseReady(createdAt, pot, game)) {
      throw new Error("Plant is not ready");
    }

    // Harvests Crop
    const counter = game.farmActivity[`${pot.plant.name} Harvested`] ?? 0;
    const { amount: baseProduce, boostsUsed: baseBoosts } = pot.plant.amount
      ? { amount: pot.plant.amount, boostsUsed: [] }
      : getGreenhouseCropYieldAmount({
          crop: pot.plant.name,
          game,
          createdAt,
          prngArgs: { farmId, counter },
          fertiliser: pot.fertiliser?.name,
        });

    let greenhouseProduce = baseProduce;
    const boostsUsed = [...baseBoosts];
    if (
      pot.fertiliser?.name === "Greenhouse Goodie" &&
      pot.plant.amount !== undefined
    ) {
      greenhouseProduce += 0.2;
      boostsUsed.push({ name: "Greenhouse Goodie", value: "+0.2" });
    }

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

    delete pot.plant;
    delete pot.fertiliser;

    return game;
  });
}
