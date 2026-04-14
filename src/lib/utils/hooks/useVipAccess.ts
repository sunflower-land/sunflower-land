import {
  VIP_TRIAL_PERIOD_MS,
  getExpansionCoinCostWithVip,
  hasVipAccess,
} from "features/game/lib/vipAccess";
import { GameState } from "features/game/types/game";
import { useNow } from "./useNow";

export const useVipAccess = ({
  game,
  type = "trial",
}: {
  game: GameState;
  type?: "trial" | "full";
}): boolean => {
  const autoEndAt = Math.max(
    game.vip?.expiresAt ?? 0,
    (game.vip?.trialStartedAt ?? 0) + VIP_TRIAL_PERIOD_MS,
  );

  const now = useNow({ live: true, autoEndAt });

  return hasVipAccess({ game, now, type });
};

export const useExpansionCoinCostWithVip = ({
  coins,
  game,
}: {
  coins: number | undefined;
  game: GameState;
}): number => {
  const autoEndAt = Math.max(
    game.vip?.expiresAt ?? 0,
    (game.vip?.trialStartedAt ?? 0) + VIP_TRIAL_PERIOD_MS,
  );

  const now = useNow({ live: true, autoEndAt });

  return getExpansionCoinCostWithVip({ coins, game, now });
};
