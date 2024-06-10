import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type CompleteKingdomChoreAction = {
  type: "kingdomChore.completed";
  id: number;
};

type Options = {
  state: Readonly<GameState>;
  action: CompleteKingdomChoreAction;
  createdAt?: number;
  farmId?: number;
};

export function completeKingdomChore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep<GameState>(state);
  const { id } = action;
  const { kingdomChores, bumpkin } = game;

  if (kingdomChores === undefined) {
    throw new Error("No kingdom chores found");
  }

  const chore = kingdomChores.chores[id];

  if (chore === undefined) {
    throw new Error("Chore not found");
  }

  if (!bumpkin) {
    throw new Error("No bumpkin found");
  }

  if (!chore.active && !chore.completedAt) {
    throw new Error("Chore is not active");
  }

  const progress = bumpkin?.activity?.[chore.activity] ?? 0 - chore.startCount;

  if (progress < chore.requirement) {
    throw new Error("Chore is not completed");
  }

  if ((chore.completedAt ?? 0) > 0) {
    throw new Error("Chore is already completed");
  }

  if (bumpkin.id !== chore.bumpkinId) {
    throw new Error("Not the same bumpkin");
  }

  return game;
}
