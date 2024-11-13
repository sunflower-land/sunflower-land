import { produce } from "immer";
import { GameState } from "../types/game";

export type ClaimPurchaseAction = {
  type: "purchase.claimed";
  tradeId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimPurchaseAction;
  createdAt?: number;
};

export function claimPurchase({ state, action }: Options) {
  return produce(state, (game) => {
    const purchase = game.trades.listings?.[action.tradeId];

    if (!purchase) {
      throw new Error("Purchase does not exist");
    }

    if (!purchase.fulfilledAt) {
      throw new Error("Purchase has not been fulfilled");
    }

    delete game.trades.listings?.[action.tradeId];

    if (purchase.signature) return game;

    game.balance = game.balance.plus(purchase.sfl);

    return game;
  });
}
