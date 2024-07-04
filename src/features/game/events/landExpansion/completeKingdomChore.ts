import Decimal from "decimal.js-light";
import { Bumpkin, GameState, KingdomChores } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export function populateKingdomChores(
  kingdomChores: KingdomChores | undefined,
  bumpkin: Bumpkin | undefined,
  createdAt: number,
): KingdomChores {
  let nextKingdomChores = cloneDeep(kingdomChores);

  if (nextKingdomChores === undefined) {
    nextKingdomChores = {
      chores: [],
      choresCompleted: 0,
      choresSkipped: 0,
    };
  }

  const updatedChores = nextKingdomChores?.chores;

  // Ensure the first three chores are started
  updatedChores
    .filter(
      (chore) =>
        chore.completedAt === undefined && chore.skippedAt === undefined,
    )
    .slice(0, 3)
    .forEach((chore) => {
      chore.startedAt = chore.startedAt ?? createdAt;
      chore.startCount =
        chore.startCount ?? bumpkin?.activity?.[chore.activity] ?? 0;
    });

  nextKingdomChores.chores = updatedChores;

  return nextKingdomChores;
}

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
  const { kingdomChores, bumpkin, inventory } = game;

  const chore = kingdomChores.chores[id];

  if (chore === undefined) {
    throw new Error("Chore not found");
  }

  if (!bumpkin) {
    throw new Error("No bumpkin found");
  }

  if (chore.completedAt !== undefined) {
    throw new Error("Chore is already completed");
  }

  if (chore.skippedAt !== undefined) {
    throw new Error("Chore was already skipped");
  }

  if (chore.startedAt === undefined) {
    throw new Error("Chore is not active");
  }

  const progress =
    (bumpkin?.activity?.[chore.activity] ?? 0) - chore.startCount;

  if (progress < chore.requirement) {
    throw new Error("Chore is not completed");
  }

  chore.completedAt = createdAt;

  kingdomChores.choresCompleted += 1;
  game.kingdomChores = populateKingdomChores(kingdomChores, bumpkin, createdAt);

  const previousMarks = inventory["Mark"] ?? new Decimal(0);
  inventory["Mark"] = previousMarks.add(chore.marks);

  return game;
}
