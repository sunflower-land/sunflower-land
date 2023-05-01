import Decimal from "decimal.js-light";
import { GameState } from "../types/game";

export function SFLDiscount(state: GameState | undefined, sfl: Decimal) {
  if (!state) {
    return sfl;
  }
  if (state.inventory["Dawn Breaker Banner"]) {
    // 25% discount
    return sfl.times(0.75);
  }

  return sfl;
}
