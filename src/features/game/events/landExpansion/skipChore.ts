import cloneDeep from "lodash.clonedeep";
import { startChore } from "./startChore";
import { GameState } from "features/game/types/game";
import { getProgress } from "features/helios/components/hayseedHank/lib/HayseedHankTask";
import { trackActivity } from "features/game/types/bumpkinActivity";
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

export function skipWitchesEveChore({
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

export function skipDawnBreakerChore({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  let game = cloneDeep(state);
  const { hayseedHank } = game;

  if (!game.bumpkin) {
    throw new Error("No Bumpkin Found");
  }

  if (!hayseedHank) {
    throw new Error("No Hayseed Hank Found");
  }

  if (!hayseedHank.progress) {
    throw new Error("Chore has not started");
  }

  if (game.bumpkin.id !== hayseedHank.progress?.bumpkinId) {
    throw new Error("Not the same Bumpkin");
  }

  const progress = getProgress(game);

  if (progress > hayseedHank.chore.requirement) {
    throw new Error("Chore is completed");
  }

  const twentyFourHoursAgo = createdAt - 86400000;

  //return game if chore has started less than 24hrs from createdAt
  if (hayseedHank.progress.startedAt > twentyFourHoursAgo) {
    return game;
  }

  hayseedHank.dawnBreakerChoresSkipped =
    hayseedHank.dawnBreakerChoresSkipped || 0;

  hayseedHank.dawnBreakerChoresSkipped += 1;

  // Remove the progress object from Hayseed Hank as the chore has been skipped
  delete hayseedHank.progress;

  // Increment activity
  game.bumpkin.activity = trackActivity("Chore Skipped", game.bumpkin.activity);

  // Automatically start next chore
  game = startChore({
    state: game,
    action: {
      type: "chore.started",
    },
    createdAt,
  });

  return game;
}

export function skipChore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  if (state.chores) {
    return skipWitchesEveChore({ state, createdAt, action });
  }

  return skipDawnBreakerChore({ state, createdAt, action });
}
