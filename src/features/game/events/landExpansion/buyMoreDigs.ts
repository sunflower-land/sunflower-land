import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

import { produce } from "immer";

export type BuyMoreDigsAction = {
  type: "desert.digsBought";
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMoreDigsAction;
  createdAt?: number;
};

const EXTRA_DIGS_AMOUNT = 5;
export const GRID_DIG_SPOTS = 100;

export function buyMoreDigs({ state }: Options) {
  return produce(state, (game) => {
    const blockBucks = game.inventory["Block Buck"] ?? new Decimal(0);

    if (blockBucks.lt(1)) {
      throw new Error(
        "Player does not have enough block bucks to buy more digs",
      );
    }

    const extraDigs = game.desert.digging.extraDigs ?? 0;

    game.inventory["Block Buck"] = blockBucks.sub(1);

    game.desert.digging.extraDigs = extraDigs + EXTRA_DIGS_AMOUNT;

    return game;
  });
}
