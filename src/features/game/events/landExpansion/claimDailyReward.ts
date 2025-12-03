import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";
import {
  DailyRewardDefinition,
  getRewardsForStreak,
} from "features/game/types/dailyRewards";
import { produce } from "immer";
import { getBumpkinLevel } from "features/game/lib/level";

export type ClaimDailyRewardAction = {
  type: "dailyReward.claimed";
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimDailyRewardAction;
  createdAt?: number;
};

export function isDailyRewardReady({
  state,
  now = Date.now(),
}: {
  state: GameState;
  now?: number;
}): boolean {
  // Do not give them daily reward until level 3
  if (getBumpkinLevel(state.bumpkin?.experience ?? 0) < 3) {
    return false;
  }

  if (!state.dailyRewards) {
    return true;
  }

  const dateKey = new Date(state.dailyRewards.chest?.collectedAt ?? 0)
    .toISOString()
    .slice(0, 10);
  const currentDateKey = new Date(now).toISOString().slice(0, 10);

  return dateKey !== currentDateKey;
}

export function getDailyRewardStreak({
  state,
  now,
}: {
  state: GameState;
  now: number;
}): number {
  if (!state.dailyRewards) {
    return 0;
  }

  const streak = state.dailyRewards.streaks ?? 0;

  // If missed the day, reset the streak
  const collectedDate = new Date(state.dailyRewards.chest?.collectedAt ?? 0)
    .toISOString()
    .substring(0, 10);
  const currentDate = new Date(now).toISOString().substring(0, 10);

  // Calculate the day difference
  const dayDifference =
    (new Date(currentDate).getTime() - new Date(collectedDate).getTime()) /
    (1000 * 60 * 60 * 24);

  // Reset streaks if they miss a day
  if (dayDifference > 1) {
    return 0;
  }

  return streak;
}

export function claimDailyReward({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!game.dailyRewards) {
      game.dailyRewards = { streaks: 0 };
    }

    if (!isDailyRewardReady({ state: game, now: createdAt })) {
      throw new Error("Daily reward not ready");
    }

    const currentStreak = getDailyRewardStreak({ state: game, now: createdAt });

    const rewards = getRewardsForStreak({
      game,
      streak: currentStreak,
      now: createdAt,
    });

    rewards.forEach((reward) => applyReward(game, reward));
    const newStreak = currentStreak + 1;

    game.dailyRewards.streaks = newStreak;
    game.dailyRewards.chest = {
      code: (game.dailyRewards.chest?.code ?? 0) + 1, // Legacy

      collectedAt: createdAt,
    };
  });
}

function applyReward(game: GameState, reward: DailyRewardDefinition) {
  if (reward.items) {
    Object.entries(reward.items).forEach(([itemName, amount]) => {
      if (!amount) return;

      const name = itemName as InventoryItemName;
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(new Decimal(amount));
    });
  }

  if (reward.coins) {
    game.coins += reward.coins;
  }

  if (reward.sfl) {
    game.balance = game.balance.add(reward.sfl);
  }
}
