import { GameState } from "features/game/types/game";
import { canSellBounty, sellBounty } from "./sellBounty";

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
}: Options): GameState {
  // Mirrors the autosave Joi schema (`min(1).unique()`): the UI never produces
  // these shapes, so seeing one means a bug or a hostile client and we want it
  // to throw locally rather than be quietly accepted by the optimistic update.
  if (action.requestIds.length === 0) {
    throw new Error("No bounties selected");
  }
  if (new Set(action.requestIds).size !== action.requestIds.length) {
    throw new Error("Duplicate bounty IDs");
  }

  let nextState = state;

  action.requestIds.forEach((requestId) => {
    // Unknown IDs are a real client/server divergence and should surface, not
    // silently no-op.
    const request = nextState.bounties.requests.find((r) => r.id === requestId);
    if (!request) throw new Error("Bounty does not exist");

    // Skip transient failures (already completed, inventory exhausted mid-loop)
    // — these can happen on legitimate race conditions in bulk mode.
    if (!canSellBounty(nextState, requestId)) return;

    nextState = sellBounty({
      state: nextState,
      action: { type: "bounty.sold", requestId },
      createdAt,
    });
  });

  return nextState;
}
