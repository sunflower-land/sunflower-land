import Decimal from "decimal.js-light";
import { GameState } from "../types/game";
import { hasVipAccess } from "./vipAccess";
import { SEASONS } from "../types/seasons";

export function SFLDiscount(state: GameState | undefined, sfl: Decimal) {
  if (!state) return sfl;

  if (hasVipAccess({ game: state })) {
    if (Date.now() > SEASONS["Great Bloom"].startDate.getTime()) {
      // 50% discount
      return sfl.times(0.5);
    } else {
      // 25% discount
      return sfl.times(0.75);
    }
  }

  return sfl;
}
