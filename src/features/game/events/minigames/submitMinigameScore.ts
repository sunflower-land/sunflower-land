import { GameState } from "features/game/types/game";
import {
  MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";
import { produce } from "immer";

export type SubmitMinigameScoreAction = {
  type: "minigame.scoreSubmitted";
  id: MinigameName;
  score: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SubmitMinigameScoreAction;
  createdAt?: number;
};

export function submitMinigameScore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!SUPPORTED_MINIGAMES.includes(action.id)) {
      throw new Error(`${action.id} is not a valid minigame`);
    }

    const minigames = (game.minigames ??
      {}) as Required<GameState>["minigames"];

    const minigame = minigames.games[action.id] ?? {
      history: {},
      highscore: 0,
    };

    const todayKey = new Date(createdAt).toISOString().slice(0, 10);

    const daily = minigame.history[todayKey] ?? {
      attempts: 0,
      highscore: 0,
    };

    minigames.games[action.id] = {
      ...minigame,
      history: {
        ...minigame.history,
        [todayKey]: {
          ...daily,
          highscore: Math.max(daily.highscore, action.score),
        },
      },
      highscore: Math.max(daily.highscore, action.score),
    };

    const { prizes } = minigames;

    // Get todays prize
    const prize = prizes[action.id];

    // If higher than highscore on easter, clear prize claimed
    if (
      prize &&
      action.id === "easter-eggstravaganza" &&
      action.score > prize.score
    ) {
      delete minigames.games[action.id]?.history[todayKey].prizeClaimedAt;
    }

    return game;
  });
}
