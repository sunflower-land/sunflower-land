import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { CHORES } from "features/game/types/chores";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type CompleteChoreAction = {
  type: "chore.completed";
};

type Options = {
  state: Readonly<GameState>;
  action: CompleteChoreAction;
  createdAt?: number;
};

const clone = (state: GameState): GameState => {
  return cloneDeep(state);
};

export function completeChore({ state }: Options): GameState {
  const game = clone(state);

  if (!game.bumpkin) {
    throw new Error("No Bumpkin Found");
  }

  if (!game.choreMaster.progress) {
    throw new Error("Chore has not started");
  }

  if (game.bumpkin.id !== game.choreMaster.progress?.bumpkinId) {
    throw new Error("Not the same Bumpkin");
  }

  const activity = game.choreMaster.chore.activity;

  const progress =
    (game.bumpkin.activity?.[activity] ?? 0) -
    game.choreMaster.progress.startCount;

  if (progress < game.choreMaster.chore.requirement) {
    throw new Error("Chore is not completed");
  }

  // Add rewards
  getKeys(game.choreMaster.chore.reward.items).forEach((name) => {
    const previous = game.inventory[name] ?? new Decimal(0);
    game.inventory[name] = previous.add(
      game.choreMaster.chore.reward.items[name] ?? 0
    );
  });

  // Cycle the chore
  const nextChoreIndex = (game.choreMaster.choresCompleted + 1) % CHORES.length;
  const nextChore = CHORES[nextChoreIndex];

  game.choreMaster.choresCompleted += 1;
  delete game.choreMaster.progress;

  // Increment activity
  game.bumpkin.activity = trackActivity(
    "Chore Completed",
    game.bumpkin.activity
  );

  return game;
}
