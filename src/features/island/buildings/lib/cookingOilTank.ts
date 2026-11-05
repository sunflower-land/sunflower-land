import type { CookingBuildingName } from "features/game/types/buildings";
import type { CookableName } from "features/game/types/consumables";
import type { GameState, PlacedItem } from "features/game/types/game";
import { getCookingBoostWindows } from "features/game/lib/boostWindows";
import {
  COOKING_OIL_CAPACITY,
  COOKING_OIL_CLOCK_RATE,
  COOKING_OIL_RATE,
  getCookingOil,
  getCookingOilAt,
  resolveCookingQueue,
  resolveCookingQueueTimings,
  type CookingTiming,
} from "features/game/lib/cookingReadiness";
import { BUILDING_DAILY_OIL_CAPACITY } from "features/game/events/landExpansion/supplyCookingOil";
import {
  BUILDING_DAILY_OIL_CONSUMPTION,
  getRecipeOilBoost,
  getRecipeOilRate,
} from "features/game/events/landExpansion/cook";
import { hasFeatureAccess } from "lib/flags";

/**
 * What a cooking building's oil tank shows at `at`.
 *
 * - `level`: oil in the tank. A clock-drain building's stored `oil` is the level at
 *   its last settle, so the live level is derived from the queue.
 * - `afterQueue`: what the tank will hold once the queue has cooked, so the oil a
 *   queued dish has committed shows the moment it is queued. Equal to `level` on a
 *   building that deducts per recipe, which has already paid.
 * - `capacity`: the most oil the tank holds.
 * - `ratePerDay`: oil burned per day of recipe time, whether the building burns it
 *   as it cooks (clock drain) or deducts it per recipe.
 *
 * A building converts to clock drain the next time it cooks or is filled once
 * SPEED_BOOSTS is on, so with the flag on an unconverted tank already shows the
 * clock-drain level it is about to be held to.
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
  const levelAt = (when: number) =>
    oil
      ? getCookingOilAt({
          crafting: building?.crafting ?? [],
          windows: getCookingBoostWindows(game),
          oil,
          at: when,
        })
      : (building?.oil ?? 0);

  return {
    byTheClock,
    level: levelAt(at),
    afterQueue: levelAt(Infinity),
    capacity: byTheClock
      ? COOKING_OIL_CAPACITY[buildingName]
      : BUILDING_DAILY_OIL_CAPACITY[buildingName],
    ratePerDay: byTheClock
      ? COOKING_OIL_RATE[buildingName]
      : BUILDING_DAILY_OIL_CONSUMPTION[buildingName],
  };
};

/**
 * How a recipe would cook if it were queued now — the preview's counterpart to
 * what `cook` does: its oil speed window and the rate it burns oil at. The tank is
 * burned in queue order, so the recipe gets whatever the queue ahead of it leaves.
 *
 * Undefined while the building still deducts oil per recipe (the oil is baked
 * into the preview duration instead), or when no oil would reach the recipe.
 */
export const getPreviewOilTiming = ({
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
}): CookingTiming | undefined => {
  if (!building || baseDurationMs <= 0) return undefined;

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
    clockRatePerDay: COOKING_OIL_CLOCK_RATE[buildingName],
  };
  const crafting = building.crafting ?? [];
  const windows = getCookingBoostWindows(game);
  const lastReadyAt = resolveCookingQueue({ crafting, windows, oil }).at(-1);

  const timing = resolveCookingQueueTimings({
    crafting: [
      ...crafting,
      {
        name: item,
        readyAt: 0,
        baseDurationMs,
        oilBoost: getRecipeOilBoost(item, game),
        oilRate: getRecipeOilRate(buildingName, item, baseDurationMs),
        // Anchored only on an idle building, as `cook` does.
        ...(lastReadyAt === undefined || lastReadyAt <= now
          ? { startedAt: now }
          : {}),
      },
    ],
    windows,
    oil,
  }).at(-1);

  return timing?.oilWindow ? timing : undefined;
};

/**
 * An oil amount for display: two decimal places at most, rounded to nearest so a
 * float like 11.9999 reads 12, and anything above zero but below 0.01 as "<0.01".
 */
export const formatOil = (oil: number) => {
  if (oil > 0 && oil < 0.005) return "<0.01";
  return String(Math.round(oil * 100) / 100);
};
