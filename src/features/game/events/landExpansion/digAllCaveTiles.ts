import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { hasTimeBasedFeatureAccess } from "lib/flags";
import { getCaveDigAllGems, isCaveBuildingReady } from "features/game/lib/cave";
import { makeGemHistory } from "features/game/lib/getInstantGems";
import {
  CAVE_DIG_SHOVEL_COST,
  CAVE_PATCH_WIDTH,
  caveTileKey,
} from "features/game/types/caveRecipes";
import {
  isCaveSeed,
  recordCaveDig,
  resolveCaveTile,
  revealCavePatch,
} from "features/game/types/cavePatch";
import { awardCaveTile, isCaveToolKept } from "./digCaveTile";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type DigAllCaveTilesAction = {
  type: "cave.dugAll";
  machineId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: DigAllCaveTilesAction;
  createdAt?: number;
  farmId: number;
};

export enum DIG_ALL_CAVE_TILES_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NO_CAVE = "The Cave has not been built",
  NO_MACHINE = "That Myco Bin does not exist",
  NO_BATCH = "That Myco Bin has no batch",
  NOT_READY = "That patch is not ready to dig",
  NO_SEED = "That patch has no board yet",
  ALREADY_DUG = "Every tile has already been dug",
  NO_SHOVEL = "Missing Sand Shovels",
  INSUFFICIENT_GEMS = "Insufficient Gems",
}

/** The patch tiles not dug yet, in row order. */
export function getUndugCaveTileCoords(
  dug: Record<string, unknown> = {},
): { x: number; y: number }[] {
  const coords: { x: number; y: number }[] = [];
  for (let y = 0; y < CAVE_PATCH_WIDTH; y += 1) {
    for (let x = 0; x < CAVE_PATCH_WIDTH; x += 1) {
      if (!dug[caveTileKey(x, y)]) coords.push({ x, y });
    }
  }
  return coords;
}

/**
 * Dig every tile left in a Cave patch for Gems (`getCaveDigAllGems`) and one
 * Sand Shovel per tile. One board is drawn for the whole dig
 * (`revealCavePatch`, keyed on the first undug tile) and each tile awards and
 * records what that board holds, as `cave.dug` would. Sturdy Shovel rolls for
 * every tile, as it would digging them one by one.
 */
export function digAllCaveTiles({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (game) => {
    if (
      !hasTimeBasedFeatureAccess({
        featureName: "CAVE",
        game: game,
        now: createdAt,
      })
    ) {
      throw new Error(DIG_ALL_CAVE_TILES_ERRORS.NO_FEATURE_ACCESS);
    }

    const cave = game.cave;
    if (!cave || !isCaveBuildingReady(game, createdAt)) {
      throw new Error(DIG_ALL_CAVE_TILES_ERRORS.NO_CAVE);
    }

    const machine = cave.machines[action.machineId];
    if (!machine) {
      throw new Error(DIG_ALL_CAVE_TILES_ERRORS.NO_MACHINE);
    }

    const batch = machine.batch;
    if (!batch) {
      throw new Error(DIG_ALL_CAVE_TILES_ERRORS.NO_BATCH);
    }

    if (batch.readyAt > createdAt) {
      throw new Error(DIG_ALL_CAVE_TILES_ERRORS.NOT_READY);
    }

    if (!isCaveSeed(batch.seed)) {
      throw new Error(DIG_ALL_CAVE_TILES_ERRORS.NO_SEED);
    }

    const undug = getUndugCaveTileCoords(batch.dug);
    if (undug.length === 0) {
      throw new Error(DIG_ALL_CAVE_TILES_ERRORS.ALREADY_DUG);
    }

    // Enough shovels for every tile, whatever Sturdy Shovel keeps.
    const shovels = game.inventory["Sand Shovel"] ?? new Decimal(0);
    if (shovels.lt(new Decimal(CAVE_DIG_SHOVEL_COST).mul(undug.length))) {
      throw new Error(DIG_ALL_CAVE_TILES_ERRORS.NO_SHOVEL);
    }

    const gems = getCaveDigAllGems({ batch, game, now: createdAt });
    if (!game.inventory.Gem?.gte(gems)) {
      throw new Error(DIG_ALL_CAVE_TILES_ERRORS.INSUFFICIENT_GEMS);
    }
    game.inventory.Gem = game.inventory.Gem.sub(gems);
    makeGemHistory({ game, amount: gems, createdAt });

    const layout = revealCavePatch({
      batch,
      createdAt,
      x: undug[0].x,
      y: undug[0].y,
    });
    const dug = { ...batch.dug };
    for (const { x, y } of undug) {
      if (
        isCaveToolKept({
          game,
          farmId,
          tool: "Sand Shovel",
          skill: "Sturdy Shovel",
        })
      ) {
        game.boostsUsedAt = updateBoostUsed({
          game,
          boostNames: [{ name: "Sturdy Shovel", value: "Shovel kept" }],
          createdAt,
        });
      } else {
        game.inventory["Sand Shovel"] = (
          game.inventory["Sand Shovel"] ?? new Decimal(0)
        ).minus(CAVE_DIG_SHOVEL_COST);
      }

      awardCaveTile({
        game,
        tile: resolveCaveTile(layout, x, y),
        createdAt,
        farmId,
      });
      dug[caveTileKey(x, y)] = recordCaveDig(layout, x, y, createdAt);
    }

    batch.dug = dug;
  });
}
