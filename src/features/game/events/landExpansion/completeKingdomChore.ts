import Decimal from "decimal.js-light";
import { Bumpkin, GameState, KingdomChore } from "features/game/types/game";
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

type Props = {
  bumpkin: Bumpkin | undefined;
  choresCompleted: number[];
  choresSkipped: number[];
  existingActiveChores: Record<
    number,
    { startCount: number; startedAt: number }
  >;
  createdAt: number;
  chores: Record<number, KingdomChore>;
};

export function makeActiveChores({
  bumpkin,
  choresCompleted,
  existingActiveChores,
  choresSkipped,
  createdAt,
  chores,
}: Props) {
  const activeChores = Object.entries(chores)
    .filter(([key]) => !choresCompleted.includes(Number(key)))
    .filter(([key]) => !choresSkipped.includes(Number(key)))
    .slice(0, 3)
    .map(([key, choreName]) => {
      return [
        key,
        {
          startCount:
            existingActiveChores[Number(key)]?.startCount ??
            bumpkin?.activity?.[choreName.activity] ??
            0,
          startedAt: createdAt,
        },
      ];
    });

  return Object.fromEntries(activeChores);
}

export function makeKingdomChores(
  choresCompleted: number[],
  choresSkipped: number[],
  existingChores: Record<number, KingdomChore>
): Record<number, KingdomChore> {
  const chores = Object.entries(existingChores)
    .filter(([key]) => !choresCompleted.includes(Number(key)))
    .filter(([key]) => !choresSkipped.includes(Number(key)))
    .slice(0, 9);

  return Object.fromEntries(chores);
}

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

  if (kingdomChores.weeklyChoresCompleted.includes(id)) {
    throw new Error("Chore is already completed");
  }

  if (kingdomChores.weeklyChoresSkipped.includes(id)) {
    throw new Error("Chore was already skipped");
  }

  if (kingdomChores.activeChores[id] === undefined) {
    throw new Error("Chore is not active");
  }

  const progress =
    bumpkin?.activity?.[chore.activity] ??
    0 - kingdomChores.activeChores[id].startCount;

  if (progress < chore.requirement) {
    throw new Error("Chore is not completed");
  }

  kingdomChores.weeklyChoresCompleted = [
    ...kingdomChores.weeklyChoresCompleted,
    id,
  ];

  kingdomChores.choresCompleted += 1;

  delete kingdomChores.activeChores[id];

  kingdomChores.activeChores = makeActiveChores({
    bumpkin,
    choresCompleted: kingdomChores.weeklyChoresCompleted,
    choresSkipped: kingdomChores.weeklyChoresSkipped,
    existingActiveChores: kingdomChores.activeChores,
    createdAt,
    chores: kingdomChores.chores,
  });

  kingdomChores.chores = makeKingdomChores(
    kingdomChores.weeklyChoresCompleted,
    kingdomChores.weeklyChoresSkipped,
    kingdomChores.chores
  );

  const previousMarks = inventory["Mark"] ?? new Decimal(0);
  inventory["Mark"] = previousMarks.add(chore.marks);

  return game;
}
