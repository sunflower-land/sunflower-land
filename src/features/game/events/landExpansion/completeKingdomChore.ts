import { GameState, KingdomChore } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { getSeasonalBanner } from "features/game/types/seasons";

export function generateChoreTickets({
  game,
  id,
  now = new Date(),
}: {
  game: GameState;
  id: KingdomChore;
  now?: Date;
}) {
  let amount = 0;

  if (
    !!game.inventory[getSeasonalBanner(now)] ||
    !!game.inventory["Lifetime Farmer Banner"]
  ) {
    amount += 2;
  }

  return amount;
}

export type CompleteKingdomChoreAction = {
  type: "kingdomChore.completed";
  id?: number;
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
  const { chores, bumpkin } = game;

  if (game.kingdomChores === undefined) {
    throw new Error("No kingdom chores found");
  }

  return game;
}
