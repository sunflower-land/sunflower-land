import cloneDeep from "lodash.clonedeep";
import { startChore } from "./startChore";
import { GameState } from "features/game/types/game";
import { getProgress } from "features/helios/components/hayseedHank/lib/HayseedHankTask";
import { trackActivity } from "features/game/types/bumpkinActivity";

export type SkipChoreAction = {
  type: "chore.skipped";
};

type Options = {
  state: Readonly<GameState>;
  action: SkipChoreAction;
  createdAt?: number;
};

export function skipChore({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  let game = cloneDeep(state);
  const { hayseedHank } = game;

  if (!game.bumpkin) {
    throw new Error("No Bumpkin Found");
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
    createdAt,
  });

  return game;
}
