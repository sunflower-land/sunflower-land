import Decimal from "decimal.js-light";
import { GameState } from "../types/game";
import { hasVipAccess } from "./vipAccess";

export function SFLDiscount(state: GameState | undefined, sfl: Decimal) {
  if (!state) return sfl;

  if (hasVipAccess(state.inventory)) {
    // 25% discount
    return sfl.times(0.75);
  }

  return sfl;
}
