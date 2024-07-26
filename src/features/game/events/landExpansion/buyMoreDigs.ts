import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type BuyMoreDigsAction = {
  type: "desert.digsBought";
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMoreDigsAction;
  createdAt?: number;
};

const EXTRA_DIGS_AMOUNT = 5;
export const TOTAL_DIG_SPOTS = 100;

export function buyMoreDigs({ state }: Options) {
  const game = cloneDeep(state);

  const blockBucks = game.inventory["Block Buck"] ?? new Decimal(0);

  if (blockBucks.lt(1)) {
    throw new Error("Player does not have enough block bucks to buy more digs");
  }

  const totalDigs = game.desert.digging.grid.flat().length;
  const extraDigs = game.desert.digging.extraDigs ?? 0;

  if (totalDigs + extraDigs >= TOTAL_DIG_SPOTS) {
    throw new Error("No more spots left to dig");
  }

  game.inventory["Block Buck"] = blockBucks.sub(1);

  game.desert.digging.extraDigs = extraDigs + EXTRA_DIGS_AMOUNT;

  return game;
}
