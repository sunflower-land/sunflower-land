import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { getWeatherEvents } from "features/game/lib/weatherItemCover";

export type AcknowledgeWeatherEventAction = {
  type: "weather.acknowledged";
  /** The start of the event whose popup was closed. */
  startAt: number;
};

type Options = {
  state: Readonly<GameState>;
  action: AcknowledgeWeatherEventAction;
  createdAt?: number;
};

/**
 * Closes the start popup of a weather event that has started, so it shows
 * once per event. The action names the event, so a popup closed just after
 * its event ended still records that event, never the one starting next.
 */
export function acknowledgeWeatherEvent({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "WEATHER")) {
      throw new Error("Weather is not available");
    }

    const event = getWeatherEvents(game).find(
      ({ startAt }) => startAt === action.startAt && startAt <= createdAt,
    );

    if (!game.weather || !event) {
      throw new Error("Weather event not found");
    }

    game.weather.acknowledged = event.startAt;
  });
}
