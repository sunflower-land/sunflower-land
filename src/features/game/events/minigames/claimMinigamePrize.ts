import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import {
  MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";
import { GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { getFactionWeek } from "features/game/lib/factions";

export function isMinigameComplete({
  game,
  name,
  now = new Date(),
}: {
  game: GameState;
  name: MinigameName;
  now?: Date;
}) {
  const minigames = (game.minigames ?? {}) as Required<GameState>["minigames"];
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
  return history.highscore >= prize.score;
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
  const game = cloneDeep<GameState>(state);

  if (!SUPPORTED_MINIGAMES.includes(action.id)) {
    throw new Error(`${action.id} is not a valid minigame`);
  }

  const minigames = (game.minigames ?? {}) as Required<GameState>["minigames"];
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
  if (history.highscore < prize.score) {
    throw new Error(`Score ${history.highscore} is less than ${prize.score}`);
  }

  // Has already claimed
  if (history.prizeClaimedAt) {
    throw new Error(`Already claimed ${action.id} prize`);
  }

  // Claim prize
  history.prizeClaimedAt = createdAt;

  // Claim coins
  if (prize.coins) {
    game.coins += prize.coins;
  }

  // Claims items
  getKeys(prize.items).forEach((name) => {
    const count = game.inventory[name] ?? new Decimal(0);

    game.inventory[name] = count.add(prize.items[name] ?? 0);
  });

  // Claims wearables
  getKeys(prize.wearables).forEach((name) => {
    const count = game.wardrobe[name] ?? 0;

    game.wardrobe[name] = count + (prize.wearables[name] ?? 0);
  });

  if (game.faction && prize.items.Mark) {
    const week = getFactionWeek({ date: new Date(createdAt) });
    const leaderboard = game.faction.history[week] ?? {
      score: 0,
      petXP: 0,
    };

    game.faction.history[week] = {
      ...leaderboard,
      score: leaderboard.score + prize.items.Mark,
    };
  }

  return game;
}
