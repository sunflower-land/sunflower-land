import Decimal from "decimal.js-light";
import { GameState } from "../types/game";
import { hasVipAccess } from "./vipAccess";

export function SFLDiscount(state: GameState | undefined, sfl: Decimal) {
  if (!state) return sfl;

  if (hasVipAccess({ game: state })) {
    if (Date.now() > new Date("2025-05-01").getTime()) {
      // 50% discount
      return sfl.times(0.5);
    } else {
      // 25% discount
      return sfl.times(0.75);
    }
  }

  return sfl;
}
