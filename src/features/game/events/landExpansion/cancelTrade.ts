import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { produce } from "immer";

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

    // Some older trades still have the collection listed as "resources". They are still collectibles.
    if (
      trade.collection !== "collectibles" &&
      trade.collection !== "resources"
    ) {
      throw new Error(`Trade #${action.tradeId} is not a collectible`);
    }

    if (trade.boughtAt) {
      throw new Error(`Trade #${action.tradeId} already bought`);
    }

    // Add items
    getKeys(trade.items).forEach((name) => {
      const previous =
        game.inventory[name as InventoryItemName] ?? new Decimal(0);
      game.inventory[name as InventoryItemName] = previous.add(
        trade.items[name] ?? 0,
      );
    });

    // Remove Trade
    delete game.trades.listings?.[action.tradeId];

    return game;
  });
}
