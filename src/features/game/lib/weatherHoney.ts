import Decimal from "decimal.js-light";
import type { BoostName, GameState } from "../types/game";
import { hasFeatureAccess } from "lib/flags";
import {
  getWeatherItemCoverWindows,
  type WeatherEvents,
  WEATHER_LOOKAHEAD_MS,
} from "./weatherItemCover";
import {
  getGuardianPlacedPeriods,
  getSeasonGuardian,
  getWeatherFloodWindows,
} from "./boostWindows";

type Game = GameState;
type Period = { from: number; to: number };

/**
 * What Bee Migration adds to the honey rate, and the Wildflower Lure on top
 * of it. The season's Guardian, while placed, raises both ("Blessed").
 */
export const BEE_MIGRATION_HONEY = {
  event: 0.2,
  eventBlessed: 0.3,
  lure: 1.25,
  lureBlessed: 1.875,
} as const;

const covers = (periods: Period[], at: number) =>
  periods.some((period) => period.from <= at && at < period.to);

/**
 * The weather's addition to the honey rate at `at` (Weather flag): Bee
 * Migration's, plus the Lure's while it covers the event.
 */
export function getWeatherHoneyBonus({
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
      event.name === "beeMigration" && event.startAt <= at && at < event.endAt,
  );
  if (!event) return { amount: 0, boostsUsed: [] };

  const guardian = getSeasonGuardian(event.startAt);
  const blessed =
    !!guardian && covers(getGuardianPlacedPeriods(game, guardian), at);
  const lure = covers(
    getWeatherItemCoverWindows({ game, item: "Wildflower Lure", events }),
    at,
  );

  let amount = new Decimal(
    blessed ? BEE_MIGRATION_HONEY.eventBlessed : BEE_MIGRATION_HONEY.event,
  );
  if (lure) {
    amount = amount.add(
      blessed ? BEE_MIGRATION_HONEY.lureBlessed : BEE_MIGRATION_HONEY.lure,
    );
  }

  return {
    amount: amount.toNumber(),
    boostsUsed: [
      ...(blessed && guardian ? [guardian] : []),
      ...(lure ? (["Wildflower Lure"] as const) : []),
    ],
  };
}

/** What an unprotected Flood multiplies the whole honey rate by. */
export const FLOOD_HONEY_FACTOR = 0.5;

/**
 * What the weather multiplies the whole honey rate (base, permanent boosts
 * and any bonus) by at `at` (Weather flag): `FLOOD_HONEY_FACTOR` while a
 * Flood is unprotected, otherwise 1.
 */
export const getWeatherHoneyFactor = ({
  game,
  at,
}: {
  game: Game;
  at: number;
}): number =>
  covers(getWeatherFloodWindows(game), at) ? FLOOD_HONEY_FACTOR : 1;

/**
 * The times after `from` at which the weather's honey rate can change with
 * no player action: Bee Migration starting or ending, the Lure's cover and
 * the Guardian's placement starting or ending, and an unprotected Flood
 * starting or ending. Honey attachments are cut there, so each piece has one
 * rate.
 */
export function getWeatherHoneyBoundaries({
  game,
  events,
  from,
}: {
  game: Game;
  events: WeatherEvents;
  from: number;
}): number[] {
  if (!hasFeatureAccess(game, "WEATHER")) return [];

  const bees = events.filter((event) => event.name === "beeMigration");

  const periods: Period[] = [
    ...getWeatherFloodWindows(game),
    ...(bees.length === 0
      ? []
      : [
          ...bees.map(({ startAt, endAt }) => ({ from: startAt, to: endAt })),
          ...getWeatherItemCoverWindows({
            game,
            item: "Wildflower Lure",
            events,
          }),
          ...bees.flatMap((event) => {
            const guardian = getSeasonGuardian(event.startAt);
            return guardian ? getGuardianPlacedPeriods(game, guardian) : [];
          }),
        ]),
  ];

  const times = periods
    .flatMap(({ from, to }) => [from, to])
    // Only a week ahead: the client's forecast always has that much.
    .filter((at) => at > from && at < from + WEATHER_LOOKAHEAD_MS);

  return [...new Set(times)].sort((a, b) => a - b);
}
