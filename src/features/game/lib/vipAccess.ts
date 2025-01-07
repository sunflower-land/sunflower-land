import { GameState, Inventory } from "../types/game";

export const hasVipAccess = ({
  game,
  now = Date.now(),
}: {
  game: GameState;
  now?: number;
}): boolean => {
  return !!game.vip?.boughtAt && game.vip?.expiresAt > now;
};

export type VipBundle = "1_MONTH" | "3_MONTHS" | "1_YEAR";

export const VIP_PRICES: Record<VipBundle, number> = {
  "1_MONTH": 650, //4.99
  "3_MONTHS": 1500, // 11.99
  "1_YEAR": 6000, // 39.99
};
