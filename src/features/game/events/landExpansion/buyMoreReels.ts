import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { getRemainingReels } from "./castRod";

export type BuyMoreReelsAction = {
  type: "fishing.reelsBought";
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMoreReelsAction;
  createdAt?: number;
};

const EXTRA_REELS_AMOUNT = 5;

export function buyMoreReels({ state }: Options) {
  return produce(state, (game) => {
    const gems = game.inventory["Gem"] ?? new Decimal(0);

    if (gems.lt(10)) {
      throw new Error("Player does not have enough Gems to buy more reels");
    }

    if (getRemainingReels(game) > 0) {
      throw new Error("Player has reels remaining");
    }

    const extraReels = game.fishing.extraReels ?? 0;
    game.inventory["Gem"] = gems.sub(10);

    game.fishing.extraReels = extraReels + EXTRA_REELS_AMOUNT;

    return game;
  });
}
