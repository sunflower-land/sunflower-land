import Decimal from "decimal.js-light";
import { KNOWN_ITEMS } from "features/game/types";
import { ITEM_NAMES } from "features/game/types/bumpkin";
import { GameState } from "features/game/types/game";
import { getOfferItem } from "features/marketplace/lib/offers";
import { produce } from "immer";
import { addTradePoints } from "./addTradePoints";

export type ClaimOfferAction = {
  type: "offer.claimed";
  tradeId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimOfferAction;
  createdAt?: number;
};

export function claimOffer({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (game) => {
    const offer = game.trades.offers?.[action.tradeId];

    if (!offer) {
      throw new Error("Offer does not exist");
    }

    if (!offer.fulfilledAt) {
      throw new Error("Offer is not fulfilled");
    }

    // Remove trade
    delete game.trades.offers?.[action.tradeId];

    // On chain trade = do not add items since they have already been sent
    if (offer.signature) {
      game = addTradePoints({ state: game, points: 10, sfl: offer.sfl });
      return game;
    }

    const id = getOfferItem({ offer });
    if (offer.collection === "collectibles") {
      const name = KNOWN_ITEMS[id];
      game.inventory[name] = (game.inventory[name] ?? new Decimal(0)).add(1);
    }

    if (offer.collection === "wearables") {
      const name = ITEM_NAMES[id];
      game.wardrobe[name] = (game.wardrobe[name] ?? 0) + 1;
    }

    game = addTradePoints({ state: game, points: 2, sfl: offer.sfl });

    return game;
  });
}
