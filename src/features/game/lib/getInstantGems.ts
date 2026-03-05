import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";

const SECONDS_TO_GEMS = {
  60: 1,
  [5 * 60]: 2,
  [10 * 60]: 3,
  [30 * 60]: 4,
  [60 * 60]: 5,
  [2 * 60 * 60]: 8,
  [4 * 60 * 60]: 14,
  [6 * 60 * 60]: 20,
  [8 * 60 * 60]: 22,
  [12 * 60 * 60]: 25,
  [24 * 60 * 60]: 40,
  [36 * 60 * 60]: 60,
  [48 * 60 * 60]: 80,
  [72 * 60 * 60]: 110,
  [96 * 60 * 60]: 140,
};

export function getInstantGems({
  readyAt,
  now = Date.now(),
  game,
}: {
  readyAt: number;
  now?: number;
  game: GameState;
}) {
  const secondsLeft = (readyAt - now) / 1000;

  const thresholds = getKeys(SECONDS_TO_GEMS);

  let gems = 100;

  for (let i = 0; i < thresholds.length; i++) {
    if (thresholds[i] >= secondsLeft) {
      gems = SECONDS_TO_GEMS[thresholds[i]];
      break;
    }
  }

  const today = new Date(now).toISOString().substring(0, 10);
  const gemsSpentToday = game.gems.history?.[today]?.spent ?? 0;

  if (gemsSpentToday >= 100) {
    const multiplier = Math.floor(gemsSpentToday / 100);
    gems += Math.floor(0.2 * multiplier * gems);
  }

  return gems;
}

export function makeGemHistory({
  game,
  amount,
  createdAt,
}: {
  game: GameState;
  amount: number;
  createdAt: number;
}): GameState {
  const today = new Date(createdAt).toISOString().substring(0, 10);

  game.gems.history = game.gems.history ?? {};

  // Remove other dates
  game.gems.history = {
    [today]: {
      spent: (game.gems.history[today]?.spent ?? 0) + amount,
    },
  };

  return game;
}
