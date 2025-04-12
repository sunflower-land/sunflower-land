import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type RefundBidAction = {
  type: "bid.refunded";
};

type Options = {
  state: Readonly<GameState>;
  action: RefundBidAction;
};

export function refundBid({ state }: Options) {
  return produce(state, (game) => {
    const bid = game.auctioneer.bid;
    if (!bid) {
      throw new Error("No bid was placed");
    }

    // Add ingredients back to inventory
    getKeys(bid.ingredients)?.forEach((name) => {
      const old = game.inventory[name] || new Decimal(0);
      game.inventory[name] = old.add(bid.ingredients[name] ?? 0);
    });

    // Add FLOWER back to balance
    game.balance = game.balance.add(bid.sfl);

    delete game.auctioneer.bid;

    return game;
  });
}
