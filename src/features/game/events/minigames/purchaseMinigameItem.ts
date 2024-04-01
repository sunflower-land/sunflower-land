import { GameState } from "features/game/types/game";
import {
  MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";
import cloneDeep from "lodash.clonedeep";

export type PurchaseMinigameAction = {
  type: "minigame.itemPurchased";
  id: MinigameName;
  sfl: number;
};

type Options = {
  state: Readonly<GameState>;
  action: PurchaseMinigameAction;
  createdAt?: number;
};

export function purchaseMinigameItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep<GameState>(state);

  if (!SUPPORTED_MINIGAMES.includes(action.id)) {
    throw new Error(`${action.id} is not a valid portal`);
  }

  const minigames = (game.minigames ?? {}) as Required<GameState>["minigames"];
  const minigame = minigames.games[action.id] ?? {
    history: {},
  };

  const todayKey = new Date(createdAt).toISOString().slice(0, 10);

  const daily = minigame.history[todayKey] ?? {
    attempts: 0,
    highscore: 0,
    sflBurned: 0,
  };

  minigames.games[action.id] = {
    ...minigame,
    history: {
      ...minigame.history,
      [todayKey]: {
        ...daily,
        sflBurned: daily.sflBurned + action.sfl,
      },
    },
  };

  return game;
}
