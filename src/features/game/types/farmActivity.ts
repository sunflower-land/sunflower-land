import { GameState, InventoryItemName } from "./game";
import { FlowerName } from "./flowers";

export type CaughtEvent = `${InventoryItemName} Caught`;
export type HarvestedEvent = `${FlowerName} Harvested`;

export type FarmActivityName = CaughtEvent | HarvestedEvent;

export function trackFarmActivity(
  activityName: FarmActivityName,
  farmAnalytics: GameState["farmActivity"],
  amount = 1,
) {
  const previous = farmAnalytics || {};
  const activityAmount = previous[activityName] || 0;

  return {
    ...previous,
    [activityName]: (amount += activityAmount),
  };
}
