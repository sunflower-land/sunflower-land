import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";

export type CastKrakenAction = {
  type: "kraken.casted";
};

type Options = {
  state: Readonly<GameState>;
  action: CastKrakenAction;
  createdAt?: number;
};

export function missKraken({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

  // Record attempt

  return {
    ...game,
  };
}
