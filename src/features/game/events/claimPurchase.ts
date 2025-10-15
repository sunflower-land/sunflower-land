import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "../types/game";
import { produce } from "immer";
import { getKeys } from "../types/decorations";
import { MARKETPLACE_TAX } from "../types/marketplace";
import { addTradePoints } from "./landExpansion/addTradePoints";
import { BumpkinItem } from "../types/bumpkin";
import { getListingItem } from "features/marketplace/lib/listings";

export type ClaimPurchaseAction = {
  type: "purchase.claimed";
  tradeIds: string[];
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimPurchaseAction;
  createdAt?: number;
};

export function claimPurchase({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    if (game.transaction) {
      throw new Error("Transaction in progress");
    }

    const purchaseIds = getKeys(game.trades.listings ?? {}).filter(
      (listingId) => action.tradeIds.includes(listingId),
    );

    if (purchaseIds.length !== action.tradeIds.length) {
      throw new Error("One or more purchases do not exist");
    }

    if (
      purchaseIds.some(
        (purchaseId) =>
          !game.trades.listings?.[purchaseId].fulfilledAt &&
          // To handle old trade board trades
          !game.trades.listings?.[purchaseId].boughtAt,
      )
    ) {
      throw new Error("One or more purchases have not been fulfilled");
    }

    purchaseIds.forEach((purchaseId) => {
      const listing = game.trades.listings?.[purchaseId];
      const item = getKeys(listing?.items ?? {})[0];
      const amount = listing?.items[item] ?? 0;

      let sfl = new Decimal(listing?.sfl ?? 0);
      const tax = listing?.tax ?? sfl.mul(MARKETPLACE_TAX);
      sfl = sfl.minus(tax);

      game.balance = game.balance.plus(sfl);

      game.bank.taxFreeSFL += sfl.toNumber();
      // Add points to seller for instant trade
      game = addTradePoints({
        state: game,
        points: 1,
        sfl: listing?.sfl ?? 0,
        items: listing?.items,
      });

      // If bud, we need to remove it (placed collectibles & wearables are cleaned up automatically)
      if (listing?.collection === "buds") {
        const id = getListingItem({ listing: listing });
        delete game.buds?.[id];
      }

      if (listing?.collection === "pets") {
        const id = getListingItem({ listing: listing });
        delete game.pets?.nfts?.[id];
      }

      delete game.trades.listings?.[purchaseId];

      if (listing?.tradeType === "onchain") {
        if (listing.collection === "collectibles") {
          const count =
            game.previousInventory[item as InventoryItemName] ?? new Decimal(0);
          game.previousInventory[item as InventoryItemName] = count.sub(amount);
        } else if (listing.collection === "wearables") {
          const count = game.previousWardrobe[item as BumpkinItem] ?? 0;
          game.previousWardrobe[item as BumpkinItem] = count - amount;
        }
      }
    });

    return game;
  });
}
