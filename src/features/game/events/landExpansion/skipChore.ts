import cloneDeep from "lodash.clonedeep";
import { GameState } from "features/game/types/game";
import { isChoreId } from "./completeChore";

export type SkipChoreAction = {
  type: "chore.skipped";
  id?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SkipChoreAction;
  createdAt?: number;
};

function getDayOfYear(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function skipChore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);
  const { id } = action;
  const { chores, bumpkin } = game;

  if (id === undefined) {
    throw new Error("Chore ID not supplied");
  }

  if (!chores) {
    throw new Error("No chores found");
  }

  if (!bumpkin) {
    throw new Error("No bumpkin found");
  }
  if (!isChoreId(id)) {
    throw new Error("Invalid chore ID");
  }

  const chore = chores.chores[id];

  if ((chore.completedAt ?? 0) > 0) {
    throw new Error("Chore is already completed");
  }

  if (bumpkin.id !== chore.bumpkinId) {
    throw new Error("Not the same bumpkin");
  }

  const dayOfYear = getDayOfYear(new Date(createdAt));
  const choreDayOfYear = getDayOfYear(new Date(chore.createdAt ?? 0));

  if (dayOfYear <= choreDayOfYear) {
    return game;
  }

  // Skip chore

  return game;
}
