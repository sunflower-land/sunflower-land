import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import {
  DAILY_CHALLENGES,
  ONBOARDING_CHALLENGES,
} from "features/game/types/rewards";
import { getKeys } from "features/game/types/decorations";

export type CompleteDailyChallengeAction = {
  type: "dailyChallenge.completed";
};

type Options = {
  state: Readonly<GameState>;
  action: CompleteDailyChallengeAction;
  createdAt?: number;
};

export const RICHIE_ONBOARDING_MS = 7 * 24 * 60 * 60 * 1000;

export function isOnboardingChallenges({ game }: { game: GameState }) {
  const { completed } = game.rewards.challenges;

  const isOnboarding = completed < ONBOARDING_CHALLENGES.length;
  // && game.createdAt > Date.now() - RICHIE_ONBOARDING_MS;

  return isOnboarding;
}

export function completeDailyChallenge({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep<GameState>(state);
  const { rewards, bumpkin } = game;

  const { challenges } = rewards;
  const { active } = challenges;

  const isOnboarding = isOnboardingChallenges({ game });

  // Normal daily challenges not yet implemented
  if (!isOnboarding) {
    throw new Error("Onboarding has ended");
  }

  const tasks = ONBOARDING_CHALLENGES;

  const task = tasks[active.index];

  // Check if already completed
  if (!!active.completedAt) {
    throw new Error("Task is not yet available");
  }

  const progress = task.progress({ game });

  if (progress < task.requirement) {
    throw new Error("Daily challenge is not completed");
  }

  challenges.active.completedAt = createdAt;

  if (task.reward.coins) {
    game.coins += task.reward.coins;
  }

  if (task.reward.items) {
    getKeys(task.reward.items ?? {}).forEach((name) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous?.add(task.reward.items?.[name] ?? 0);
    });
  }

  if (task.reward.wearables) {
    getKeys(task.reward.wearables ?? {}).forEach((name) => {
      const previous = game.wardrobe[name] ?? 0;
      game.wardrobe[name] = previous + (task.reward.wearables?.[name] ?? 0);
    });
  }

  // While onboarding, let them complete instantly
  if (isOnboarding) {
    const hasFinished = active.index >= ONBOARDING_CHALLENGES.length - 1;

    challenges.active = {
      index: hasFinished ? 0 : challenges.active.index + 1,
      startCount: 0,
      completedAt: undefined,
    };
  }

  challenges.completed += 1;

  return game;
}
