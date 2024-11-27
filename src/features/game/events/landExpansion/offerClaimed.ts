import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/craftables";
import {
  GameState,
  InventoryItemName,
  TradeOffer,
} from "features/game/types/game";
import { produce } from "immer";
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

      const item = getKeys(offer.items)[0];
      const amount = offer.items[item] ?? 0;

      if (offer.collection === "collectibles") {
        const count =
          game.inventory[item as InventoryItemName] ?? new Decimal(0);
        game.inventory[item as InventoryItemName] = count.add(amount);
      } else if (offer.collection === "wearables") {
        const count = game.wardrobe[item as BumpkinItem] ?? 0;
        game.wardrobe[item as BumpkinItem] = count + amount;
      }
    });

    // Remove trade
    offerIds.forEach((offerId) => {
      const offer = game.trades.offers?.[offerId] as TradeOffer;
      const points = offer.signature ? 10 : 2;

      game = addTradePoints({
        state: game,
        points,
        sfl: offer.sfl,
        items: offer.items,
      });

      delete game.trades.offers?.[offerId];
    });

    return game;
  });
}
