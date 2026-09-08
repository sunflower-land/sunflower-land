import { useState } from "react";
import type { GameState } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";
import {
  COINS_PER_GEM,
  DAILY_COIN_SPEEDUP_LIMIT,
  getCoinsSpentOnSpeedUpsToday,
  hasDinoEggTrophyBoost,
  type SpeedUpPaymentMethod,
  useRealTimeInstantGems,
} from "./getInstantGems";

export type UseSpeedUpPayment = ReturnType<typeof useSpeedUpPayment>;

/**
 * Pure payment maths behind {@link useSpeedUpPayment}, split out so it can be
 * unit tested without rendering a component.
 */
export function getSpeedUpPaymentOptions({
  game,
  gemCost,
  now,
}: {
  game: GameState;
  gemCost: number;
  now: number;
}) {
  const coinCost = gemCost * COINS_PER_GEM;

  const canPayWithCoins = hasDinoEggTrophyBoost(game);
  const coinsSpentToday = getCoinsSpentOnSpeedUpsToday(game, now);

  // Matches the reducer's gate: `spentToday + coinCost > LIMIT`. Named
  // explicitly so callers can't mistake it for "already at the cap".
  const wouldExceedDailyCoinLimit =
    coinsSpentToday + coinCost > DAILY_COIN_SPEEDUP_LIMIT;

  const hasEnoughGems = !!game.inventory.Gem?.gte(gemCost);
  const hasEnoughCoins = game.coins >= coinCost;
  const coinsAvailable =
    canPayWithCoins && !wouldExceedDailyCoinLimit && hasEnoughCoins;

  // Gems stay the default, but a player who can't cover the gem cost starts on
  // coins when the Dino Egg Trophy makes them payable. Otherwise the speed-up
  // button is disabled on `canAfford`, and in the modals where the payment
  // selector lives *behind* that button (cooking, crafting) a player with no
  // gems can never reach the coin option — the trophy becomes unusable.
  const defaultPaymentMethod: SpeedUpPaymentMethod =
    !hasEnoughGems && coinsAvailable ? "coins" : "gems";

  return {
    coinCost,
    canPayWithCoins,
    coinsSpentToday,
    wouldExceedDailyCoinLimit,
    hasEnoughGems,
    hasEnoughCoins,
    coinsAvailable,
    defaultPaymentMethod,
  };
}

export function useSpeedUpPayment({
  readyAt,
  game,
}: {
  readyAt: number;
  game: GameState;
}) {
  const now = useNow({ live: true, autoEndAt: readyAt });
  const gemCost = useRealTimeInstantGems({ readyAt, game });

  const {
    coinCost,
    canPayWithCoins,
    coinsSpentToday,
    wouldExceedDailyCoinLimit,
    hasEnoughGems,
    hasEnoughCoins,
    coinsAvailable,
    defaultPaymentMethod,
  } = getSpeedUpPaymentOptions({ game, gemCost, now });

  // Latched on mount: the gem cost ticks down as `readyAt` approaches, so
  // recomputing the default every render could silently flip a player from
  // coins back to gems while they are looking at the confirmation modal.
  const [paymentMethod, setPaymentMethod] =
    useState<SpeedUpPaymentMethod>(defaultPaymentMethod);

  // Transparently fall back to gems whenever coins aren't actually usable —
  // missing trophy, cap would be exceeded, or insufficient coin balance.
  // Without this, the UI can stay on a coin selection that the reducer will
  // reject, leaving the user stuck on an unfulfillable payment.
  const effectiveMethod: SpeedUpPaymentMethod =
    paymentMethod === "coins" && coinsAvailable ? "coins" : "gems";

  const canAfford =
    effectiveMethod === "coins" ? coinsAvailable : hasEnoughGems;

  return {
    paymentMethod: effectiveMethod,
    setPaymentMethod,
    gemCost,
    coinCost,
    canPayWithCoins,
    coinsSpentToday,
    dailyLimit: DAILY_COIN_SPEEDUP_LIMIT,
    wouldExceedDailyCoinLimit,
    hasEnoughGems,
    hasEnoughCoins,
    canAfford,
  };
}
