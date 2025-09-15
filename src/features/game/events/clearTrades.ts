import { produce } from "immer";
import { GameState } from "../types/game";
import { getKeys } from "../lib/crafting";

export type ClearTradesAction = {
  type: "trades.cleared";
};

type Options = {
  state: Readonly<GameState>;
  action: ClearTradesAction;
  createdAt?: number;
};

export function clearTrades({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    // Clear any listings that have a removedAt field
    const listings = game.trades.listings;
    getKeys(listings ?? {}).forEach((id) => {
      if (listings?.[id]?.clearedAt) {
        delete game.trades.listings?.[id];
      }
    });

    // Clear any offers that have a removedAt field
    const offers = game.trades.offers;
    getKeys(offers ?? {}).forEach((id) => {
      if (offers?.[id]?.clearedAt) {
        delete game.trades.offers?.[id];
      }
    });

    return game;
  });
}
