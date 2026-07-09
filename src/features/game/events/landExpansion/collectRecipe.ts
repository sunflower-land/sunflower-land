import Decimal from "decimal.js-light";
import { KNOWN_IDS } from "features/game/types";
import type { BuildingName } from "features/game/types/buildings";
import { trackFarmActivity } from "features/game/types/farmActivity";

import type {
  BoostName,
  BuildingProduct,
  GameState,
} from "features/game/types/game";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import { prngChance } from "lib/prng";
import { isCookingBuilding } from "./isCookingBuilding";
import { isWearableActive } from "features/game/lib/wearables";
import { assertCookableName } from "features/game/types/consumables";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { SKILL_RANKS, getSkillLevel } from "features/game/types/bumpkinSkills";

/**
 * The Double Nom rank a recipe was cooked at, so its +food collects at the rank
 * whose ingredient cost was paid. Legacy recipes stored a boolean (`true` = the
 * old single-rank behaviour); new recipes store the numeric rank.
 */
export const getRecipeDoubleNomLevel = (recipe: BuildingProduct): number => {
  const stored = recipe.skills?.["Double Nom"];
  if (stored === true) return 1;
  return typeof stored === "number" ? stored : 0;
};

export type CollectRecipeAction = {
  type: "recipes.collected";
  building: BuildingName;
  buildingId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectRecipeAction;
  createdAt?: number;
  farmId: number;
};

export const getCookingAmount = ({
  building,
  recipe,
  farmId,
  counter,
  game,
}: {
  building: BuildingName;
  recipe: BuildingProduct;
  farmId: number;
  counter: number;
  game: GameState;
}): { amount: number; boostsUsed: { name: BoostName; value: string }[] } => {
  const recipeName = assertCookableName(recipe.name);
  let amount = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  // Double Nom - Guarantee +1/+2/+3 food (at the rank the recipe was cooked at)
  const doubleNomLevel = getRecipeDoubleNomLevel(recipe);
  if (doubleNomLevel && isCookingBuilding(building)) {
    const bonus = SKILL_RANKS["Double Nom"].food[doubleNomLevel - 1];
    amount += bonus;
    boostsUsed.push({ name: "Double Nom", value: `+${bonus}` });
  }

  // Fiery Jackpot - 20%/25%/30% chance of +1 food from Fire Pit (scales w/ rank)
  const fieryJackpotLevel = getSkillLevel(game.bumpkin.skills, "Fiery Jackpot");
  if (
    building === "Fire Pit" &&
    fieryJackpotLevel &&
    prngChance({
      farmId,
      itemId: KNOWN_IDS[recipeName],
      counter,
      chance: SKILL_RANKS["Fiery Jackpot"].ranks[fieryJackpotLevel - 1],
      criticalHitName: "Fiery Jackpot",
    })
  ) {
    amount += 1;
    boostsUsed.push({ name: "Fiery Jackpot", value: "+1" });
  }

  if (
    isWearableActive({ name: "Master Chef's Cleaver", game }) &&
    prngChance({
      farmId,
      itemId: KNOWN_IDS[recipeName],
      counter,
      chance: 10,
      criticalHitName: "Master Chef's Cleaver",
    })
  ) {
    amount += 1;
    boostsUsed.push({ name: "Master Chef's Cleaver", value: "+1" });
  }

  return { amount, boostsUsed };
};

export function collectRecipe({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (game) => {
    const { bumpkin } = game;

    const building = game.buildings[action.building]?.find(
      (b) => b.id === action.buildingId,
    );

    if (!building) {
      throw new Error(translate("error.buildingNotExist"));
    }

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const recipes = building.crafting ?? [];
    if (!recipes.length) {
      throw new Error(translate("error.buildingNotCooking"));
    }

    const nothingReady = recipes.every((recipe) => recipe.readyAt > createdAt);
    if (nothingReady) {
      throw new Error(translate("error.recipeNotReady"));
    }

    // Collect all recipes that are ready
    building.crafting = (building.crafting ?? []).reduce((acc, recipe) => {
      if (recipe.readyAt <= createdAt) {
        const cookableName = assertCookableName(recipe.name);

        const { amount, boostsUsed } = getCookingAmount({
          building: action.building,
          game,
          recipe,
          farmId,
          counter: game.farmActivity[`${cookableName} Cooked`] || 0,
        });
        const consumableCount = game.inventory[cookableName] || new Decimal(0);
        game.inventory[cookableName] = consumableCount.add(amount);

        game.farmActivity = trackFarmActivity(
          `${cookableName} Cooked`,
          game.farmActivity,
        );

        if (boostsUsed.length > 0) {
          game.boostsUsedAt = updateBoostUsed({
            game,
            boostNames: boostsUsed,
            createdAt,
          });
        }

        return acc;
      }

      return [...acc, recipe];
    }, [] as BuildingProduct[]);

    return game;
  });
}
