import { GameState } from "features/game/types/game";

/**
 * Temporary function to determine if wallet is Ronin
 */
export function isRonin({ game }: { game: GameState }) {
  if (game.nfts?.ronin) {
    return true;
  }

  return false;
}

export type RoninV2PackName =
  | "Platinum Pack"
  | "Gold Pack"
  | "Silver Pack"
  | "Bronze Pack"
  | "Free Pack";
