import Decimal from "decimal.js-light";
import {
  type MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";
import type {
  GameState,
  MinigameHistory,
  MinigamePrize,
} from "features/game/types/game";
import { getKeys } from "lib/object";
import { getWeekKey } from "features/game/lib/factions";
import { produce } from "immer";

/**
 * What a claim pays: the prize itself once today's best reaches its score, or
 * for a tiered prize the highest tier the latest run reached.
 */
export function getMinigamePrizeReward({
  prize,
  history,
}: {
  prize: MinigamePrize;
  history: MinigameHistory;
}): Pick<MinigamePrize, "coins" | "items" | "wearables"> | undefined {
  if (!prize.tiers) {
    return history.highscore >= prize.score ? prize : undefined;
  }

  const score = history.lastScore ?? 0;
  const tier = [...prize.tiers].reverse().find((tier) => score >= tier.score);

  return tier && { coins: 0, items: tier.items, wearables: {} };
}

export function isMinigameComplete({
  minigames,
  name,
  now = new Date(),
}: {
  minigames: GameState["minigames"];
  name: MinigameName;
  now?: Date;
}) {
  const { games, prizes } = minigames;

  const todayKey = new Date(now).toISOString().slice(0, 10);

  // Get todays prize
  const prize = prizes[name];

  if (!prize) {
    return false;
  }

  const minigame = games[name];
  const history = minigame?.history[todayKey];

  if (!history) {
    return false;
  }

  // Has reached score
  return !!getMinigamePrizeReward({ prize, history });
}

export type ClaimMinigamePrizeAction = {
  type: "minigame.prizeClaimed";
  id: MinigameName;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimMinigamePrizeAction;
  createdAt?: number;
};

export function claimMinigamePrize({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!SUPPORTED_MINIGAMES.includes(action.id)) {
      throw new Error(`${action.id} is not a valid minigame`);
    }

    const minigames = (game.minigames ??
      {}) as Required<GameState>["minigames"];
    const { games, prizes } = minigames;

    const todayKey = new Date(createdAt).toISOString().slice(0, 10);

    // Get todays prize
    const prize = prizes[action.id];

    if (!prize) {
      throw new Error(`No prize found for ${action.id}`);
    }

    if (createdAt < prize.startAt || createdAt > prize.endAt) {
      throw new Error("Prize is no longer available");
    }

    const minigame = games[action.id];
    const history = minigame?.history[todayKey];

    // has not played
    if (!history) {
      throw new Error(`No history found for ${action.id}`);
    }

    // Has reached score
    const reward = getMinigamePrizeReward({ prize, history });

    if (!reward) {
      const score = prize.tiers ? (history.lastScore ?? 0) : history.highscore;
      throw new Error(`Score ${score} is less than ${prize.score}`);
    }

    // Has already claimed
    if (history.prizeClaimedAt && action.id !== "halloween-2026-game-2") {
      throw new Error(`Already claimed ${action.id} prize`);
    }

    // Claim prize
    history.prizeClaimedAt = createdAt;

    // Claim coins
    if (reward.coins) {
      game.coins += reward.coins;
    }

    // Claims items
    getKeys(reward.items).forEach((name) => {
      const count = game.inventory[name] ?? new Decimal(0);

      game.inventory[name] = count.add(reward.items[name] ?? 0);
    });

    // Claims wearables
    getKeys(reward.wearables).forEach((name) => {
      const count = game.wardrobe[name] ?? 0;

      game.wardrobe[name] = count + (reward.wearables[name] ?? 0);
    });

    if (game.faction && reward.items.Mark) {
      const week = getWeekKey({ date: new Date(createdAt) });
      const leaderboard = game.faction.history[week] ?? {
        score: 0,
        petXP: 0,
      };

      game.faction.history[week] = {
        ...leaderboard,
        score: leaderboard.score + reward.items.Mark,
      };
    }

    return game;
  });
}
