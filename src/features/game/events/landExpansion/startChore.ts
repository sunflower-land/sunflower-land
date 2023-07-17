import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type StartChoreAction = {
  type: "chore.started";
};

type Options = {
  state: Readonly<GameState>;
  createdAt?: number;
};

const clone = (state: GameState): GameState => {
  return cloneDeep(state);
};

export function startChore({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  const game = clone(state);

  if (!game.bumpkin) {
    throw new Error("No Bumpkin Found");
  }

  if (game.hayseedHank.progress?.bumpkinId === game.bumpkin.id) {
    throw new Error("Chore already in progress");
  }

  let startCount = 0;

  if (game.hayseedHank.chore.activity) {
    startCount = game.bumpkin.activity?.[game.hayseedHank.chore.activity] ?? 0;
  }

  // Start the next chore
  game.hayseedHank.progress = {
    bumpkinId: game.bumpkin.id,
    startCount,
    startedAt: createdAt,
  };

  return game;
}
