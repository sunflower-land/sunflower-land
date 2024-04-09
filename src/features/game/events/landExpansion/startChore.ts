import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type StartChoreAction = {
  type: "chore.started";
};

type Options = {
  state: Readonly<GameState>;
  action: StartChoreAction;
  createdAt?: number;
};

const clone = (state: GameState): GameState => {
  return cloneDeep(state);
};

export function startChore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = clone(state);
  const { hayseedHank } = game;

  if (!game.bumpkin) {
    throw new Error("No Bumpkin Found");
  }

  if (!hayseedHank) {
    throw new Error("No Hayseed Hank Found");
  }

  if (hayseedHank.progress?.bumpkinId === game.bumpkin.id) {
    throw new Error("Chore already in progress");
  }

  let startCount = 0;

  if (hayseedHank.chore?.activity) {
    startCount = game.bumpkin.activity?.[hayseedHank.chore.activity] ?? 0;
  }

  // Start the next chore
  hayseedHank.progress = {
    bumpkinId: game.bumpkin.id,
    startCount,
    startedAt: createdAt,
  };

  return game;
}
