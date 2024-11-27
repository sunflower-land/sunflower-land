import Decimal from "decimal.js-light";
import { BumpkinItem, ITEM_NAMES } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/craftables";
import {
  GameState,
  InventoryItemName,
  TradeOffer,
} from "features/game/types/game";
import { produce } from "immer";
import { addTradePoints } from "./addTradePoints";
import { KNOWN_ITEMS } from "features/game/types";

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

    const instantOffers = offerIds.filter(
      (offerId) => !game.trades.offers?.[offerId].signature,
    );

    instantOffers.forEach((offerId) => {
      const offer = game.trades.offers?.[offerId] as TradeOffer;

      if (offer.collection === "collectibles") {
        const item = KNOWN_ITEMS[offer.itemId];
        const amount = offer.quantity;
        const count =
          game.inventory[item as InventoryItemName] ?? new Decimal(0);
        game.inventory[item as InventoryItemName] = count.add(amount);
      }

      if (offer.collection === "wearables") {
        const item = ITEM_NAMES[offer.itemId];
        const count = game.wardrobe[item as BumpkinItem] ?? 0;
        game.wardrobe[item as BumpkinItem] = count + offer.quantity;
      }
    });

    // Remove trade
    offerIds.forEach((offerId) => {
      const offer = game.trades.offers?.[offerId] as TradeOffer;

      if (offer.signature) {
        game = addTradePoints({
          state: game,
          points: 10,
          sfl: offer.sfl,
          trade: {
            itemId: offer.itemId,
            quantity: offer.quantity,
            collection: offer.collection,
          },
        });
      } else {
        game = addTradePoints({
          state: game,
          points: 2,
          sfl: offer.sfl,
          trade: {
            itemId: offer.itemId,
            quantity: offer.quantity,
            collection: offer.collection,
          },
        });
      }

      delete game.trades.offers?.[offerId];
    });

    return game;
  });
}
