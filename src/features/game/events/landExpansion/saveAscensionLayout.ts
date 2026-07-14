import { produce } from "immer";
import type { GameState, SavedLayout } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { SWAMP_BASE_EXPANSION } from "features/game/expansion/lib/ascension";
import { snapshotFarm, trimSavedLayout } from "./lib/layouts";

export type SaveAscensionLayoutAction = {
  type: "layout.ascensionSaved";
  /**
   * Promote an existing saved layout (by index) into the Ascension Layout
   * instead of snapshotting the current farm. The original layout is kept.
   */
  layoutId?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SaveAscensionLayoutAction;
  createdAt?: number;
};

/**
 * Capture the player's current base as the protected, auto-managed "Ascension
 * Layout" — the arrangement re-applied on every ascension. Normally this is
 * captured automatically on the first ascension (volcano→swamp), but this event
 * lets a player who ascended before that feature shipped (or is already on an
 * ascension island) set one from their current farm.
 *
 * The layout is always trimmed to the swamp base (30 expansions) and its
 * `land.expansions` is stamped to 30 regardless of the player's current size, so
 * it always fits the island it will be re-applied on. An existing Ascension
 * Layout is replaced (the only path that may overwrite an `auto` layout).
 */
export function saveAscensionLayout({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!hasFeatureAccess(stateCopy, "SAVED_LAYOUTS")) {
      throw new Error("Saved layouts are not available");
    }

    const layouts = stateCopy.layouts ?? [];

    // Source the arrangement either from an existing saved layout (trimmed to
    // 30 lands) or from a fresh snapshot of the current farm.
    let snapshot: ReturnType<typeof snapshotFarm>;
    if (action.layoutId !== undefined) {
      const source = layouts[action.layoutId];
      if (!source) {
        throw new Error("Layout does not exist");
      }
      snapshot = trimSavedLayout(
        source,
        SWAMP_BASE_EXPANSION,
        stateCopy.island,
      );
    } else {
      snapshot = snapshotFarm(stateCopy, {
        maxExpansions: SWAMP_BASE_EXPANSION,
      });
    }
    // Crystals are single-use rewards delivered per-upgrade, never part of the
    // reusable layout.
    snapshot.resources.ascensionCrystals = {};

    // Preserve the original creation time when re-assigning an existing one.
    const existing = layouts.find((layout) => layout.auto);

    const ascensionLayout: SavedLayout = {
      ...snapshot,
      name: "Ascension Layout",
      auto: true,
      createdAt: existing?.createdAt ?? createdAt,
      updatedAt: createdAt,
    };

    stateCopy.layouts = [
      ...layouts.filter((layout) => !layout.auto),
      ascensionLayout,
    ];

    return stateCopy;
  });
}
