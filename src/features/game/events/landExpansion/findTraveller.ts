import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";

export type FindTravellerAction = {
  type: "traveller.found";
};

type Options = {
  state: Readonly<GameState>;
  action: FindTravellerAction;
  createdAt?: number;
};

export const TRAVELLER_COOLDOWN = 4 * 60 * 60 * 1000;

export function findTraveller({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);

  if (!game.dawnBreaker) {
    throw new Error("Not initialised");
  }

  const discoveredAt = game.dawnBreaker?.traveller?.discoveredAt ?? 0;
  if (createdAt < discoveredAt + TRAVELLER_COOLDOWN) {
    throw new Error("Traveller recently discovered");
  }

  const discoveredCount = game.dawnBreaker?.traveller?.discoveredCount ?? 0;

  game.dawnBreaker.traveller = {
    discoveredCount: discoveredCount + 1,
    discoveredAt: createdAt,
  };

  return game;
}
