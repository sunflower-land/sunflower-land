import Decimal from "decimal.js-light";
import {
  DailyRewards,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import {
  DailyRewardDefinition,
  getRewardsForStreak,
} from "features/game/types/dailyRewards";
import { produce } from "immer";
import { getBumpkinLevel } from "features/game/lib/level";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { applyBuff } from "features/game/types/buffs";

export type ClaimDailyRewardAction = {
  type: "dailyReward.claimed";
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimDailyRewardAction;
  createdAt?: number;
};

export function isDailyRewardReady({
  bumpkinExperience,
  dailyRewards,
  now = Date.now(),
}: {
  bumpkinExperience: number;
  dailyRewards?: DailyRewards;
  now?: number;
}): boolean {
  // Do not give them daily reward until level 3
  if (getBumpkinLevel(bumpkinExperience) < 3) {
    return false;
  }

  if (!dailyRewards) {
    return true;
  }

  const dateKey = new Date(dailyRewards.chest?.collectedAt ?? 0)
    .toISOString()
    .slice(0, 10);
  const currentDateKey = new Date(now).toISOString().slice(0, 10);

  return dateKey !== currentDateKey;
}

export function getDailyRewardStreak({
  game,
  dailyRewards,
  currentDate,
}: {
  game: GameState;
  dailyRewards?: DailyRewards;
  currentDate: string;
}): number {
  if (!dailyRewards) {
    return 0;
  }

  const streak = dailyRewards.streaks ?? 0;

  // If they are a new player, don't ruin a streak.
  if (streak <= 6 && (game.farmActivity["Daily Reward Collected"] ?? 0) <= 6) {
    return streak;
  }

  // If missed the day, reset the streak
  const collectedDate = new Date(dailyRewards.chest?.collectedAt ?? 0)
    .toISOString()
    .substring(0, 10);

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

    if (
      !isDailyRewardReady({
        dailyRewards: game.dailyRewards,
        bumpkinExperience: game.bumpkin?.experience ?? 0,
        now: createdAt,
      })
    ) {
      throw new Error("Daily reward not ready");
    }

    const currentDate = new Date(createdAt).toISOString().substring(0, 10);

    const currentStreak = getDailyRewardStreak({
      game,
      dailyRewards: game.dailyRewards,
      currentDate,
    });

    const rewards = getRewardsForStreak({
      game,
      streak: currentStreak,
      currentDate,
    });

    rewards.forEach((reward) => applyReward(game, reward));
    const newStreak = currentStreak + 1;

    game.dailyRewards!.streaks = newStreak;
    game.dailyRewards!.chest = {
      code: (game.dailyRewards!.chest?.code ?? 0) + 1, // Legacy

      collectedAt: createdAt,
    };

    game.farmActivity = trackFarmActivity(
      "Daily Reward Collected",
      game.farmActivity,
    );
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

  if (reward.xp && game.bumpkin) {
    game.bumpkin.experience += reward.xp;
  }

  if (reward.buff) {
    const buffedGame = applyBuff({ buff: reward.buff, game });
    Object.assign(game, buffedGame);
  }
}
