import { produce } from "immer";
import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "../../types/game";
import { CHUM_AMOUNTS, Chum } from "../../types/fishing";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getBumpkinLevel } from "features/game/lib/level";
import { WaterTrapName, WATER_TRAP } from "features/game/types/crustaceans";

export type PlaceWaterTrapAction = {
  trapId: string;
  type: "waterTrap.placed";
  waterTrap: WaterTrapName;
  chum?: InventoryItemName;
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

    const requiredLevel = WATER_TRAP[action.waterTrap].requiredBumpkinLevel;
    const bumpkinLevel = getBumpkinLevel(bumpkin?.experience ?? 0);
    if (bumpkinLevel < requiredLevel) {
      throw new Error(`Requires level ${requiredLevel}`);
    }

    const trapSpots = game.fishing.trapSpots || {};
    if (!trapSpots[action.trapId]) {
      throw new Error(`Water trap spot ${action.trapId} does not exist`);
    }

    if (trapSpots[action.trapId]?.waterTrap) {
      throw new Error("Water trap spot already occupied");
    }

    if (!action.chum) {
      throw new Error("Chum is required");
    }

    // TODO: Build out crustaceans chum system
    const chumAmount = CHUM_AMOUNTS[action.chum as Chum] ?? 0;
    if (!chumAmount) {
      throw new Error(`${action.chum} is not a supported chum`);
    }

    const inventoryChum = game.inventory[action.chum] ?? new Decimal(0);
    if (inventoryChum.lt(chumAmount)) {
      throw new Error(`Insufficient Chum: ${action.chum}`);
    }

    game.inventory[action.chum] = inventoryChum.sub(chumAmount);

    const hours = WATER_TRAP[action.waterTrap].readyTimeHours;
    const readyAt = createdAt + hours * 60 * 60 * 1000;

    if (!game.fishing.trapSpots) {
      game.fishing.trapSpots = {};
    }

    game.fishing.trapSpots[action.trapId].waterTrap = {
      type: action.waterTrap,
      placedAt: createdAt,
      chum: action.chum,
      readyAt,
    };

    game.inventory[action.waterTrap] = potCount.sub(1);

    game.farmActivity = trackFarmActivity(
      `${action.waterTrap} Placed`,
      game.farmActivity,
    );
  });
}
