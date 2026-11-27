import { hasFeatureAccess } from "lib/flags";
import type { GameState } from "../types/game";
import { getActiveWeather, type ScheduledWeatherEvent } from "../types/weather";

/**
 * The weather event whose start popup is due at `now`: one is running and the
 * player hasn't closed its popup yet. Tutorial (basic island) farms get none.
 */
export function getUnacknowledgedWeather({
  game,
  now,
}: {
  game: GameState;
  now: number;
}): Readonly<ScheduledWeatherEvent> | undefined {
  if (!hasFeatureAccess(game, "WEATHER")) return undefined;
  if (game.island.type === "basic") return undefined;

  const event = getActiveWeather({ weather: game.weather, now });
  if (!event || game.weather?.acknowledged === event.startAt) return undefined;

  return event;
}
