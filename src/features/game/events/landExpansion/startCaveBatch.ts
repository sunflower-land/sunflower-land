import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import {
  getCaveBatchCost,
  getCaveBatchDuration,
  getCaveBatchSkills,
  isCaveBuildingReady,
  isFirstCaveBatch,
} from "features/game/lib/cave";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getKeys } from "lib/object";
import {
  CAVE_FIRST_BATCH_RECIPE,
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
  FIRST_BATCH_MUSHROOM_ONLY = "A farm's first batch must be the Mushroom mix",
}

/**
 * Start a Myco Bin batch. Mirrors the BE reducer's public part: charge the
 * recipe inputs and set the 12h timer (both cut by Cave skills), and stamp the
 * board-shaping Cave skills onto the batch. The board itself is a seed the BE rolls
 * from server-side randomness (`CaveBatch.seed`); it reaches the client with
 * the save that follows `cave.batchStarted`, and the shared `cavePatch.ts`
 * lays the 25 tiles out from it on both sides.
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

    if (isFirstCaveBatch(game) && action.recipe !== CAVE_FIRST_BATCH_RECIPE) {
      throw new Error(START_CAVE_BATCH_ERRORS.FIRST_BATCH_MUSHROOM_ONLY);
    }

    const cost = getCaveBatchCost({
      game,
      recipe: action.recipe,
      crop: action.crop,
    });
    if (!cost) {
      throw new Error(START_CAVE_BATCH_ERRORS.INVALID_CROP);
    }
    const { ingredients } = cost;

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

    const { duration, boostsUsed: durationBoostsUsed } =
      getCaveBatchDuration(game);
    const { skills, boostsUsed: boardBoostsUsed } = getCaveBatchSkills(game);

    const startedAt = createdAt;
    machine.batch = {
      recipe: action.recipe,
      startedAt,
      readyAt: startedAt + duration,
      ...(skills && { skills }),
    };

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: [
        ...cost.boostsUsed,
        ...durationBoostsUsed,
        ...boardBoostsUsed,
      ],
      createdAt,
    });
  });
}
