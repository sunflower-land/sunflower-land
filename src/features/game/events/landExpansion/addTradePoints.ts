import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export function addTradePoints({
  state,
  points,
  sfl,
}: {
  state: GameState;
  points: number;
  sfl: number;
}) {
  return produce(state, (game) => {
    // Define Constants
    const TRADE_POINTS_MULTIPLIER = 1; // Value adjustable
    const pointsCalculation = 1 + sfl ** TRADE_POINTS_MULTIPLIER;
    const multipliedPoints = points * pointsCalculation;

    // Add points to gamestate
    game.trades.tradePoints = (game.trades.tradePoints ?? 0) + multipliedPoints;
    game.inventory["Trade Point"] = (
      game.inventory["Trade Point"] ?? new Decimal(0)
    ).add(multipliedPoints);
    return game;
  });
}
