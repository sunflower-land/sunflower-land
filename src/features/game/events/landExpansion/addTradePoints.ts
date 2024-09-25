import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

export function addTradePoints({
  game,
  points,
  sfl,
}: {
  game: GameState;
  points: number;
  sfl: number;
}) {
  // Define Constants
  const TRADE_POINTS_MULTIPLIER = 1; // Value adjustable
  const pointsCalculation = 1 + (sfl ^ TRADE_POINTS_MULTIPLIER);
  const multipliedPoints = points * pointsCalculation;

  // Add points to gamestate
  game.tradePoints += multipliedPoints;
  game.inventory["Trade Point"] = (
    game.inventory["Trade Point"] ?? new Decimal(0)
  ).add(multipliedPoints);
  return game;
}
