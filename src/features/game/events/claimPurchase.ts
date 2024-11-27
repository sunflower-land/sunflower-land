import { produce } from "immer";
import { GameState } from "../types/game";
import { getKeys } from "../types/decorations";
import Decimal from "decimal.js-light";
import { MARKETPLACE_TAX } from "../types/marketplace";
import { addTradePoints } from "./landExpansion/addTradePoints";

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

    const onchainPurchases = purchaseIds.filter((purchaseIds) => {
      return !!game.trades.listings?.[purchaseIds].signature;
    });

    instantPurchases.forEach((purchaseId) => {
      let sfl = new Decimal(game.trades.listings?.[purchaseId].sfl ?? 0);
      sfl = sfl.mul(1 - MARKETPLACE_TAX);

      game.balance = game.balance.plus(sfl);

      game.bank.taxFreeSFL = game.bank.taxFreeSFL + sfl.toNumber();
      // Add points to seller for instant trade
      game = addTradePoints({
        state: game,
        points: 1,
        sfl: game.trades.listings?.[purchaseId].sfl ?? 0,
        items: game.trades.listings?.[purchaseId].items,
      });
    });

    onchainPurchases.forEach((purchaseId) => {
      game = addTradePoints({
        state: game,
        points: 5,
        sfl: game.trades.listings?.[purchaseId].sfl ?? 0,
      });
    });

    purchaseIds.forEach((purchaseId) => {
      delete game.trades.listings?.[purchaseId];
    });

    return game;
  });
}
