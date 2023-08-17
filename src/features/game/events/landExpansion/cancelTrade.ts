import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";

export type CancelTradeAction = {
  type: "trade.cancelled";
  tradeId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: CancelTradeAction;
  createdAt?: number;
};

export function cancelTrade({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const game = cloneDeep(state) as GameState;

  const trade = game.trades.listings[action.tradeId];

  if (!trade) {
    throw new Error(`Trade #${action.tradeId} does not exist`);
  }

  // Add items
  getKeys(game.inventory).forEach((name) => {
    const previous = game.inventory[name] ?? new Decimal(0);
    game.inventory[name] = previous.add(game.inventory[name] ?? 0);
  });

  // Remove Trade
  delete game.trades.listings[action.tradeId];

  return game;
}
