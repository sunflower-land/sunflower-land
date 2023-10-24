import { GameState, InventoryItemName } from "../types/game";

export type CaughtEvent = `${InventoryItemName} Caught`;

export type FarmActivityName = CaughtEvent;

export function trackFarmActivity(
  activityName: FarmActivityName,
  farmAnalytics: GameState["farmActivity"],
  amount = 1
) {
  const previous = farmAnalytics || {};
  const activityAmount = previous[activityName] || 0;

  return {
    ...previous,
    [activityName]: (amount += activityAmount),
  };
}
