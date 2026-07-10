import Decimal from "decimal.js-light";
import {
  type CookableName,
  COOKABLES,
  isInstantFishRecipe,
} from "features/game/types/consumables";
import type {
  BuildingProduct,
  GameState,
  Inventory,
  InventoryItemName,
  Skills,
} from "features/game/types/game";
import { getCookingTime } from "features/game/expansion/lib/boosts";
import { setPrecision } from "lib/utils/formatNumber";
import { translate } from "lib/i18n/translate";
import type { CookingBuildingName } from "features/game/types/buildings";
import { produce } from "immer";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getCookingAmount } from "./collectRecipe";
import { isCookingBuilding } from "./isCookingBuilding";
import { SKILL_RANKS, getSkillLevel } from "features/game/types/bumpkinSkills";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  CHAPTER_CROP_WEEK_RECIPE,
  isChapterCropWeekActive,
} from "features/game/types/chapterCropWeek";

export type RecipeCookedAction = {
  type: "recipe.cooked";
  item: CookableName;
  buildingId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RecipeCookedAction;
  createdAt?: number;
  farmId: number;
};

type GetReadyAtArgs = {
  buildingId: string;
  item: CookableName;
  createdAt: number;
  game: GameState;
};

export const BUILDING_OIL_BOOSTS: (
  skills: Skills,
) => Record<CookingBuildingName, number> = (skills) => {
  const swiftSizzleLevel = getSkillLevel(skills, "Swift Sizzle");
  const turboFryLevel = getSkillLevel(skills, "Turbo Fry");
  const fryFrenzyLevel = getSkillLevel(skills, "Fry Frenzy");

  return {
    // Swift Sizzle - 40%/45%/50% Fire Pit oil boost (scales with rank)
    "Fire Pit": swiftSizzleLevel
      ? SKILL_RANKS["Swift Sizzle"].ranks[swiftSizzleLevel - 1]
      : 0.2,
    // Turbo Fry - 50%/55%/60% Kitchen oil boost (scales with rank)
    Kitchen: turboFryLevel
      ? SKILL_RANKS["Turbo Fry"].ranks[turboFryLevel - 1]
      : 0.25,
    "Smoothie Shack": 0.3,
    Bakery: 0.35,
    // Fry Frenzy - 60%/65%/70% Deli oil boost (scales with rank)
    Deli: fryFrenzyLevel
      ? SKILL_RANKS["Fry Frenzy"].ranks[fryFrenzyLevel - 1]
      : 0.4,
  };
};

export function getCookingOilBoost(
  item: CookableName,
  game: GameState,
  buildingId?: string,
): { timeToCook: number; oilConsumed: number; percent?: number } {
  const buildingName = COOKABLES[item].building;

  if (!isCookingBuilding(buildingName) || !buildingId) {
    return { timeToCook: COOKABLES[item].cookingSeconds, oilConsumed: 0 };
  }

  const building = game.buildings?.[buildingName]?.find(
    (building) => building.id === buildingId,
  );

  const itemCookingTime = COOKABLES[item].cookingSeconds;

  const itemOilConsumption = getOilConsumption(buildingName, item);
  const oilRemaining = building?.oil || 0;

  const boostValue = BUILDING_OIL_BOOSTS(game.bumpkin.skills)[buildingName];
  const boostedCookingTime = itemCookingTime * (1 - boostValue);

  if (oilRemaining >= itemOilConsumption) {
    return {
      timeToCook: boostedCookingTime,
      oilConsumed: itemOilConsumption,
      percent: boostValue,
    };
  }

  // Calculate the partial boost based on remaining oil
  const effectiveBoostValue = (oilRemaining / itemOilConsumption) * boostValue;
  const partialBoostedCookingTime = itemCookingTime * (1 - effectiveBoostValue);

  return {
    timeToCook: partialBoostedCookingTime,
    oilConsumed: (oilRemaining / itemOilConsumption) * itemOilConsumption,
    percent: effectiveBoostValue > 0 ? effectiveBoostValue : undefined,
  };
}

export const getReadyAt = ({
  buildingId,
  item,
  createdAt,
  game,
}: GetReadyAtArgs) => {
  const oilBoostResult = getCookingOilBoost(item, game, buildingId);

  const { reducedSecs, boostsUsed } = getCookingTime({
    seconds: oilBoostResult.timeToCook,
    item,
    game,
    cookStartAt: createdAt,
  });

  const oilEntry =
    oilBoostResult.percent != null && oilBoostResult.percent > 0
      ? [
          {
            name: "Building Oil" as const,
            value: "x" + setPrecision(1 - oilBoostResult.percent, 2),
          },
        ]
      : [];

  return {
    createdAt: createdAt + reducedSecs * 1000,
    reducedSecs,
    boostsUsed: [...oilEntry, ...boostsUsed],
  };
};

export const BUILDING_DAILY_OIL_CONSUMPTION: Record<
  CookingBuildingName,
  number
> = {
  "Fire Pit": 1,
  Kitchen: 5,
  "Smoothie Shack": 8,
  Bakery: 10,
  Deli: 12,
};

export function getOilConsumption(
  buildingName: CookingBuildingName,
  food: CookableName,
) {
  const SECONDS_IN_A_DAY = 86400;
  const oilRequired = COOKABLES[food].cookingSeconds / SECONDS_IN_A_DAY;

  return BUILDING_DAILY_OIL_CONSUMPTION[buildingName] * oilRequired;
}

export function getCookingRequirements({
  state,
  item,
  doubleNomLevel,
}: {
  state: GameState;
  item: CookableName;
  // Which Double Nom rank to charge for. Defaults to the bumpkin's current rank
  // (fresh cook / cost preview); cancel passes the rank stored on the recipe so
  // the refund matches what was actually paid.
  doubleNomLevel?: number;
}): Inventory {
  let { ingredients } = COOKABLES[item];
  const { bumpkin } = state;

  const level = doubleNomLevel ?? getSkillLevel(bumpkin.skills, "Double Nom");
  // Double Nom - 2x/3x/4x ingredients (scales with rank)
  const multiplier = level
    ? SKILL_RANKS["Double Nom"].ingredients[level - 1]
    : 1;

  ingredients = Object.entries(ingredients).reduce(
    (inventory, [ingredient, amount]) => {
      return {
        ...inventory,
        [ingredient]: multiplier === 1 ? amount : amount.mul(multiplier),
      };
    },
    ingredients,
  );

  return ingredients;
}

export const MAX_COOKING_SLOTS = 4;

export function cook({
  state,
  action,
  farmId,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { item, buildingId } = action;

    // Chapter Crop Week event recipe is only cookable while the event is active
    if (
      item === CHAPTER_CROP_WEEK_RECIPE &&
      !isChapterCropWeekActive(createdAt)
    ) {
      throw new Error("Chapter Crop Week is not active");
    }

    const { building: requiredBuilding } = COOKABLES[item];
    const ingredients = getCookingRequirements({ state, item });
    const { buildings, bumpkin } = stateCopy;
    const buildingsOfRequiredType = buildings[requiredBuilding];
    const availableSlots = hasVipAccess({ game: stateCopy, now: createdAt })
      ? MAX_COOKING_SLOTS
      : 1;

    if (!Object.keys(buildings).length || !buildingsOfRequiredType) {
      throw new Error(translate("error.requiredBuildingNotExist"));
    }

    const building = buildingsOfRequiredType.find(
      (building) => building.id === buildingId,
    );

    if (bumpkin === undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    if (!building) {
      throw new Error(translate("error.requiredBuildingNotExist"));
    }

    if (!building.coordinates) {
      throw new Error("Building is not placed");
    }

    const crafting = (building.crafting ?? []) as BuildingProduct[];

    if (!isInstantFishRecipe(item) && crafting.length >= availableSlots) {
      throw new Error(translate("error.noAvailableSlots"));
    }

    const { oilConsumed } = getCookingOilBoost(item, stateCopy, buildingId);

    stateCopy.inventory = Object.entries(ingredients).reduce(
      (inventory, [ingredient, amount]) => {
        const count =
          inventory[ingredient as InventoryItemName] ?? new Decimal(0);

        if (count.lessThan(amount)) {
          throw new Error(`Insufficient ingredient: ${ingredient}`);
        }

        return {
          ...inventory,
          [ingredient]: count.sub(amount),
        };
      },
      stateCopy.inventory,
    );

    if (isInstantFishRecipe(item)) {
      const { amount, boostsUsed } = getCookingAmount({
        building: requiredBuilding,
        game: stateCopy,
        recipe: {
          name: item,
          boost: {},
          skills: { "Double Nom": getSkillLevel(bumpkin.skills, "Double Nom") },
          readyAt: createdAt,
        },
        farmId,
        counter: stateCopy.farmActivity[`${item} Cooked`] || 0,
      });
      stateCopy.inventory[item] = stateCopy.inventory[item] ?? new Decimal(0);
      stateCopy.inventory[item] = stateCopy.inventory[item].add(amount);

      stateCopy.farmActivity = trackFarmActivity(
        `${item} Cooked`,
        stateCopy.farmActivity,
      );

      if (boostsUsed.length > 0) {
        stateCopy.boostsUsedAt = updateBoostUsed({
          game: stateCopy,
          boostNames: boostsUsed,
          createdAt,
        });
      }

      return stateCopy;
    }

    // Start the new recipe when the last recipe is ready or now (createdAt)
    let recipeStartAt = createdAt;
    const lastRecipeReadyAt =
      crafting[crafting.length - 1]?.readyAt ?? createdAt;

    if (lastRecipeReadyAt > createdAt) {
      recipeStartAt = lastRecipeReadyAt;
    }

    const { createdAt: readyAt, boostsUsed } = getReadyAt({
      buildingId: buildingId,
      item,
      createdAt: recipeStartAt,
      game: stateCopy,
    });

    building.crafting = [
      ...(building.crafting ?? []),
      {
        name: item,
        boost: { Oil: oilConsumed },
        // Marks whether the Double Nom skill was applied at the time of cooking
        skills: { "Double Nom": getSkillLevel(bumpkin.skills, "Double Nom") },
        readyAt,
      },
    ];

    const previousOilRemaining = building.oil || 0;

    building.oil = previousOilRemaining - oilConsumed;

    // Delete cancelled property since no longer used
    delete building.cancelled;

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    return stateCopy;
  });
}
