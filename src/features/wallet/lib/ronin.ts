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
