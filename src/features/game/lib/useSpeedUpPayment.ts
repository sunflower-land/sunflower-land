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
  const dailyCapReached = coinsSpentToday + coinCost > DAILY_COIN_SPEEDUP_LIMIT;

  const [paymentMethod, setPaymentMethod] =
    useState<SpeedUpPaymentMethod>("gems");

  const effectiveMethod: SpeedUpPaymentMethod = canPayWithCoins
    ? paymentMethod
    : "gems";

  const hasEnoughGems = !!game.inventory.Gem?.gte(gemCost);
  const hasEnoughCoins = game.coins >= coinCost;

  const canAfford =
    effectiveMethod === "coins"
      ? canPayWithCoins && !dailyCapReached && hasEnoughCoins
      : hasEnoughGems;

  return {
    paymentMethod: effectiveMethod,
    setPaymentMethod,
    gemCost,
    coinCost,
    canPayWithCoins,
    coinsSpentToday,
    dailyLimit: DAILY_COIN_SPEEDUP_LIMIT,
    dailyCapReached,
    hasEnoughGems,
    hasEnoughCoins,
    canAfford,
  };
}
