import type { BoostName, GameState } from "../types/game";
import { hasFeatureAccess } from "lib/flags";
import {
  getWeatherItemCoverWindows,
  type WeatherEvents,
} from "./weatherItemCover";
import { getGuardianPlacedPeriods, getSeasonGuardian } from "./boostWindows";

type Game = GameState;
type Period = { from: number; to: number };

const covers = (periods: Period[], at: number) =>
  periods.some((period) => period.from <= at && at < period.to);

/**
 * What Heavy Rains adds to each crop harvest: with or without the Merino Wool
 * Insulation placed, and with the season's Guardian placed ("Blessed").
 */
export const HEAVY_RAINS_CROP_YIELD = {
  event: -0.2,
  item: 0.2,
  eventBlessed: 0,
  itemBlessed: 0.3,
} as const;

/**
 * Heavy Rains' flat change to a crop harvest at `at` (Weather flag). The item
 * counts while it covers the event and the Guardian while it is placed, as
 * for Bee Migration.
 */
export function getHeavyRainsCropYield({
  game,
  events,
  at,
}: {
  game: Game;
  events: WeatherEvents;
  at: number;
}): { amount: number; boostsUsed: BoostName[] } {
  if (!hasFeatureAccess(game, "WEATHER")) return { amount: 0, boostsUsed: [] };

  const event = events.find(
    (event) =>
      event.name === "heavyRains" && event.startAt <= at && at < event.endAt,
  );
  if (!event) return { amount: 0, boostsUsed: [] };

  const guardian = getSeasonGuardian(event.startAt);
  const blessed =
    !!guardian && covers(getGuardianPlacedPeriods(game, guardian), at);
  const item = covers(
    getWeatherItemCoverWindows({
      game,
      item: "Merino Wool Insulation",
      events,
    }),
    at,
  );

  const amount = item
    ? blessed
      ? HEAVY_RAINS_CROP_YIELD.itemBlessed
      : HEAVY_RAINS_CROP_YIELD.item
    : blessed
      ? HEAVY_RAINS_CROP_YIELD.eventBlessed
      : HEAVY_RAINS_CROP_YIELD.event;

  return {
    amount,
    boostsUsed: [
      ...(blessed && guardian ? [guardian] : []),
      ...(item ? (["Merino Wool Insulation"] as const) : []),
    ],
  };
}
