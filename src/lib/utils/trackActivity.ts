import Decimal from "decimal.js-light";
import { BumpkinActivityName } from "features/game/types";
import { Bumpkin } from "features/game/types/game";

export function trackActivity(
  activityName: BumpkinActivityName,
  bumpkinActivity: Bumpkin["activity"],
  activityAmount = new Decimal(1)
): Bumpkin["activity"] {
  const previous = bumpkinActivity || {};
  const oldAmount = previous[activityName] || 0;

  return {
    ...previous,
    // TODO - support Decimals
    [activityName]: activityAmount.add(oldAmount).toNumber(),
  };
}
