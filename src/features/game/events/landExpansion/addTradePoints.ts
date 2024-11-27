import Decimal from "decimal.js-light";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { KNOWN_ITEMS } from "features/game/types";
import { GameState, TradeListing } from "features/game/types/game";

export function addTradePoints({
  state,
  points,
  sfl,
  trade,
}: {
  state: GameState;
  points: number;
  sfl: number;
  trade: Pick<TradeListing, "itemId" | "quantity" | "collection">;
}) {
  // Exclude resources
  if (
    trade.collection === "collectibles" &&
    TRADE_LIMITS[KNOWN_ITEMS[trade.itemId]]
  ) {
    return state;
  }

  // Define Constants
  const TRADE_POINTS_MULTIPLIER = 1; // Value adjustable
  const pointsCalculation = 1 + sfl ** TRADE_POINTS_MULTIPLIER;
  const multipliedPoints = points * pointsCalculation;

  // Add points to gamestate
  state.trades.tradePoints = (state.trades.tradePoints ?? 0) + multipliedPoints;
  state.inventory["Trade Point"] = (
    state.inventory["Trade Point"] ?? new Decimal(0)
  ).add(multipliedPoints);
  return state;
}
