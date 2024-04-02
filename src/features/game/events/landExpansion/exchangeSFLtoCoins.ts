import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

type ExchangePackage = { sfl: number; coins: number };
export type PackageId = 1 | 2 | 3;

export const SFL_TO_COIN_PACKAGES: Record<number, ExchangePackage> = {
  1: {
    sfl: 1,
    coins: 160,
  },
  2: { sfl: 30, coins: 8640 },
  3: { sfl: 200, coins: 64000 },
};

export type ExchangeSFLtoCoinsAction = {
  type: "sfl.exchanged";
  packageId: PackageId;
};

type Options = {
  state: Readonly<GameState>;
  action: ExchangeSFLtoCoinsAction;
  createdAt?: number;
};

export function exchangeSFLtoCoins({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game: GameState = cloneDeep(state);
  const { bumpkin, balance } = game;

  if (!SFL_TO_COIN_PACKAGES[action.packageId]) {
    throw new Error("Invalid packageId");
  }

  const { sfl, coins } = SFL_TO_COIN_PACKAGES[action.packageId];

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (balance.lt(sfl)) {
    throw new Error("Not enough SFL");
  }

  game.balance = balance.minus(sfl);
  game.coins += coins;

  return game;
}
