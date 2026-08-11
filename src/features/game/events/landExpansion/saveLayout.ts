import { produce } from "immer";
import {
  type GameState,
  MAX_LAYOUT_NAME_LENGTH,
  MAX_SAVED_LAYOUTS,
} from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { defaultLayoutName, snapshotFarm } from "./lib/layouts";

export type SaveLayoutAction = {
  type: "layout.saved";
  /** Optional — new layouts default to "Layout N"; overwrites keep their name. */
  name?: string;
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

    const name = (action.name ?? "").trim();
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
      if (existing.auto) {
        throw new Error("The Ascension Layout cannot be overwritten");
      }
      layouts[action.layoutId] = {
        ...existing,
        ...snapshot,
        // An unnamed overwrite keeps the slot's current name.
        name: name || existing.name,
        updatedAt: createdAt,
      };
    } else {
      // The auto-managed Ascension Layout is exempt from the manual limit.
      if (
        layouts.filter((layout) => !layout.auto).length >= MAX_SAVED_LAYOUTS
      ) {
        throw new Error("Maximum number of layouts reached");
      }
      layouts.push({
        name: name || defaultLayoutName(layouts),
        createdAt,
        updatedAt: createdAt,
        ...snapshot,
      });
    }

    stateCopy.layouts = layouts;

    return stateCopy;
  });
}
