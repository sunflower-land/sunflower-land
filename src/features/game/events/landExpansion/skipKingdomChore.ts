import { GameState } from "features/game/types/game";
import { populateKingdomChores } from "./completeKingdomChore";
import { produce } from "immer";

export type SkipKingdomChoreAction = {
  type: "kingdomChore.skipped";
  id: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SkipKingdomChoreAction;
  createdAt?: number;
};

export function skipKingdomChore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { id } = action;
    const { kingdomChores, bumpkin } = game;

    const chore = kingdomChores.chores[id];

    if (!bumpkin) {
      throw new Error("No bumpkin found");
    }

    if (chore === undefined) {
      throw new Error("Chore not found");
    }

    if ((kingdomChores.skipAvailableAt ?? 0) > createdAt) {
      throw new Error("Skip is not available");
    }

    if (chore.startedAt === undefined) {
      throw new Error("Chore is not active");
    }

    if (chore.completedAt !== undefined) {
      throw new Error("Chore is already completed");
    }

    if (chore.skippedAt !== undefined) {
      throw new Error("Chore was already skipped");
    }

    chore.skippedAt = createdAt;
    kingdomChores.skipAvailableAt = createdAt + 24 * 60 * 60 * 1000;
    kingdomChores.choresSkipped += 1;

    game.kingdomChores = populateKingdomChores(
      kingdomChores,
      game.farmActivity,
      createdAt,
    );

    return game;
  });
}
