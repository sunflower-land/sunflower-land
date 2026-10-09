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
import { hasFeatureAccess } from "lib/flags";
import {
  computeReadyAt,
  getCookingBoostWindows,
} from "features/game/lib/boostWindows";
import {
  convertCookingToLazyOil,
  getCookingOilAt,
  getCookingQueueReadyAts,
  refreshCookingCaches,
  settleCookingBuilding,
} from "features/game/lib/cookingReadiness";
import { setPrecision } from "lib/utils/formatNumber";
import { translate } from "lib/i18n/translate";
import type {
  BuildingName,
  CookingBuildingName,
} from "features/game/types/buildings";
import { produce } from "immer";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getCookingAmount } from "./collectRecipe";
import { isCookingBuilding } from "./isCookingBuilding";
import {
  SKILL_RANKS,
  getSkillLevel,
  downgradeChapterCropWeekSkills,
} from "features/game/types/bumpkinSkills";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  CHAPTER_CROP_WEEK_RECIPE,
  isChapterCropWeekActive,
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

  // Saltbite (the CHAPTER_CROP_WEEK event recipe) ignores upgraded Cooking-skill
  // ranks (base skill still applies), so its oil boost caps at rank 1.
  const oilSkills =
    item === CHAPTER_CROP_WEEK_RECIPE
      ? downgradeChapterCropWeekSkills(game.bumpkin.skills)
      : game.bumpkin.skills;
  const boostValue = BUILDING_OIL_BOOSTS(oilSkills)[buildingName];
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

/**
 * When a recipe started at `createdAt` will be ready, across both boost models.
 *
 * Legacy: every boost is baked into `reducedSecs` and the ready time is simply
 * `createdAt + reducedSecs`.
 *
 * Speed-rate model (SPEED_BOOSTS): building oil becomes a live SPEED boost rather
 * than a baked discount. `getCookingTime` returns the PERMANENT-only duration
 * (wearables, Desert Gnome, the cooking skills — NOT oil), which becomes the
 * recipe's `baseDurationMs`. Oil is snapshotted as `oilPercent` (`p`) and
 * `oilPerWorkMs` (its cost per ms of base work) and drawn live from the tank by
 * the queue resolver, so a top-up speeds up the recipe in the oven and everything
 * queued. The temporary boosts stay live speed windows.
 *
 * NOTE the derived time here assumes the recipe starts at `createdAt` with the
 * whole tank to itself; it is a best-effort preview. For a recipe QUEUED behind
 * others the real start AND the oil left for it come from the recipes ahead, so
 * the queue as a whole must be resolved with `getCookingQueueReadyAts` — the value
 * returned here is that chain's input, not its answer.
 */
export const getReadyAt = ({
  buildingId,
  item,
  createdAt,
  game,
}: GetReadyAtArgs) => {
  const buildingName = COOKABLES[item].building;
  const building = game.buildings?.[buildingName as CookingBuildingName]?.find(
    (b) => b.id === buildingId,
  );
  // Key off the per-building `oilSettledAt` marker as well as the flag: a building
  // already converted to the lazy model stays on it even if SPEED_BOOSTS is later
  // rolled back, so its tank and recipes keep resolving consistently (the read path
  // keys off the marker too). Matches every other speed-boost activity.
  const boostsWindowed =
    hasFeatureAccess(game, "SPEED_BOOSTS") ||
    building?.oilSettledAt !== undefined;

  if (boostsWindowed) {
    // Permanent-only work — oil is NOT baked in, it is a live speed boost.
    const { reducedSecs, boostsUsed } = getCookingTime({
      seconds: COOKABLES[item].cookingSeconds,
      item,
      game,
      cookStartAt: createdAt,
    });

    const baseDurationMs = reducedSecs * 1000;
    const oilPercent = getBuildingOilPercent(item, game, buildingName);
    const oilConsumption = isCookingBuilding(buildingName)
      ? getOilConsumption(buildingName, item)
      : 0;
    const oilPerWorkMs =
      baseDurationMs > 0 ? oilConsumption / baseDurationMs : 0;

    // Preview off the oil that will be LEFT when this recipe starts — the recipes
    // already queued ahead of it drain the tank first. `getCookingOilAt` at the
    // recipe's start returns exactly that remainder (0 queued ⇒ the full tank).
    const oilRemaining = building
      ? getCookingOilAt({
          building,
          windows: getCookingBoostWindows(game),
          at: createdAt,
        })
      : 0;
    const coveredWorkMs =
      oilPerWorkMs > 0
        ? Math.min(baseDurationMs, oilRemaining / oilPerWorkMs)
        : 0;
    // Effective work for the PREVIEW: base work minus the time the current tank's
    // oil coverage removes. `baseDurationMs` (the stored value) stays oil-free.
    const previewDurationMs = baseDurationMs - coveredWorkMs * oilPercent;
    const readyAt = computeReadyAt({
      startedAt: createdAt,
      baseDurationMs: previewDurationMs,
      windows: getCookingBoostWindows(game),
    });

    // The oil boost as it would show for THIS preview (its effective % given the
    // current tank), for the recipe boost panel. Kept out of `boostsUsed` so it
    // never lands in `boostsUsedAt` — oil is drawn live, not "used" at cook time.
    const previewOilPercent =
      baseDurationMs > 0 ? (coveredWorkMs * oilPercent) / baseDurationMs : 0;
    const oilBoostEntry =
      previewOilPercent > 0
        ? [
            {
              name: "Building Oil" as const,
              value: "x" + setPrecision(1 - previewOilPercent, 2),
            },
          ]
        : [];

    return {
      createdAt: readyAt,
      reducedSecs,
      baseDurationMs,
      previewDurationMs,
      oilPercent,
      oilPerWorkMs,
      oilBoostEntry,
      boostsUsed,
    };
  }

  // Legacy: oil is a baked % discount deducted at cook time.
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
    baseDurationMs: undefined as number | undefined,
    previewDurationMs: undefined as number | undefined,
    oilPercent: undefined as number | undefined,
    oilPerWorkMs: undefined as number | undefined,
    oilBoostEntry: [] as { name: "Building Oil"; value: string }[],
    boostsUsed: [...oilEntry, ...boostsUsed],
  };
};

/**
 * The building's oil speed boost `p` at FULL coverage — the fraction of cook time
 * a full tank removes, snapshotted onto a recipe as `oilPercent`. Skill-scaled
 * (Swift Sizzle / Turbo Fry / Fry Frenzy), and capped for the event recipe.
 * 0 on a non-cooking building. Unlike `getCookingOilBoost` it ignores the current
 * tank — partial coverage is derived live from the tank by the queue resolver.
 */
export function getBuildingOilPercent(
  item: CookableName,
  game: GameState,
  buildingName: BuildingName,
): number {
  if (!isCookingBuilding(buildingName)) return 0;
  const oilSkills =
    item === CHAPTER_CROP_WEEK_RECIPE
      ? downgradeChapterCropWeekSkills(game.bumpkin.skills)
      : game.bumpkin.skills;
  return BUILDING_OIL_BOOSTS(oilSkills)[buildingName];
}

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

  // Saltbite (the CHAPTER_CROP_WEEK event recipe) ignores upgraded Double Nom
  // ranks — the ingredient cost (and the +food payout, snapshotted at cook time)
  // both fall back to rank 1. `doubleNomLevel`, when passed (cancel/refund), keeps
  // honoring the rank actually paid on the recipe.
  const skills =
    item === CHAPTER_CROP_WEEK_RECIPE
      ? downgradeChapterCropWeekSkills(bumpkin.skills)
      : bumpkin.skills;
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

    // Saltbite (the CHAPTER_CROP_WEEK event recipe) ignores upgraded Double Nom
    // ranks — snapshot rank 1 on the recipe so cancel/collect stay consistent with
    // the (rank-1) ingredient cost charged above.
    const cookSkills =
      item === CHAPTER_CROP_WEEK_RECIPE
        ? downgradeChapterCropWeekSkills(bumpkin.skills)
        : bumpkin.skills;

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

    // Stay on the lazy model once the building carries `oilSettledAt`, even if the
    // flag is later rolled back — otherwise the write path would deduct oil from a
    // tank the read path still treats as a live-draining cache (see `getReadyAt`).
    const boostsWindowed =
      hasFeatureAccess(stateCopy, "SPEED_BOOSTS") ||
      building.oilSettledAt !== undefined;

    // Legacy oil is deducted up front and baked into the recipe; under the lazy
    // model nothing is deducted here — the tank drains as the recipe cooks.
    const { oilConsumed } = boostsWindowed
      ? { oilConsumed: 0 }
      : getCookingOilBoost(item, stateCopy, buildingId);

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

    // Under the lazy oil model, bring the building's tank up to `createdAt`
    // (converting it on first touch) BEFORE reading the queue, so the resolve
    // below sees the current oil level and the head's banked progress.
    if (boostsWindowed) {
      convertCookingToLazyOil({ building, now: createdAt });
      settleCookingBuilding({
        building,
        windows: getCookingBoostWindows(stateCopy),
        now: createdAt,
      });
    }

    // Start the new recipe when the last recipe is ready or now (createdAt). The
    // queue ahead is resolved live rather than read off the stored `readyAt`s: under
    // the speed-rate model those are a cache, and a boost placed since the last
    // write may have pulled the queue forward.
    const queueReadyAts = getCookingQueueReadyAts({
      crafting,
      game: stateCopy,
      building,
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
      oilPercent,
      oilPerWorkMs,
      boostsUsed,
    } = getReadyAt({
      buildingId: buildingId,
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
        // Legacy oil is baked in and recorded here for the cancel refund; under
        // the lazy model oil is drawn live so there is nothing to refund.
        boost: boostsWindowed ? {} : { Oil: oilConsumed },
        // Marks whether the Double Nom skill was applied at the time of cooking
        skills: { "Double Nom": getSkillLevel(cookSkills, "Double Nom") },
        // Anchored only when this recipe starts cooking right now; a queued recipe
        // deliberately carries no `startedAt` so its start tracks the (derived) ready
        // time of the recipe ahead of it.
        startedAt: isChained ? undefined : recipeStartAt,
        baseDurationMs,
        oilPercent,
        oilPerWorkMs,
        readyAt,
      },
    ];

    if (boostsWindowed) {
      // Refresh the readyAt caches so the queued recipe's stored time reflects the
      // oil the tank actually has for it (getReadyAt's preview assumed the whole
      // tank; the recipes ahead may have spent it).
      refreshCookingCaches({
        building,
        windows: getCookingBoostWindows(stateCopy),
      });
    } else {
      building.oil = (building.oil || 0) - oilConsumed;
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
