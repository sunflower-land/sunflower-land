import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import {
  CAVE_DIG_SHOVEL_COST,
  caveTileKey,
  isCaveTileInPatch,
} from "features/game/types/caveRecipes";
import {
  generateCavePatch,
  resolveCaveTile,
} from "features/game/types/cavePatch";

export type DigCaveTileAction = {
  type: "cave.dug";
  machineId: string;
  x: number;
  y: number;
};

type Options = {
  state: Readonly<GameState>;
  action: DigCaveTileAction;
  createdAt?: number;
};

export enum DIG_CAVE_TILE_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NO_CAVE = "The Cave has not been built",
  NO_MACHINE = "That Myco-Composter does not exist",
  NO_BATCH = "That Myco-Composter has no batch",
  NOT_READY = "That patch is not ready to dig",
  NO_SEED = "That patch has no board yet",
  INVALID_TILE = "That tile is not in the patch",
  ALREADY_DUG = "That tile has already been dug",
  NO_SHOVEL = "Missing Sand Shovel",
}

/**
 * Dig one Cave patch tile with a Sand Shovel. The tile's reward comes from the
 * batch's board (`generateCavePatch`), so the FE and BE award the same thing.
 */
export function digCaveTile({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "CAVE")) {
      throw new Error(DIG_CAVE_TILE_ERRORS.NO_FEATURE_ACCESS);
    }

    const cave = game.cave;
    if (!cave) {
      throw new Error(DIG_CAVE_TILE_ERRORS.NO_CAVE);
    }

    const machine = cave.machines[action.machineId];
    if (!machine) {
      throw new Error(DIG_CAVE_TILE_ERRORS.NO_MACHINE);
    }

    const batch = machine.batch;
    if (!batch) {
      throw new Error(DIG_CAVE_TILE_ERRORS.NO_BATCH);
    }

    if (batch.readyAt > createdAt) {
      throw new Error(DIG_CAVE_TILE_ERRORS.NOT_READY);
    }

    if (batch.seed === undefined) {
      throw new Error(DIG_CAVE_TILE_ERRORS.NO_SEED);
    }

    const { x, y } = action;
    if (!isCaveTileInPatch(x, y)) {
      throw new Error(DIG_CAVE_TILE_ERRORS.INVALID_TILE);
    }

    const key = caveTileKey(x, y);
    if (batch.dug?.[key]) {
      throw new Error(DIG_CAVE_TILE_ERRORS.ALREADY_DUG);
    }

    const shovels = game.inventory["Sand Shovel"] ?? new Decimal(0);
    if (shovels.lt(CAVE_DIG_SHOVEL_COST)) {
      throw new Error(DIG_CAVE_TILE_ERRORS.NO_SHOVEL);
    }

    game.inventory["Sand Shovel"] = shovels.minus(CAVE_DIG_SHOVEL_COST);

    const layout = generateCavePatch({
      recipe: batch.recipe,
      seed: batch.seed,
    });
    const { items } = resolveCaveTile(layout, x, y, createdAt);
    for (const [name, amount] of Object.entries(items)) {
      const item = name as InventoryItemName;
      game.inventory[item] = (game.inventory[item] ?? new Decimal(0)).add(
        amount ?? 0,
      );
    }

    batch.dug = { ...batch.dug, [key]: { dugAt: createdAt } };
  });
}
