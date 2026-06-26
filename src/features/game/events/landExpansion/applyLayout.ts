import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { applyFarmLayout } from "./lib/layouts";

export type ApplyLayoutAction = {
  type: "layout.applied";
  layoutId: number;
};

type Options = {
  state: Readonly<GameState>;
  action: ApplyLayoutAction;
  createdAt?: number;
};

/**
 * Load a saved layout onto the live farm (the "current" layout). Best-effort:
 * each item moves to its saved position if it still fits; items whose spot is
 * now off the land (e.g. the farm shrank on ascension) or blocked stay where
 * they are. Saved layouts are immutable — editing the farm never changes them;
 * use `saveLayout` with a `layoutId` to overwrite one.
 */
export function applyLayout({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!hasFeatureAccess(stateCopy, "SAVED_LAYOUTS")) {
      throw new Error("Saved layouts are not available");
    }

    const layout = (stateCopy.layouts ?? [])[action.layoutId];
    if (!layout) {
      throw new Error("Layout does not exist");
    }

    applyFarmLayout(stateCopy, layout, createdAt);

    return stateCopy;
  });
}
