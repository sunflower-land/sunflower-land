import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { sellBounty } from "./sellBounty";

export type BulkSellBountyAction = {
  type: "bounty.bulkSold";
  requestIds: string[];
};

type Options = {
  state: GameState;
  action: BulkSellBountyAction;
  createdAt?: number;
};

export function bulkSellBounty({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    action.requestIds.forEach((requestId) => {
      try {
        stateCopy = sellBounty({
          state: stateCopy,
          action: { type: "bounty.sold", requestId },
          createdAt,
        });
      } catch (error) {
        // Skip individual bounty failures (e.g. ran out of inventory mid-loop)
      }
    });

    return stateCopy;
  });
}
