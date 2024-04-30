import Decimal from "decimal.js-light";
import { GameState } from "../types/game";
import { getSeasonalBanner } from "../types/seasons";

export function SFLDiscount(state: GameState | undefined, sfl: Decimal) {
  if (!state) return sfl;

  const currentSeasonBanner = getSeasonalBanner();

  if (
    state.inventory[currentSeasonBanner] ||
    state.inventory["Lifetime Farmer Banner"]
  ) {
    // 25% discount
    return sfl.times(0.75);
  }

  return sfl;
}
