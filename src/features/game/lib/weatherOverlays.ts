import { hasFeatureAccess } from "lib/flags";
import type { GameState } from "../types/game";
import { getActiveCalendarEvent } from "../types/calendar";
import type {
  ScheduledWeatherOverlay,
  WeatherOverlayName,
} from "../types/weather";

type WeatherOverlays = readonly Readonly<ScheduledWeatherOverlay>[];

/** The overlays an action is checked against: the ones the server sent. */
export const getWeatherOverlays = (game: GameState): WeatherOverlays =>
  game.weather?.overlays ?? [];

/**
 * Whether the Full Moon or Double Delivery is on at `now`. Overlays run beside
 * the weather and each other. Without the Weather flag the calendar decides.
 */
export function isWeatherOverlayActive({
  game,
  name,
  overlays,
  now,
}: {
  game: GameState;
  name: WeatherOverlayName;
  overlays: WeatherOverlays;
  now: number;
}): boolean {
  if (!hasFeatureAccess(game, "WEATHER")) {
    return getActiveCalendarEvent({ calendar: game.calendar }) === name;
  }

  return overlays.some(
    (overlay) =>
      overlay.name === name && overlay.startAt <= now && now < overlay.endAt,
  );
}
