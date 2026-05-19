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
  // Mirrors the autosave Joi schema (`min(1).unique()`): the UI never
  // produces these shapes, so seeing one means a bug or a hostile client and
  // we want it to throw locally rather than be quietly accepted by the
  // optimistic update.
  if (action.requestIds.length === 0) {
    throw new Error("No bounties selected");
  }
  if (new Set(action.requestIds).size !== action.requestIds.length) {
    throw new Error("Duplicate bounty IDs");
  }

  // Resolve every request up-front so we fail before any partial sell happens.
  // sellBounty is immutable via immer so the caller's `state` is never mutated
  // either way, but validating first keeps the handler all-or-nothing instead
  // of leaking a half-applied intermediate via thrown-mid-loop semantics.
  const requestsById = new Map(
    state.bounties.requests.map((request) => [request.id, request]),
  );
  action.requestIds.forEach((requestId) => {
    if (!requestsById.has(requestId)) {
      throw new Error("Bounty does not exist");
    }
  });

  let nextState = { ...state };

  action.requestIds.forEach((requestId) => {
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
