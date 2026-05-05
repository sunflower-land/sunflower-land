import { useState } from "react";
import { GameState } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";
import {
  COINS_PER_GEM,
  DAILY_COIN_SPEEDUP_LIMIT,
  getCoinsSpentOnSpeedUpsToday,
  hasDinoEggTrophyBoost,
  SpeedUpPaymentMethod,
  useRealTimeInstantGems,
} from "./getInstantGems";

export type UseSpeedUpPayment = ReturnType<typeof useSpeedUpPayment>;

export function useSpeedUpPayment({
  readyAt,
  game,
}: {
  readyAt: number;
  game: GameState;
}) {
  const now = useNow({ live: true, autoEndAt: readyAt });
  const gemCost = useRealTimeInstantGems({ readyAt, game });
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

  const [paymentMethod, setPaymentMethod] =
    useState<SpeedUpPaymentMethod>("gems");

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
