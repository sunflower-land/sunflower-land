import Decimal from "decimal.js-light";
import { produce } from "immer";
import type {
  BoostName,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { isCaveBuildingReady } from "features/game/lib/cave";
import {
  CAVE_DIG_SHOVEL_COST,
  caveTileKey,
  isCaveTileInPatch,
} from "features/game/types/caveRecipes";
import {
  generateCavePatch,
  isCaveSeed,
  type ResolvedCaveTile,
  resolveCaveTile,
} from "features/game/types/cavePatch";
import type { MushroomName } from "features/game/types/resources";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getMushroomYield } from "features/game/lib/mushrooms";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";
import type { BeetleName } from "features/game/types/beetles";
import type { TreasureToolName } from "features/game/types/tools";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";

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
  farmId: number;
};

export enum DIG_CAVE_TILE_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NO_CAVE = "The Cave has not been built",
  NO_MACHINE = "That Myco Bin does not exist",
  NO_BATCH = "That Myco Bin has no batch",
  NOT_READY = "That patch is not ready to dig",
  NO_SEED = "That patch has no board yet",
  INVALID_TILE = "That tile is not in the patch",
  ALREADY_DUG = "That tile has already been dug",
  NO_SHOVEL = "Missing Sand Shovel",
}

type BoostsUsed = { name: BoostName; value: string }[];

/**
 * Mushrooms from one Cave Mushroom tile: the same yield as picking that
 * mushroom on the island (a Magic Mushroom gets the Bud boost only), plus
 * Fungal Harvest, which boosts Wild and Magic Cave Mushrooms alike.
 */
export function getCaveMushroomYield({
  name,
  game,
}: {
  name: MushroomName;
  game: GameState;
}): { amount: number; boostsUsed: BoostsUsed } {
  const { amount, boostsUsed } = getMushroomYield({ name, game });

  const level = getSkillLevel(game.bumpkin.skills, "Fungal Harvest");
  if (!level) return { amount, boostsUsed };

  const bonus = SKILL_RANKS["Fungal Harvest"].ranks[level - 1];
  return {
    amount: new Decimal(amount).add(bonus).toNumber(),
    boostsUsed: [...boostsUsed, { name: "Fungal Harvest", value: `+${bonus}` }],
  };
}

/** Mud from one Cave Mud tile (its board amount), raised by Muddy Bounty. */
function getCaveMudYield({
  amount,
  game,
}: {
  amount: number;
  game: GameState;
}): { amount: number; boostsUsed: BoostsUsed } {
  const level = getSkillLevel(game.bumpkin.skills, "Muddy Bounty");
  if (!level) return { amount, boostsUsed: [] };

  const bonus = SKILL_RANKS["Muddy Bounty"].ranks[level - 1];
  return {
    amount: new Decimal(bonus).add(1).mul(amount).toNumber(),
    boostsUsed: [
      {
        name: "Muddy Bounty",
        value: `+${new Decimal(bonus).mul(100).toNumber()}%`,
      },
    ],
  };
}

/** Cave tiles dug so far: the counter every Cave chance skill rolls on. */
function getCaveTilesDug(game: GameState): number {
  return game.farmActivity["Cave Tile Dug"] ?? 0;
}

/**
 * Whether Sturdy Shovel / Sturdy Drill keeps the tool this dig would use. Rolls
 * once per tool use, on the number of Cave tiles dug before it.
 */
export function isCaveToolKept({
  game,
  farmId,
  tool,
  skill,
}: {
  game: GameState;
  farmId: number;
  tool: TreasureToolName;
  skill: "Sturdy Shovel" | "Sturdy Drill";
}): boolean {
  const level = getSkillLevel(game.bumpkin.skills, skill);
  if (!level) return false;

  return prngChance({
    farmId,
    itemId: KNOWN_IDS[tool],
    counter: getCaveTilesDug(game),
    chance: SKILL_RANKS[skill].ranks[level - 1],
    criticalHitName: skill,
  });
}

/**
 * Adds a dug tile's reward to the inventory and counts the tile as dug. Yields
 * are worked out at dig time, so boosts apply to patches already growing.
 */
export function awardCaveTile({
  game,
  tile,
  createdAt,
  farmId,
}: {
  game: GameState;
  tile: ResolvedCaveTile;
  createdAt: number;
  farmId: number;
}) {
  let { items } = tile;
  let boostsUsed: BoostsUsed = [];
  // A tile awards exactly one kind of item.
  const [name] = Object.keys(items) as InventoryItemName[];

  if (tile.type === "Mushroom") {
    const mushroom = getCaveMushroomYield({
      name: name as MushroomName,
      game,
    });
    items = { [name]: mushroom.amount };
    boostsUsed = mushroom.boostsUsed;
  }

  if (tile.type === "Mud") {
    const mud = getCaveMudYield({ amount: items[name] ?? 0, game });
    items = { [name]: mud.amount };
    boostsUsed = mud.boostsUsed;
  }

  const twinBeetlesLevel = getSkillLevel(game.bumpkin.skills, "Twin Beetles");
  if (
    tile.type === "Beetle" &&
    twinBeetlesLevel &&
    prngChance({
      farmId,
      itemId: KNOWN_IDS[name as BeetleName],
      counter: getCaveTilesDug(game),
      chance: SKILL_RANKS["Twin Beetles"].ranks[twinBeetlesLevel - 1],
      criticalHitName: "Twin Beetles",
    })
  ) {
    items = { [name]: (items[name] ?? 0) + 1 };
    boostsUsed = [{ name: "Twin Beetles", value: "+1" }];
  }

  game.boostsUsedAt = updateBoostUsed({
    game,
    boostNames: boostsUsed,
    createdAt,
  });

  for (const [item, amount] of Object.entries(items)) {
    const itemName = item as InventoryItemName;
    game.inventory[itemName] = (game.inventory[itemName] ?? new Decimal(0)).add(
      amount ?? 0,
    );
  }

  game.farmActivity = trackFarmActivity("Cave Tile Dug", game.farmActivity);
}

/**
 * Dig one Cave patch tile with a Sand Shovel. The tile's reward comes from the
 * batch's board (`generateCavePatch`), so the FE and BE award the same thing.
 */
export function digCaveTile({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "CAVE")) {
      throw new Error(DIG_CAVE_TILE_ERRORS.NO_FEATURE_ACCESS);
    }

    const cave = game.cave;
    if (!cave || !isCaveBuildingReady(game, createdAt)) {
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

    if (!isCaveSeed(batch.seed)) {
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

    // Sturdy Shovel may keep the shovel; the player still needs one to dig.
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
      game.inventory["Sand Shovel"] = shovels.minus(CAVE_DIG_SHOVEL_COST);
    }

    const layout = generateCavePatch({
      recipe: batch.recipe,
      seed: batch.seed,
      skills: batch.skills,
    });
    awardCaveTile({
      game,
      tile: resolveCaveTile(layout, x, y),
      createdAt,
      farmId,
    });

    batch.dug = { ...batch.dug, [key]: { dugAt: createdAt } };
  });
}
