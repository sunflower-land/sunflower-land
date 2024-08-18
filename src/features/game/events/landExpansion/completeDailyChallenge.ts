import { GameState } from "features/game/types/game";
import {
  DAILY_CHALLENGES,
  ONBOARDING_CHALLENGES,
} from "features/game/types/rewards";
import cloneDeep from "lodash.clonedeep";

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

  const isOnboarding =
    completed < ONBOARDING_CHALLENGES.length &&
    game.createdAt > Date.now() - RICHIE_ONBOARDING_MS;

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

  // While onboarding, let them complete instantly
  if (isOnboarding) {
    const hasFinished = active.index >= ONBOARDING_CHALLENGES.length - 1;

    const nextTask = hasFinished
      ? DAILY_CHALLENGES[0]
      : tasks[active.index + 1];

    challenges.active = {
      index: hasFinished ? 0 : challenges.active.index + 1,
      startCount: 0,
      completedAt: undefined,
    };
  }

  challenges.completed += 1;

  return game;
}
