import { GameState } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";
import { trackFarmActivity } from "../types/farmActivity";
import Decimal from "decimal.js-light";
import { getObjectEntries } from "lib/object";
import { isCollectibleBuilt } from "./collectibleBuilt";

export const COINS_PER_GEM = 50;
export const DAILY_COIN_SPEEDUP_LIMIT = 20_000;

export type SpeedUpPaymentMethod = "gems" | "coins";

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

const EXPONENTIAL_MULTIPLIER = 1.15;

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

  let gems: Decimal;
  const thresholds = getObjectEntries(SECONDS_TO_GEMS);

  const threshold = thresholds.find(([threshold]) => secondsLeft <= threshold);

  if (threshold) {
    gems = new Decimal(threshold[1]);
  } else {
    const lastThreshold = thresholds[thresholds.length - 1];
    gems = new Decimal(lastThreshold[1]);
  }

  const today = new Date(now).toISOString().substring(0, 10);
  const gemsSpentToday = game.gems.history?.[today]?.spent ?? 0;

  const multiplier = new Decimal(gemsSpentToday).div(100);

  gems = new Decimal(gems)
    .mul(new Decimal(EXPONENTIAL_MULTIPLIER).pow(multiplier))
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
  const previous = game.gems.history?.[today];

  // Remove other dates, but preserve today's coinsSpent so a gem-paid
  // speed-up cannot reset the daily coin cap counter.
  game.gems.history = {
    [today]: {
      ...previous,
      spent: new Decimal(previous?.spent ?? 0).add(amount).toNumber(),
    },
  };

  game.farmActivity = trackFarmActivity(
    "Instant Gems Spent",
    game.farmActivity,
    new Decimal(amount),
  );

  return game;
}

export function getInstantCoins({
  readyAt,
  now,
  game,
}: {
  readyAt: number;
  now: number;
  game: GameState;
}): number {
  return getInstantGems({ readyAt, now, game }) * COINS_PER_GEM;
}

export function useRealTimeInstantCoins({
  readyAt,
  game,
}: {
  readyAt: number;
  game: GameState;
}) {
  const now = useNow({ live: true, autoEndAt: readyAt });
  return getInstantCoins({ readyAt, now, game });
}

export function hasDinoEggTrophyBoost(game: GameState): boolean {
  return isCollectibleBuilt({ name: "Dino Egg Trophy", game });
}

export function getCoinsSpentOnSpeedUpsToday(
  game: GameState,
  now: number,
): number {
  const today = new Date(now).toISOString().substring(0, 10);
  return game.gems.history?.[today]?.coinsSpent ?? 0;
}

/**
 * Charges the player coins for a speed-up (Dino Egg Trophy boost). Throws if
 * the trophy is not placed, the daily coin cap would be exceeded, or the
 * player has insufficient coins.
 *
 * The gem-equivalent is also added to `gems.history[today].spent` so that the
 * exponential gem-cost ramp keeps applying regardless of payment method —
 * players cannot dodge the daily ramp by switching to coins.
 */
export function chargeCoinsForSpeedUp({
  game,
  gems,
  createdAt,
}: {
  game: GameState;
  gems: number;
  createdAt: number;
}): GameState {
  if (!hasDinoEggTrophyBoost(game)) {
    throw new Error("Dino Egg Trophy required");
  }

  const coins = gems * COINS_PER_GEM;
  const spentToday = getCoinsSpentOnSpeedUpsToday(game, createdAt);

  if (spentToday + coins > DAILY_COIN_SPEEDUP_LIMIT) {
    throw new Error("Daily coin speed-up limit reached");
  }

  if (game.coins < coins) {
    throw new Error("Insufficient coins");
  }

  game.coins -= coins;

  const today = new Date(createdAt).toISOString().substring(0, 10);
  const prev = game.gems.history?.[today] ?? { spent: 0 };

  // Remove other dates (consistent with makeGemHistory).
  game.gems.history = {
    [today]: {
      spent: new Decimal(prev.spent).add(gems).toNumber(),
      coinsSpent: new Decimal(prev.coinsSpent ?? 0).add(coins).toNumber(),
    },
  };

  // Coin payments are only counted under "Instant Coins Spent" — the
  // gem-equivalent is recorded in `gems.history[today].spent` (above) so the
  // exponential ramp keeps applying, but downstream analytics that read
  // "Instant Gems Spent" should only see actual gem burns.
  game.farmActivity = trackFarmActivity(
    "Instant Coins Spent",
    game.farmActivity,
    new Decimal(coins),
  );

  return game;
}
