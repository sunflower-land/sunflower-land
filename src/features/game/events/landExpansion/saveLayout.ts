import { produce } from "immer";
import {
  type GameState,
  MAX_LAYOUT_NAME_LENGTH,
  MAX_SAVED_LAYOUTS,
} from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { snapshotFarm } from "./lib/layouts";

export type SaveLayoutAction = {
  type: "layout.saved";
  name: string;
  /** Index of an existing layout to overwrite. Omit to create a new layout. */
  layoutId?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SaveLayoutAction;
  createdAt?: number;
};

export function saveLayout({
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

    const layouts = stateCopy.layouts ?? [];
    const snapshot = snapshotFarm(stateCopy);

    if (action.layoutId !== undefined) {
      const existing = layouts[action.layoutId];
      if (!existing) {
        throw new Error("Layout does not exist");
      }
      layouts[action.layoutId] = {
        ...existing,
        ...snapshot,
        name,
        updatedAt: createdAt,
      };
    } else {
      if (layouts.length >= MAX_SAVED_LAYOUTS) {
        throw new Error("Maximum number of layouts reached");
      }
      layouts.push({
        name,
        createdAt,
        updatedAt: createdAt,
        ...snapshot,
      });
    }

    stateCopy.layouts = layouts;

    return stateCopy;
  });
}
