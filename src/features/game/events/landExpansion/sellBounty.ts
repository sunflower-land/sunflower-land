import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/decorations";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type SellBountyAction = {
  type: "bounty.sold";
  requestId: string;
};

type Options = {
  state: GameState;
  action: SellBountyAction;
  createdAt?: number;
};

export function sellBounty({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (draft) => {
    const request = draft.bounties.requests.find(
      (deal) => deal.id === action.requestId,
    );

    if (!request) {
      throw new Error("Bounty does not exist");
    }

    const completed = draft.bounties.completed.find(
      (c) => c.id === action.requestId,
    );
    if (completed) {
      throw new Error("Bounty already completed");
    }

    // Remove the item from the inventory
    const item = draft.inventory[request.name];
    if (!item || item.lte(0)) {
      throw new Error("Item does not exist in inventory");
    }
    draft.inventory[request.name] = item.minus(1);

    // Add rewards
    if (request.coins) {
      draft.coins += request.coins;
    }

    getKeys(request.items ?? {}).forEach((name) => {
      const previous = draft.inventory[name] ?? new Decimal(0);
      draft.inventory[name] = previous.add(request.items?.[name] ?? 0);
    });

    // Mark bounty as completed
    draft.bounties.completed.push({
      id: request.id,
      soldAt: createdAt,
    });

    // Track farm activity
    draft.farmActivity = trackFarmActivity(
      `${request.name} Bountied`,
      draft.farmActivity,
    );

    return draft;
  });
}
