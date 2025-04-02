import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type ReceiveTradeAction = {
  type: "trade.received";
  tradeId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ReceiveTradeAction;
  createdAt?: number;
};

export function receiveTrade({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    const trade = game.trades.listings?.[action.tradeId];

    if (!trade) {
      throw new Error(`Trade #${action.tradeId} does not exist`);
    }

    //  FE only - MMO sends events before client receives
    // if (!trade.boughtAt) {
    //   throw new Error(`Trade #${action.tradeId} was not bought`);
    // }

    // Subtract 10% tax
    trade.sfl = trade.sfl * 0.9;

    // Add FLOWER to balance (minus tax)
    game.balance = game.balance.add(trade.sfl);

    // Remove trade
    delete game.trades.listings?.[action.tradeId];

    return game;
  });
}
