import Decimal from "decimal.js-light";
import { CookableName, COOKABLES } from "features/game/types/consumables";
import {
  BuildingProduct,
  GameState,
  Inventory,
  InventoryItemName,
  Skills,
} from "features/game/types/game";
import { getCookingTime } from "features/game/expansion/lib/boosts";
import { translate } from "lib/i18n/translate";
import {
  BuildingName,
  CookingBuildingName,
} from "features/game/types/buildings";
import { produce } from "immer";
import { BUILDING_DAILY_OIL_CAPACITY } from "./supplyCookingOil";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type RecipeCookedAction = {
  type: "recipe.cooked";
  item: CookableName;
  buildingId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RecipeCookedAction;
  createdAt?: number;
};

type GetReadyAtArgs = {
  buildingId: string;
  item: CookableName;
  createdAt: number;
  game: GameState;
};

export const BUILDING_OIL_BOOSTS: (
  skills: Skills,
) => Record<CookingBuildingName, number> = (skills) => ({
  "Fire Pit": skills["Swift Sizzle"] ? 0.4 : 0.2,
  Kitchen: skills["Turbo Fry"] ? 0.5 : 0.25,
  "Smoothie Shack": 0.3,
  Bakery: 0.35,
  Deli: skills["Fry Frenzy"] ? 0.6 : 0.4,
});

export function isCookingBuilding(
  building: BuildingName,
): building is CookingBuildingName {
  return Object.keys(BUILDING_DAILY_OIL_CAPACITY).includes(building);
}

export function getCookingOilBoost(
  item: CookableName,
  game: GameState,
  buildingId?: string,
): { timeToCook: number; oilConsumed: number } {
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
    return { timeToCook: boostedCookingTime, oilConsumed: itemOilConsumption };
  }

  // Calculate the partial boost based on remaining oil
  const effectiveBoostValue = (oilRemaining / itemOilConsumption) * boostValue;
  const partialBoostedCookingTime = itemCookingTime * (1 - effectiveBoostValue);

  return {
    timeToCook: partialBoostedCookingTime,
    oilConsumed: (oilRemaining / itemOilConsumption) * itemOilConsumption,
  };
}

export const getReadyAt = ({
  buildingId,
  item,
  createdAt,
  game,
}: GetReadyAtArgs) => {
  const withOilBoost = getCookingOilBoost(item, game, buildingId).timeToCook;

  const { reducedSecs, boostsUsed } = getCookingTime({
    seconds: withOilBoost,
    item,
    game,
    cookStartAt: createdAt,
  });

  return { createdAt: createdAt + reducedSecs * 1000, boostsUsed };
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
  skipDoubleNomBoost = false,
}: {
  state: GameState;
  item: CookableName;
  // Ignored when getting the requirements for a recipe made before the skill was applied
  skipDoubleNomBoost?: boolean;
}): Inventory {
  let { ingredients } = COOKABLES[item];
  const { bumpkin } = state;

  ingredients = Object.entries(ingredients).reduce(
    (inventory, [ingredient, amount]) => {
      // Double Nom - 2x ingredients
      if (bumpkin.skills["Double Nom"] && !skipDoubleNomBoost) {
        amount = amount.mul(2);
      }

      return {
        ...inventory,
        [ingredient]: amount,
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
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { item, buildingId } = action;
    const { building: requiredBuilding } = COOKABLES[item];
    const ingredients = getCookingRequirements({ state, item });
    const { buildings, bumpkin } = stateCopy;
    const buildingsOfRequiredType = buildings[requiredBuilding];
    const availableSlots = hasVipAccess({ game: stateCopy })
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

    if (crafting.length >= availableSlots) {
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
        skills: { "Double Nom": !!bumpkin.skills["Double Nom"] },
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
