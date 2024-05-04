import { GameState } from "features/game/types/game";
import {
  MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";
import cloneDeep from "lodash.clonedeep";

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
    throw new Error(`${action.id} is not a valid portal`);
  }

  const minigames = (game.minigames ?? {}) as Required<GameState>["minigames"];
  const { games, prizes } = minigames;

  const todayKey = new Date(createdAt).toISOString().slice(0, 10);

  // Get todays prize
  const prize = prizes[action.id];

  if (!prize) {
    throw new Error(`No prize found for ${action.id}`);
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
  const claimedAt = games[action.id]?.prizeClaimedAt ?? 0;
  if (!!claimedAt) {
    throw new Error(`Already claimed ${action.id} prize`);
  }

  // Claim prize
  minigame.prizeClaimedAt = createdAt;

  // Claim points

  return game;
}
