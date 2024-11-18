import { produce } from "immer";
import { GameState } from "../types/game";
import { getKeys } from "../types/decorations";

export type ClaimPurchaseAction = {
  type: "purchase.claimed";
  tradeIds: string[];
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimPurchaseAction;
  createdAt?: number;
};

export function claimPurchase({ state, action }: Options) {
  return produce(state, (game) => {
    const purchaseIds = getKeys(game.trades.listings ?? {}).filter(
      (listingId) => action.tradeIds.includes(listingId),
    );

    if (purchaseIds.length !== action.tradeIds.length) {
      throw new Error("One or more purchases do not exist");
    }

    if (
      purchaseIds.some(
        (purchaseId) => !game.trades.listings?.[purchaseId].fulfilledAt,
      )
    ) {
      throw new Error("One or more purchases have not been fulfilled");
    }

    const instantPurchases = purchaseIds.filter((purchaseId) => {
      return !game.trades.listings?.[purchaseId].signature;
    });

    instantPurchases.forEach((purchaseId) => {
      game.balance = game.balance.plus(
        game.trades.listings?.[purchaseId].sfl ?? 0,
      );
    });

    purchaseIds.forEach((purchaseId) => {
      delete game.trades.listings?.[purchaseId];
    });

    return game;
  });
}
