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

export function castKraken({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

  // Check they have not already caught all tentacles.

  // Remove rod

  // Remove bait

  // Store usage

  return {
    ...game,
  };
}
