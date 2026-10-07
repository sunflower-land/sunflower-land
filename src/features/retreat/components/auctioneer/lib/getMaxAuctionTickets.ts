import Decimal from "decimal.js-light";
import type { Auction } from "features/game/lib/auctionMachine";
import type { GameState } from "features/game/types/game";
import { getKeys } from "lib/object";

export function getMaxAuctionTickets(
  auction: Auction,
  game: GameState,
): number {
  const limits: Decimal[] = [];

  if (auction.sfl > 0) {
    limits.push(game.balance.div(auction.sfl));
  }

  getKeys(auction.ingredients).forEach((name) => {
    const cost = auction.ingredients[name] ?? 0;
    if (cost > 0) {
      limits.push((game.inventory[name] ?? new Decimal(0)).div(cost));
    }
  });

  if (limits.length === 0) return 0;

  return Math.max(
    0,
    Math.min(
      ...limits.map((limit) =>
        limit.toDecimalPlaces(0, Decimal.ROUND_FLOOR).toNumber(),
      ),
    ),
  );
}
