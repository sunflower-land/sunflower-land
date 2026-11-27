import {
  getWeatherEvents,
  getWindfallBonus,
} from "features/game/lib/weatherItemCover";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";

/**
 * Whether a Fish Frenzy is on at `now`, and what the weather one adds per
 * catch. Under the Weather flag the weather Fish Frenzy decides; otherwise
 * the calendar does.
 */
export function getFishFrenzy({
  game,
  now,
}: {
  game: GameState;
  now: number;
}): { isActive: boolean; bonus?: number } {
  if (!hasFeatureAccess(game, "WEATHER")) {
    return {
      isActive:
        getActiveCalendarEvent({ calendar: game.calendar }) === "fishFrenzy",
    };
  }

  const { amount } = getWindfallBonus({
    game,
    name: "fishFrenzy",
    events: getWeatherEvents(game),
    now,
  });

  return { isActive: amount > 0, bonus: amount };
}
