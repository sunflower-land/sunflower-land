import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

/**
 * Returns the tax rate when withdrawing SFL
 * Smart contract uses a base rate of 1000 for decimal precision. 10% = 100
 */
function getTaxPercentage(amount: Decimal) {
  if (amount.lessThan(10)) {
    return 30;
  }

  if (amount.lessThan(100)) {
    return 25;
  }

  if (amount.lessThan(1000)) {
    // 20%
    return 20;
  }

  if (amount.lessThan(5000)) {
    // 15%
    return 15;
  }

  // 10%
  return 10;
}

export function getTax({
  amount,
  game,
}: {
  amount: Decimal;
  game: GameState;
}): number {
  amount = amount.sub(game.bank.taxFreeSFL);

  if (amount.lte(0)) return 0;

  let percentage = getTaxPercentage(amount);

  if (game.island.type !== "basic") {
    percentage -= 2.5; // 2.5%
  }
  // Liquidity providers get 50% off fees
  if (game.inventory["Liquidity Provider"]?.gte(1)) {
    percentage = percentage * 0.5;
  }

  const tax = amount.mul(percentage / 100).toNumber();

  return tax;
}
