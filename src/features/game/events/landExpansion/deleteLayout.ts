import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";

export type DeleteLayoutAction = {
  type: "layout.deleted";
  layoutId: number;
};

type Options = {
  state: Readonly<GameState>;
  action: DeleteLayoutAction;
  createdAt?: number;
};

export function deleteLayout({ state, action }: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!hasFeatureAccess(stateCopy, "SAVED_LAYOUTS")) {
      throw new Error("Saved layouts are not available");
    }

    const layouts = stateCopy.layouts ?? [];
    if (!layouts[action.layoutId]) {
      throw new Error("Layout does not exist");
    }
    if (layouts[action.layoutId].auto) {
      throw new Error("The Ascension Layout cannot be deleted");
    }

    layouts.splice(action.layoutId, 1);
    stateCopy.layouts = layouts;

    return stateCopy;
  });
}
