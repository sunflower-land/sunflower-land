import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

/**
 * Returns the tax rate when withdrawing SFL
 * Smart contract uses a base rate of 1000 for decimal precision. 10% = 100
 */
export function getTax({ amount, game }: { amount: Decimal; game: GameState }) {
  // 10%
  let tax = 100;

  if (amount.lessThan(10)) {
    // 30%
    tax = 300;
  } else if (amount.lessThan(100)) {
    // 25%
    tax = 250;
  } else if (amount.lessThan(1000)) {
    // 20%
    tax = 200;
  } else if (amount.lessThan(5000)) {
    // 15%
    tax = 150;
  }

  if (game.island.type !== "basic") {
    tax -= 25; // 2.5% reduction
  }

  if (game.inventory["Liquidity Provider"]?.gte(1)) {
    tax = tax / 2;
  }

  // 50% reduced fee if LP badge exists
  return Math.floor(tax);
}
