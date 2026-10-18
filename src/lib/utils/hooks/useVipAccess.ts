import {
  VIP_TRIAL_PERIOD_MS,
  getExpansionCoinCostWithVip,
  hasLifetimeFarmerBanner,
  hasVipAccess,
} from "features/game/lib/vipAccess";
import type { GameState } from "features/game/types/game";
import { useNow } from "./useNow";

/**
 * How often to re-read the clock while a pass is still running.
 *
 * VIP is a boolean that flips exactly once, at expiry, and it gates labels and a
 * price display - the server is what actually enforces access. A minute's
 * granularity is plenty, where ticking every second re-renders every screen
 * holding this hook 60 times a minute for an answer that hasn't changed.
 */
const VIP_EXPIRY_TICK_MS = 60 * 1000;

export const useVipAccess = ({
  game,
  type = "trial",
}: {
  game: GameState;
  type?: "trial" | "full";
}): boolean => {
  // A lifetime pass never lapses, so every branch of hasVipAccess returns true
  // whatever the timestamp is - don't run a clock for it at all.
  const hasLifetimePass = hasLifetimeFarmerBanner(game);

  const autoEndAt = Math.max(
    game.vip?.expiresAt ?? 0,
    (game.vip?.trialStartedAt ?? 0) + VIP_TRIAL_PERIOD_MS,
  );

  const now = useNow({
    live: !hasLifetimePass,
    autoEndAt,
    intervalMs: VIP_EXPIRY_TICK_MS,
  });

  return hasVipAccess({ game, now, type });
};

export const useExpansionCoinCostWithVip = ({
  coins,
  game,
}: {
  coins: number | undefined;
  game: GameState;
}): number => {
  const hasLifetimePass = hasLifetimeFarmerBanner(game);

  const autoEndAt = Math.max(
    game.vip?.expiresAt ?? 0,
    (game.vip?.trialStartedAt ?? 0) + VIP_TRIAL_PERIOD_MS,
  );

  const now = useNow({
    live: !hasLifetimePass,
    autoEndAt,
    intervalMs: VIP_EXPIRY_TICK_MS,
  });

  return getExpansionCoinCostWithVip({ coins, game, now });
};
