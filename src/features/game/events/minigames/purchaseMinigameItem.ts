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
    throw new Error(`${action.id} is not a valid minigame`);
  }

  const minigames = (game.minigames ?? {}) as Required<GameState>["minigames"];
  const minigame = minigames.games[action.id] ?? {
    history: {},
    purchases: [],
    highscore: 0,
  };

  const purchases = minigame.purchases ?? [];

  minigames.games[action.id] = {
    ...minigame,
    purchases: [
      ...purchases,
      {
        purchasedAt: createdAt,
        sfl: action.sfl,
      },
    ],
  };

  // Burn the SFL
  game.balance = game.balance.sub(action.sfl);

  return game;
}
