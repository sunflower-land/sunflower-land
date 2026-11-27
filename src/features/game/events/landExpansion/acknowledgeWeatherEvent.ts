import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { getWeatherEvents } from "features/game/lib/weatherItemCover";

export type AcknowledgeWeatherEventAction = {
  type: "weather.acknowledged";
};

type Options = {
  state: Readonly<GameState>;
  action: AcknowledgeWeatherEventAction;
  createdAt?: number;
};

/**
 * Closes the start popup of the weather event running now, so it shows once
 * per event.
 */
export function acknowledgeWeatherEvent({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "WEATHER")) {
      throw new Error("Weather is not available");
    }

    const event = getWeatherEvents(game).find(
      ({ startAt, endAt }) => startAt <= createdAt && createdAt < endAt,
    );

    if (!game.weather || !event) {
      throw new Error("No weather event is running");
    }

    game.weather.acknowledged = event.startAt;
  });
}
