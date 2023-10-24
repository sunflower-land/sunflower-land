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

export function catchKraken({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

  // Store attempt

  // Add tentacle

  return {
    ...game,
  };
}
