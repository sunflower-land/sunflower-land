import { produce } from "immer";
import Decimal from "decimal.js-light";
import { GameState } from "../../types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  WaterTrapName,
  WATER_TRAP,
  CrustaceanChum,
  CRUSTACEAN_CHUM_AMOUNTS,
  caughtCrustacean,
} from "features/game/types/crustaceans";

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
    if (potCount.lt(1)) {
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

    const hours = WATER_TRAP[action.waterTrap].readyTimeHours;
    const readyAt = createdAt + hours * 60 * 60 * 1000;

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

    game.inventory[action.waterTrap] = potCount.sub(1);

    game.farmActivity = trackFarmActivity(
      `${action.waterTrap} Placed`,
      game.farmActivity,
    );
  });
}
