import { GameState } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";
import { trackFarmActivity } from "../types/farmActivity";
import Decimal from "decimal.js-light";
import { getObjectEntries } from "lib/object";

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
  now,
  game,
}: {
  readyAt: number;
  now: number;
  game: GameState;
}) {
  const secondsLeft = (readyAt - now) / 1000;

  let gems = new Decimal(140);

  const entry = getObjectEntries(SECONDS_TO_GEMS).find(
    ([threshold]) => secondsLeft <= threshold,
  );
  if (entry) {
    gems = new Decimal(entry[1]);
  }

  const today = new Date(now).toISOString().substring(0, 10);
  const gemsSpentToday = game.gems?.history?.[today]?.spent ?? 0;

  const multiplier = new Decimal(gemsSpentToday).div(100);
  gems = new Decimal(gems)
    .mul(new Decimal(1.2).pow(multiplier))
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP);

  return gems.toNumber();
}

/**
 * React Hook to get the instant gems for a building or collectible
 * @param readyAt - The readyAt timestamp of the building or collectible
 * @param game - The game state
 * @returns The instant gems
 */
export function useRealTimeInstantGems({
  readyAt,
  game,
}: {
  readyAt: number;
  game: GameState;
}) {
  const now = useNow({ live: true, autoEndAt: readyAt });
  return getInstantGems({ readyAt, now, game });
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
      spent: new Decimal(game.gems.history[today]?.spent ?? 0)
        .add(amount)
        .toNumber(),
    },
  };

  game.farmActivity = trackFarmActivity("Gems Spent", game.farmActivity);

  return game;
}
