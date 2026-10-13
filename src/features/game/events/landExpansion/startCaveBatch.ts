import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { isCaveBuildingReady } from "features/game/lib/cave";
import { getKeys } from "lib/object";
import {
  CAVE_BATCH_DURATION_MS,
  getCaveBatchIngredients,
  type CaveMudCropName,
  type CaveRecipeName,
} from "features/game/types/caveRecipes";
import { canRestartCaveBatch } from "features/game/types/cavePatch";

export type StartCaveBatchAction = {
  type: "cave.batchStarted";
  machineId: string;
  recipe: CaveRecipeName;
  /** The crop a Mud batch is fed; Mushroom and Beetle batches take none. */
  crop?: CaveMudCropName;
};

type Options = {
  state: Readonly<GameState>;
  action: StartCaveBatchAction;
  createdAt?: number;
};

export enum START_CAVE_BATCH_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NO_CAVE = "The Cave has not been built",
  NO_MACHINE = "That Myco Bin does not exist",
  BATCH_IN_PROGRESS = "That Myco Bin already has a batch",
  INVALID_CROP = "That crop cannot feed this batch",
  INSUFFICIENT_INGREDIENTS = "Not enough resources to start the batch",
}

/**
 * Start a Myco Bin batch. Mirrors the public part of the BE reducer only:
 * charge the recipe inputs and set the 12h timer. The hidden 25-tile dig layout
 * is generated and stored (encrypted) exclusively on the BE — nothing positional
 * or count-related is client state, so the FE needs no server round-trip.
 */
export function startCaveBatch({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "CAVE")) {
      throw new Error(START_CAVE_BATCH_ERRORS.NO_FEATURE_ACCESS);
    }

    const cave = game.cave;
    if (!cave || !isCaveBuildingReady(game, createdAt)) {
      throw new Error(START_CAVE_BATCH_ERRORS.NO_CAVE);
    }

    const machine = cave.machines[action.machineId];
    if (!machine) {
      throw new Error(START_CAVE_BATCH_ERRORS.NO_MACHINE);
    }

    // A running batch, or one with Beetles still buried, blocks a new one. Once
    // every Beetle is found the patch can be replaced; what is left is lost.
    if (machine.batch && !canRestartCaveBatch(machine.batch)) {
      throw new Error(START_CAVE_BATCH_ERRORS.BATCH_IN_PROGRESS);
    }

    const ingredients = getCaveBatchIngredients(action.recipe, action.crop);
    if (!ingredients) {
      throw new Error(START_CAVE_BATCH_ERRORS.INVALID_CROP);
    }

    for (const item of getKeys(ingredients)) {
      const required = ingredients[item] ?? new Decimal(0);
      const owned = game.inventory[item] ?? new Decimal(0);
      if (owned.lt(required)) {
        throw new Error(START_CAVE_BATCH_ERRORS.INSUFFICIENT_INGREDIENTS);
      }
    }
    for (const item of getKeys(ingredients)) {
      const required = ingredients[item] ?? new Decimal(0);
      const owned = game.inventory[item] ?? new Decimal(0);
      game.inventory[item] = owned.minus(required);
    }

    const startedAt = createdAt;
    machine.batch = {
      recipe: action.recipe,
      startedAt,
      readyAt: startedAt + CAVE_BATCH_DURATION_MS,
    };
  });
}
