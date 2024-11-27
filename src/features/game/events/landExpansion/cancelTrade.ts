import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";
import { KNOWN_ITEMS } from "features/game/types";

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
  return produce(state, (game) => {
    const trade = game.trades.listings?.[action.tradeId];

    if (!trade) {
      throw new Error(`Trade #${action.tradeId} does not exist`);
    }

    if (trade.boughtAt) {
      throw new Error(`Trade #${action.tradeId} already bought`);
    }

    const name = KNOWN_ITEMS[trade.itemId];
    const previous =
      game.inventory[name as InventoryItemName] ?? new Decimal(0);
    game.inventory[name as InventoryItemName] = previous.add(trade.quantity);

    // Remove Trade
    delete game.trades.listings?.[action.tradeId];

    return game;
  });
}
