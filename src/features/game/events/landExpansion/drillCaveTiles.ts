import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import {
  CAVE_DRILL_COST,
  caveTileKey,
  isCave2x2Square,
  isCaveTileInPatch,
} from "features/game/types/caveRecipes";
import {
  generateCavePatch,
  isCaveSeed,
  resolveCaveTile,
} from "features/game/types/cavePatch";

export type DrillCaveTilesAction = {
  type: "cave.drilled";
  machineId: string;
  coords: { x: number; y: number }[];
};

type Options = {
  state: Readonly<GameState>;
  action: DrillCaveTilesAction;
  createdAt?: number;
};

export enum DRILL_CAVE_TILES_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NO_CAVE = "The Cave has not been built",
  NO_MACHINE = "That Myco-Composter does not exist",
  NO_BATCH = "That Myco-Composter has no batch",
  NOT_READY = "That patch is not ready to dig",
  NO_SEED = "That patch has no board yet",
  NOT_A_SQUARE = "Those tiles are not a 2x2 square",
  INVALID_TILE = "That square is not in the patch",
  ALREADY_DUG = "Those tiles have already been dug",
  NO_DRILL = "Missing Sand Drill",
}

/**
 * Dig a 2x2 square of a Cave patch with one Sand Drill. Tiles already dug are
 * skipped (the drill is still spent); each other tile awards what the batch's
 * board holds, exactly as `cave.dug` would.
 */
export function drillCaveTiles({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "CAVE")) {
      throw new Error(DRILL_CAVE_TILES_ERRORS.NO_FEATURE_ACCESS);
    }

    const cave = game.cave;
    if (!cave) {
      throw new Error(DRILL_CAVE_TILES_ERRORS.NO_CAVE);
    }

    const machine = cave.machines[action.machineId];
    if (!machine) {
      throw new Error(DRILL_CAVE_TILES_ERRORS.NO_MACHINE);
    }

    const batch = machine.batch;
    if (!batch) {
      throw new Error(DRILL_CAVE_TILES_ERRORS.NO_BATCH);
    }

    if (batch.readyAt > createdAt) {
      throw new Error(DRILL_CAVE_TILES_ERRORS.NOT_READY);
    }

    if (!isCaveSeed(batch.seed)) {
      throw new Error(DRILL_CAVE_TILES_ERRORS.NO_SEED);
    }

    const { coords } = action;
    if (!isCave2x2Square(coords)) {
      throw new Error(DRILL_CAVE_TILES_ERRORS.NOT_A_SQUARE);
    }

    if (!coords.every(({ x, y }) => isCaveTileInPatch(x, y))) {
      throw new Error(DRILL_CAVE_TILES_ERRORS.INVALID_TILE);
    }

    const undug = coords.filter(({ x, y }) => !batch.dug?.[caveTileKey(x, y)]);
    if (undug.length === 0) {
      throw new Error(DRILL_CAVE_TILES_ERRORS.ALREADY_DUG);
    }

    const drills = game.inventory["Sand Drill"] ?? new Decimal(0);
    if (drills.lt(CAVE_DRILL_COST)) {
      throw new Error(DRILL_CAVE_TILES_ERRORS.NO_DRILL);
    }

    game.inventory["Sand Drill"] = drills.minus(CAVE_DRILL_COST);

    const layout = generateCavePatch({
      recipe: batch.recipe,
      seed: batch.seed,
    });
    const dug = { ...batch.dug };
    for (const { x, y } of undug) {
      const { items } = resolveCaveTile(layout, x, y, createdAt);
      for (const [name, amount] of Object.entries(items)) {
        const item = name as InventoryItemName;
        game.inventory[item] = (game.inventory[item] ?? new Decimal(0)).add(
          amount ?? 0,
        );
      }
      dug[caveTileKey(x, y)] = { dugAt: createdAt };
    }

    batch.dug = dug;
  });
}
