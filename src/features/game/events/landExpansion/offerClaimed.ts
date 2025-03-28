import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import {
  GameState,
  InventoryItemName,
  TradeOffer,
} from "features/game/types/game";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";
import { addTradePoints } from "./addTradePoints";

export type ClaimOfferAction = {
  type: "offer.claimed";
  tradeIds: string[];
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimOfferAction;
  createdAt?: number;
};

export function claimOffer({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (game) => {
    if (state.transaction) {
      throw new Error("Transaction in progress");
    }

    const offerIds = getKeys(game.trades.offers ?? {}).filter((id) =>
      action.tradeIds.includes(id),
    );

    if (offerIds.length !== action.tradeIds.length) {
      throw new Error("One or more offers do not exist");
    }

    if (
      offerIds.some((offerId) => !game.trades.offers?.[offerId].fulfilledAt)
    ) {
      throw new Error("One or more offers have not been fulfilled");
    }

    // Process instant offers only. On Chain offers are processed after rebase
    const instantOffers = offerIds.filter(
      (offerId) =>
        hasFeatureAccess(game, "OFFCHAIN_MARKETPLACE") ||
        !game.trades.offers?.[offerId].signature,
    );

    instantOffers.forEach((offerId) => {
      const offer = game.trades.offers?.[offerId] as TradeOffer;

      const item = getKeys(offer.items)[0];
      const amount = offer.items[item] ?? 0;

      if (offer.collection === "collectibles") {
        const count =
          game.inventory[item as InventoryItemName] ?? new Decimal(0);
        game.inventory[item as InventoryItemName] = count.add(amount);

        if (offer.tradeType === "onchain") {
          const previousCount =
            game.previousInventory[item as InventoryItemName] ?? new Decimal(0);
          game.previousInventory[item as InventoryItemName] =
            previousCount.add(amount);
        }
      } else if (offer.collection === "wearables") {
        const count = game.wardrobe[item as BumpkinItem] ?? 0;
        game.wardrobe[item as BumpkinItem] = count + amount;

        if (offer.tradeType === "onchain") {
          const previousCount = game.previousWardrobe[item as BumpkinItem] ?? 0;
          game.previousWardrobe[item as BumpkinItem] = previousCount + amount;
        }
      }

      game = addTradePoints({
        state: game,
        points: 2,
        sfl: offer.sfl,
        items: offer.items,
      });

      delete game.trades.offers?.[offerId];
    });
  });
}
