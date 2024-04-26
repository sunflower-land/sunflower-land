import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { CHORES } from "features/game/types/chores";
import { getKeys } from "features/game/types/craftables";
import { ChoreV2Name, GameState } from "features/game/types/game";
import { getProgress } from "features/helios/components/hayseedHank/lib/HayseedHankTask";
import { CONFIG } from "lib/config";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import cloneDeep from "lodash.clonedeep";
import { startChore } from "./startChore";
import { getSeasonalTicket } from "features/game/types/seasons";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { FACTION_POINT_MULTIPLIER } from "./deliver";

export type CompleteChoreAction = {
  type: "chore.completed";
  id?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: CompleteChoreAction;
  createdAt?: number;
  farmId?: number;
};

const clone = (state: GameState): GameState => {
  return cloneDeep(state);
};

function completeDawnBreakerChore({
  state,
  createdAt = Date.now(),
  farmId = 0,
}: Options): GameState {
  let game = clone(state);
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

  const { tasksAreFrozen } = getSeasonChangeover({
    id: farmId,
    now: createdAt,
  });

  if (tasksAreFrozen) {
    throw new Error("Chores are frozen");
  }

  const progress = getProgress(game);

  if (progress < hayseedHank.chore.requirement) {
    throw new Error("Chore is not completed");
  }

  // Add rewards
  getKeys(hayseedHank.chore.reward.items ?? {}).forEach((name) => {
    const previous = game.inventory[name] ?? new Decimal(0);
    game.inventory[name] = previous.add(
      hayseedHank.chore.reward.items?.[name] ?? 0
    );
  });

  const choreIndex = (hayseedHank.choresCompleted + 1) % CHORES.length;
  const nextChore = CHORES[choreIndex + 1];

  // Front-end testing only - real chore is hidden as a surpise on the backend
  if (!CONFIG.API_URL) {
    hayseedHank.chore = nextChore;
  }

  hayseedHank.choresCompleted += 1;
  delete hayseedHank.progress;

  // Increment activity
  game.bumpkin.activity = trackActivity(
    "Chore Completed",
    game.bumpkin.activity
  );

  if (hayseedHank.choresCompleted === 1) {
    game.conversations.push("betty-intro");
  }

  if (hayseedHank.choresCompleted === 2) {
    game.conversations.push("bruce-intro");
  }

  if (hayseedHank.choresCompleted === 3) {
    game.conversations.push("blacksmith-intro");
  }

  if (hayseedHank.choresCompleted === 4) {
    // TODO - once scarecrow gets crafted
    // game.conversations.push("hank-crafting");
  }

  /* TODO
    1. Betty's Water Well Conversation
    2. Job Board Conversation
    2. Kitchen Conversation
    3. Hen House Conversation
    4. Fruit Conversation
  */

  // Automatically start next chore
  if (!CONFIG.API_URL) {
    game = startChore({
      state: game,
      action: {
        type: "chore.started",
      },
    });
  }

  onboardingAnalytics.logEvent("chore_complete", {
    choreIndex,
  });

  return game;
}

export const isChoreId = (id: number): id is ChoreV2Name => id in ChoreV2Name;

function completeWitchesEveChore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep<GameState>(state);
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

  const progress = bumpkin?.activity?.[chore.activity] ?? 0 - chore.startCount;

  if (progress < chore.requirement) {
    throw new Error("Chore is not completed");
  }

  const ticket = getSeasonalTicket();
  const previous = game.inventory[ticket] ?? new Decimal(0);
  game.inventory[ticket] = previous.add(chore.tickets);

  if (game.faction) {
    game.faction.points =
      game.faction.points + chore.tickets * FACTION_POINT_MULTIPLIER;
  }

  chore.completedAt = createdAt;
  chores.choresCompleted += 1;

  return game;
}

export function completeChore({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  if (state.chores) {
    return completeWitchesEveChore({ state, action, createdAt });
  }

  return completeDawnBreakerChore({ state, action, createdAt });
}
