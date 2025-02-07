import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import {
  MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";

import cloneDeep from "lodash.clonedeep";

export type TrackMinigameActivitiesAction = {
  type: "minigame.activitiesTracked";
  id: MinigameName;
  activities: Record<string, Decimal>;
};

type Options = {
  state: Readonly<GameState>;
  action: TrackMinigameActivitiesAction;
};

export function trackMinigameActivities({ state, action }: Options): GameState {
  const game = cloneDeep<GameState>(state);

  if (!SUPPORTED_MINIGAMES.includes(action.id)) {
    throw new Error(`${action.id} is not a valid minigame`);
  }

  const minigames = (game.minigames ?? {}) as Required<GameState>["minigames"];

  const minigame = minigames.games[action.id] ?? {
    history: {},
    highscore: 0,
  };

  // track all activities
  const minigameActivities = minigame.activities ?? {};
  Object.keys(action.activities).forEach((activityName) => {
    const currentCount = minigameActivities[activityName] || new Decimal(0);
    minigameActivities[activityName] = currentCount.add(
      new Decimal(action.activities[activityName]),
    );
  });

  // update activities
  minigame.activities = minigameActivities;
  minigames.games[action.id] = minigame;

  return game;
}
