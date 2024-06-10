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

  if (kingdomChores.chores[id] === undefined) {
    throw new Error("Chore not found");
  }

  return game;
}
