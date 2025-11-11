import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { produce } from "immer";

export type CancelBidAction = {
  type: "bid.cancelled";
  auctionId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: CancelBidAction;
};

export function cancelBid({ state, action }: Options) {
  return produce(state, (game) => {
    const bid = game.auctioneer.bid;

    if (!bid) {
      throw new Error("No bid to cancel");
    }

    if (bid.auctionId !== action.auctionId) {
      throw new Error("Auction does not match active bid");
    }

    getKeys(bid.ingredients)?.forEach((name) => {
      const previous = game.inventory[name] || new Decimal(0);
      game.inventory[name] = previous.add(bid.ingredients[name] ?? 0);
    });

    game.balance = game.balance.add(bid.sfl);

    delete game.auctioneer.bid;

    return game;
  });
}
