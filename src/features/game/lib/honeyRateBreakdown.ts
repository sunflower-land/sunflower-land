import Decimal from "decimal.js-light";
import type { BoostName, GameState } from "../types/game";
import type { WeatherEventName } from "../types/weather";
import { getHoneyRateAt } from "./updateBeehives";
import { getWeatherEvents } from "./weatherItemCover";
import {
  BEE_MIGRATION_HONEY,
  getWeatherHoneyBonus,
  getWeatherHoneyFactor,
} from "./weatherHoney";

/** A row of the Beehive's speed panel: a named boost, or a weather event. */
export type HoneyRateRow =
  | { name: BoostName; value: string }
  | { weatherEvent: WeatherEventName; value: string };

/**
 * The rows that explain a hive's honey speed at `now`, on top of the base of
 * 1 full hive a day: the permanent boosts, then Bee Migration's own part and
 * the Guardian's and Lure's shares of it, then an unprotected Flood's final
 * multiplier. `boosted` is false when nothing but a Flood applies: that only
 * slows the hive.
 */
export function getHoneyRateBreakdown({
  game,
  now,
}: {
  game: GameState;
  now: number;
}): { rows: HoneyRateRow[]; boosted: boolean } {
  const { boostsUsed } = getHoneyRateAt(game, now, now);
  const weather = getWeatherHoneyBonus({
    game,
    events: getWeatherEvents(game),
    at: now,
  });
  const factor = getWeatherHoneyFactor({ game, at: now });

  const fromWeather = (name: BoostName) => weather.boostsUsed.includes(name);
  const permanent = boostsUsed.filter(({ name }) => !fromWeather(name));
  const weatherShares = boostsUsed.filter(({ name }) => fromWeather(name));

  const boosts: HoneyRateRow[] = [
    ...permanent,
    ...(weather.amount > 0
      ? [
          {
            weatherEvent: "beeMigration" as const,
            value: `+${BEE_MIGRATION_HONEY.event}`,
          },
        ]
      : []),
    ...weatherShares,
  ];

  return {
    rows: [
      ...boosts,
      ...(factor !== 1
        ? [
            {
              weatherEvent: "flood" as const,
              value: `x${new Decimal(factor).toNumber()}`,
            },
          ]
        : []),
    ],
    boosted: boosts.length > 0,
  };
}
