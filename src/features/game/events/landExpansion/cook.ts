import Decimal from "decimal.js-light";
import { v4 as uuidv4 } from "uuid";
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
import {
  computeReadyAt,
  getCookingBoostWindows,
} from "features/game/lib/boostWindows";
import {
  getCookingQueueReadyAts,
  refreshCookingQueue,
  settleCookingOil,
} from "features/game/lib/cookingReadiness";
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
  hasChapterCropWeekAccess,
  isRetiredChapterCropWeekItem,
} from "features/game/types/chapterCropWeek";

export type RecipeCookedAction = {
  type: "recipe.cooked";
  item: CookableName;
  buildingId: string;
  /** Client-generated id for the queue entry (see `BuildingProduct.id`). */
  recipeId?: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RecipeCookedAction;
  createdAt?: number;
  farmId: number;
};

type GetReadyAtArgs = {
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

/**
 * The building-oil boost a recipe cooks with (e.g. 0.4 = 40%), from the bumpkin's
 * oil skills.
 */
export function getRecipeOilBoost(item: CookableName, game: GameState): number {
  const buildingName = COOKABLES[item].building;
  if (!isCookingBuilding(buildingName)) return 0;

  return BUILDING_OIL_BOOSTS(game.bumpkin.skills)[buildingName];
}

/**
 * When a recipe started at `createdAt` will be ready.
 *
 * `getCookingTime` returns the PERMANENT-only duration — wearables, Desert Gnome
 * and the cooking skills — which becomes the recipe's `baseDurationMs`. The
 * temporary boosts are applied live as speed windows, and the building oil burns
 * by the clock (see `settleCookingOil`), so the ready time is derived rather than
 * frozen and a boost placed mid-cook pulls it forward.
 *
 * NOTE the derived time here assumes the recipe starts at `createdAt`. For a recipe
 * QUEUED behind others the real start is the previous recipe's (also derived) ready
 * time, so the queue as a whole must be resolved with `getCookingQueueReadyAts` —
 * the value returned here is that chain's input, not its answer.
 */
export const getReadyAt = ({ item, createdAt, game }: GetReadyAtArgs) => {
  const { reducedSecs, boostsUsed } = getCookingTime({
    seconds: COOKABLES[item].cookingSeconds,
    item,
    game,
  });

  const baseDurationMs = reducedSecs * 1000;

  const readyAt = computeReadyAt({
    startedAt: createdAt,
    baseDurationMs,
    windows: getCookingBoostWindows(game),
  });

  return {
    createdAt: readyAt,
    reducedSecs,
    baseDurationMs,
    boostsUsed,
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

/**
 * Oil a clock-drain recipe burns per day of cooking work: its up-front cost
 * (`getOilConsumption`) spread over its work, which a permanent boost may have cut,
 * so the dish costs the same oil either way.
 */
export function getRecipeOilRate(
  buildingName: CookingBuildingName,
  food: CookableName,
  baseDurationMs: number,
) {
  // A recipe with no work to do burns no oil.
  if (baseDurationMs <= 0) return 0;

  return (
    (getOilConsumption(buildingName, food) * 24 * 60 * 60 * 1000) /
    baseDurationMs
  );
}

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

  const skills = bumpkin.skills;
  const level = doubleNomLevel ?? getSkillLevel(skills, "Double Nom");
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

    // Recipes from ended Chapter Crop Week runs can never be cooked again
    if (isRetiredChapterCropWeekItem(item, createdAt)) {
      throw new Error("This recipe is no longer available");
    }

    // Chapter Crop Week event recipe is only cookable while the event is active
    // (admin testers get early access)
    if (
      item === CHAPTER_CROP_WEEK_RECIPE &&
      !hasChapterCropWeekAccess(state, createdAt)
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

    const cookSkills = bumpkin.skills;

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

    // A clock-drain building burns its oil while recipes cook rather than charging
    // each one when it is queued. Settle the tank first so this recipe draws from
    // what is left now — which also converts the building.
    const oil = isCookingBuilding(requiredBuilding)
      ? settleCookingOil({
          game: stateCopy,
          building,
          buildingName: requiredBuilding,
          at: createdAt,
          convert: true,
        })
      : undefined;

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
          skills: { "Double Nom": getSkillLevel(cookSkills, "Double Nom") },
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

    // Start the new recipe when the last recipe is ready or now (createdAt). The
    // queue ahead is resolved live rather than read off the stored `readyAt`s: under
    // the speed-rate model those are a cache, and a boost placed since the last
    // write may have pulled the queue forward.
    const queueReadyAts = getCookingQueueReadyAts({
      crafting,
      game: stateCopy,
      oil,
    });
    const lastRecipeReadyAt =
      queueReadyAts[queueReadyAts.length - 1] ?? createdAt;
    // Queued behind something still cooking, or starting fresh on an idle building?
    // That decides whether the recipe gets an absolute `startedAt` anchor or chains
    // off the recipe ahead of it — see `resolveCookingQueue`.
    const isChained = lastRecipeReadyAt > createdAt;
    const recipeStartAt = isChained ? lastRecipeReadyAt : createdAt;

    const {
      createdAt: readyAt,
      baseDurationMs,
      boostsUsed,
    } = getReadyAt({
      item,
      createdAt: recipeStartAt,
      game: stateCopy,
    });

    building.crafting = [
      ...(building.crafting ?? []),
      {
        // Stable identity so cancel/speed-up can address this recipe once its
        // `readyAt` is derived rather than fixed. Client-generated (mirrors
        // `plant.ts`'s cropId) with a server-side fallback.
        id: action.recipeId ?? uuidv4().slice(0, 8),
        name: item,
        // A recipe in a non-cooking building takes no oil at all.
        ...(isCookingBuilding(requiredBuilding)
          ? {
              oilBoost: getRecipeOilBoost(item, stateCopy),
              ...(baseDurationMs
                ? {
                    oilRate: getRecipeOilRate(
                      requiredBuilding,
                      item,
                      baseDurationMs,
                    ),
                  }
                : {}),
            }
          : {}),
        // Marks whether the Double Nom skill was applied at the time of cooking
        skills: { "Double Nom": getSkillLevel(cookSkills, "Double Nom") },
        // Anchored only when this recipe starts cooking right now; a queued recipe
        // deliberately carries no `startedAt` so its start tracks the (derived) ready
        // time of the recipe ahead of it.
        startedAt: isChained ? undefined : recipeStartAt,
        baseDurationMs,
        readyAt,
      },
    ];

    if (isCookingBuilding(requiredBuilding)) {
      // The new recipe takes whatever the tank has left once the queue ahead of it
      // has cooked, so its ready time comes from the whole chain.
      refreshCookingQueue({
        building,
        buildingName: requiredBuilding,
        windows: getCookingBoostWindows(stateCopy),
      });
    }

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
