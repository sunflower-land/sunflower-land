import { produce } from "immer";
import Decimal from "decimal.js-light";
import { BoostName, GameState } from "../../types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  WaterTrapName,
  WATER_TRAP,
  CrustaceanChum,
  CRUSTACEAN_CHUM_AMOUNTS,
  caughtCrustacean,
} from "features/game/types/crustaceans";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type PlaceWaterTrapAction = {
  trapId: string;
  type: "waterTrap.placed";
  waterTrap: WaterTrapName;
  chum?: CrustaceanChum;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceWaterTrapAction;
  createdAt?: number;
};

export function getWaterTrapMilliseconds(
  game: GameState,
  waterTrap: WaterTrapName,
) {
  const boostsUsed: { name: BoostName; value: string }[] = [];
  let time = WATER_TRAP[waterTrap].readyTimeHours * 60 * 60 * 1000;
  if (isCollectibleBuilt({ name: "Speed Trap", game })) {
    time *= 0.8;
    boostsUsed.push({ name: "Speed Trap", value: "x0.8" });
  }
  return { milliseconds: time, boostsUsed };
}

function getWaterTrapReadyAt(
  game: GameState,
  waterTrap: WaterTrapName,
  createdAt: number,
) {
  const { milliseconds, boostsUsed } = getWaterTrapMilliseconds(
    game,
    waterTrap,
  );
  return { readyAt: createdAt + milliseconds, boostsUsed };
}

export function placeWaterTrap({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { bumpkin } = game;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin");
    }

    const potCount = game.inventory[action.waterTrap] ?? new Decimal(0);
    const hasRoyalCrabPot = isCollectibleBuilt({
      name: "Royal Crab Pot",
      game,
    });
    if (!hasRoyalCrabPot && potCount.lt(1)) {
      throw new Error(`Missing ${action.waterTrap}`);
    }

    const trapSpots = game.crabTraps.trapSpots || {};
    if (!trapSpots[action.trapId]) {
      throw new Error(`Water trap spot ${action.trapId} does not exist`);
    }

    if (trapSpots[action.trapId]?.waterTrap) {
      throw new Error("Water trap spot already occupied");
    }

    if (action.chum) {
      const chumAmount = CRUSTACEAN_CHUM_AMOUNTS[action.chum] ?? 0;
      if (!chumAmount) {
        throw new Error(`${action.chum} is not a supported chum`);
      }

      const inventoryChum = game.inventory[action.chum] ?? new Decimal(0);
      if (inventoryChum.lt(chumAmount)) {
        throw new Error(`Insufficient Chum: ${action.chum}`);
      }

      game.inventory[action.chum] = inventoryChum.sub(chumAmount);
    }

    const caught = caughtCrustacean(action.waterTrap, action.chum);

    const { readyAt, boostsUsed } = getWaterTrapReadyAt(
      game,
      action.waterTrap,
      createdAt,
    );

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: boostsUsed,
      createdAt,
    });

    if (!game.crabTraps.trapSpots) {
      game.crabTraps.trapSpots = {};
    }

    game.crabTraps.trapSpots[action.trapId].waterTrap = {
      type: action.waterTrap,
      placedAt: createdAt,
      chum: action.chum,
      readyAt,
      caught,
    };

    if (!hasRoyalCrabPot) {
      game.inventory[action.waterTrap] = potCount.sub(1);
    }

    game.farmActivity = trackFarmActivity(
      `${action.waterTrap} Placed`,
      game.farmActivity,
    );
  });
}
