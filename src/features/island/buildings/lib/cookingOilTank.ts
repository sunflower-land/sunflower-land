import type { CookingBuildingName } from "features/game/types/buildings";
import type { CookableName } from "features/game/types/consumables";
import type { GameState, PlacedItem } from "features/game/types/game";
import {
  getCookingBoostWindows,
  type BoostWindow,
} from "features/game/lib/boostWindows";
import {
  COOKING_OIL_CAPACITY,
  COOKING_OIL_RATE,
  getCookingOil,
  getCookingOilAt,
  resolveCookingQueue,
  resolveCookingQueueTimings,
} from "features/game/lib/cookingReadiness";
import { BUILDING_DAILY_OIL_CAPACITY } from "features/game/events/landExpansion/supplyCookingOil";
import {
  BUILDING_DAILY_OIL_CONSUMPTION,
  getRecipeOilBoost,
} from "features/game/events/landExpansion/cook";
import { hasFeatureAccess } from "lib/flags";

/**
 * What a cooking building's oil tank shows at `at`.
 *
 * - `level`: oil in the tank. A clock-drain building's stored `oil` is the level at
 *   its last settle, so the live level is derived from the queue.
 * - `capacity`: the most oil the tank holds.
 * - `ratePerDay`: oil burned per day of cooking — REAL days on a clock-drain
 *   building, recipe days on one that still deducts per recipe.
 *
 * A building converts to clock drain the next time it cooks or is filled once
 * SPEED_BOOSTS is on, so with the flag on an unconverted tank already shows the
 * clock-drain capacity and rate it is about to be held to.
 */
export const getCookingOilTank = ({
  game,
  building,
  buildingName,
  at,
}: {
  game: GameState;
  building: PlacedItem | undefined;
  buildingName: CookingBuildingName;
  at: number;
}) => {
  const oil = building && getCookingOil({ building, buildingName });
  const byTheClock =
    oil !== undefined || hasFeatureAccess(game, "SPEED_BOOSTS");

  return {
    byTheClock,
    level: oil
      ? getCookingOilAt({
          crafting: building?.crafting ?? [],
          windows: getCookingBoostWindows(game),
          oil,
          at,
        })
      : (building?.oil ?? 0),
    capacity: byTheClock
      ? COOKING_OIL_CAPACITY[buildingName]
      : BUILDING_DAILY_OIL_CAPACITY[buildingName],
    ratePerDay: byTheClock
      ? COOKING_OIL_RATE[buildingName]
      : BUILDING_DAILY_OIL_CONSUMPTION[buildingName],
  };
};

/**
 * The oil speed window a recipe would cook under if it were queued now — the
 * preview's counterpart to what `cook` does. The tank is burned in queue order,
 * so the recipe gets whatever the queue ahead of it leaves.
 *
 * Undefined while the building still deducts oil per recipe (the oil is baked
 * into the preview duration instead), or when no oil would reach the recipe.
 */
export const getPreviewOilWindow = ({
  game,
  building,
  buildingName,
  item,
  baseDurationMs,
  now,
}: {
  game: GameState;
  building: PlacedItem | undefined;
  buildingName: CookingBuildingName;
  item: CookableName;
  baseDurationMs: number;
  now: number;
}): BoostWindow | undefined => {
  if (!building) return undefined;

  const { byTheClock, ratePerDay } = getCookingOilTank({
    game,
    building,
    buildingName,
    at: now,
  });
  if (!byTheClock) return undefined;

  // An unconverted building converts when this recipe is cooked, starting its
  // ledger now.
  const oil = getCookingOil({ building, buildingName }) ?? {
    tank: building.oil ?? 0,
    settledAt: now,
    ratePerDay,
  };
  const crafting = building.crafting ?? [];
  const windows = getCookingBoostWindows(game);
  const lastReadyAt = resolveCookingQueue({ crafting, windows, oil }).at(-1);

  return resolveCookingQueueTimings({
    crafting: [
      ...crafting,
      {
        name: item,
        readyAt: 0,
        baseDurationMs,
        oilBoost: getRecipeOilBoost(item, game),
        // Anchored only on an idle building, as `cook` does.
        ...(lastReadyAt === undefined || lastReadyAt <= now
          ? { startedAt: now }
          : {}),
      },
    ],
    windows,
    oil,
  }).at(-1)?.oilWindow;
};
