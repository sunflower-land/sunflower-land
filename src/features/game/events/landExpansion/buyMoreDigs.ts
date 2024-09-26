import Decimal from "decimal.js-light";
import { BB_TO_GEM_RATIO, GameState } from "features/game/types/game";

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
    const gems = game.inventory["Gem"] ?? new Decimal(0);

    if (gems.lt(1 * BB_TO_GEM_RATIO)) {
      throw new Error("Player does not have enough Gems to buy more digs");
    }

    const extraDigs = game.desert.digging.extraDigs ?? 0;

    game.inventory["Gem"] = gems.sub(1 * BB_TO_GEM_RATIO);

    game.desert.digging.extraDigs = extraDigs + EXTRA_DIGS_AMOUNT;

    return game;
  });
}
