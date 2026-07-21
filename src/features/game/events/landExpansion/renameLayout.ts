import { produce } from "immer";
import {
  type GameState,
  MAX_LAYOUT_NAME_LENGTH,
} from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";

export type RenameLayoutAction = {
  type: "layout.renamed";
  layoutId: number;
  name: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RenameLayoutAction;
  createdAt?: number;
};

export function renameLayout({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!hasFeatureAccess(stateCopy, "SAVED_LAYOUTS")) {
      throw new Error("Saved layouts are not available");
    }

    const name = action.name.trim();
    if (name.length === 0) {
      throw new Error("Layout name cannot be empty");
    }
    if (name.length > MAX_LAYOUT_NAME_LENGTH) {
      throw new Error("Layout name is too long");
    }

    const layout = (stateCopy.layouts ?? [])[action.layoutId];
    if (!layout) {
      throw new Error("Layout does not exist");
    }
    if (layout.auto) {
      throw new Error("The Ascension Layout cannot be renamed");
    }

    layout.name = name;
    layout.updatedAt = createdAt;

    return stateCopy;
  });
}
