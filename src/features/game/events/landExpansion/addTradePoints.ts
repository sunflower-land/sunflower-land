import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

export function addTradePoints({
  state,
  points,
  sfl,
}: {
  state: GameState;
  points: number;
  sfl: number;
}) {
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
