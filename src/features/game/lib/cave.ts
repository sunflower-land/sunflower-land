import Decimal from "decimal.js-light";
import type {
  BoostName,
  CaveBatchSkills,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import {
  CAVE_BATCH_DURATION_MS,
  CAVE_FIRST_BATCH_DURATION_MS,
  getCaveBatchIngredients,
  type CaveRecipeName,
} from "features/game/types/caveRecipes";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";
import { getObjectEntries } from "lib/object";

/**
 * Whether the Cave building is placed on the farm and has finished
 * construction. `game.cave` is created the moment the building is bought, so
 * every cave.* event checks this too - otherwise the Cave could be used
 * during its build timer, or from the chest.
 */
export function isCaveBuildingReady(
  game: Pick<GameState, "buildings">,
  now: number,
): boolean {
  return (game.buildings.Cave ?? []).some(
    (building) => (building.readyAt ?? 0) <= now && !!building.coordinates,
  );
}

type BoostsUsed = { name: BoostName; value: string }[];

/**
 * What a Myco Bin batch costs: the recipe's inputs (or the Mud crop), cut by
 * Lean Compost. `undefined` when the crop does not fit the recipe.
 */
export function getCaveBatchCost({
  game,
  recipe,
  crop,
}: {
  game: GameState;
  recipe: CaveRecipeName;
  crop?: string;
}):
  | {
      ingredients: Partial<Record<InventoryItemName, Decimal>>;
      boostsUsed: BoostsUsed;
    }
  | undefined {
  const ingredients = getCaveBatchIngredients(recipe, crop);
  if (!ingredients) return undefined;

  const level = getSkillLevel(game.bumpkin.skills, "Lean Compost");
  if (!level) return { ingredients, boostsUsed: [] };

  const multiplier = SKILL_RANKS["Lean Compost"].ranks[level - 1];
  const reduced: Partial<Record<InventoryItemName, Decimal>> = {};
  for (const [item, amount] of getObjectEntries(ingredients)) {
    reduced[item] = (amount ?? new Decimal(0)).mul(multiplier);
  }

  return {
    ingredients: reduced,
    boostsUsed: [{ name: "Lean Compost", value: `x${multiplier}` }],
  };
}

/**
 * Whether the next batch is the farm's first: no Myco Bin holds a batch and
 * nothing has been dug. A batch only leaves its bin once its Beetles are dug,
 * so a farm that has started one never passes this again.
 */
export function isFirstCaveBatch(
  game: Pick<GameState, "cave" | "farmActivity">,
): boolean {
  const machines = Object.values(game.cave?.machines ?? {});
  return (
    !machines.some((machine) => machine.batch) &&
    !game.farmActivity["Cave Tile Dug"]
  );
}

/**
 * How long a Myco Bin batch grows: 12h, shortened by Rapid Mycelium. A farm's
 * first batch takes 10 minutes and ignores the skill.
 */
export function getCaveBatchDuration(game: GameState): {
  duration: number;
  boostsUsed: BoostsUsed;
} {
  if (isFirstCaveBatch(game)) {
    return { duration: CAVE_FIRST_BATCH_DURATION_MS, boostsUsed: [] };
  }

  const level = getSkillLevel(game.bumpkin.skills, "Rapid Mycelium");
  if (!level) return { duration: CAVE_BATCH_DURATION_MS, boostsUsed: [] };

  const multiplier = SKILL_RANKS["Rapid Mycelium"].ranks[level - 1];
  return {
    duration: new Decimal(CAVE_BATCH_DURATION_MS).mul(multiplier).toNumber(),
    boostsUsed: [{ name: "Rapid Mycelium", value: `x${multiplier}` }],
  };
}

/**
 * The board-shaping Cave skills a new batch is stamped with (Mushroom Bloom,
 * Beetle Nest, Rare Breeds). `skills` is undefined when the player has none.
 */
export function getCaveBatchSkills(game: GameState): {
  skills?: CaveBatchSkills;
  boostsUsed: BoostsUsed;
} {
  const { skills: ranks } = game.bumpkin;
  const skills: CaveBatchSkills = {};
  const boostsUsed: BoostsUsed = [];

  const bloom = getSkillLevel(ranks, "Mushroom Bloom");
  if (bloom) {
    skills.extraMushroomTiles = SKILL_RANKS["Mushroom Bloom"].ranks[bloom - 1];
    boostsUsed.push({
      name: "Mushroom Bloom",
      value: `+${skills.extraMushroomTiles}`,
    });
  }

  const nest = getSkillLevel(ranks, "Beetle Nest");
  if (nest) {
    skills.extraBeetleTiles = SKILL_RANKS["Beetle Nest"].ranks[nest - 1];
    boostsUsed.push({
      name: "Beetle Nest",
      value: `+${skills.extraBeetleTiles}`,
    });
  }

  const breeds = getSkillLevel(ranks, "Rare Breeds");
  if (breeds) {
    skills.beetleRarity = { ...SKILL_RANKS["Rare Breeds"].ranks[breeds - 1] };
    boostsUsed.push({ name: "Rare Breeds", value: `Rank ${breeds}` });
  }

  return {
    skills: boostsUsed.length > 0 ? skills : undefined,
    boostsUsed,
  };
}
