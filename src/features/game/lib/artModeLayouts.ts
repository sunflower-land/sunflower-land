import type { SavedLayout } from "features/game/types/game";
import type { LayoutsData } from "features/game/actions/layoutEffects";
import { snapshotFarm } from "features/game/events/landExpansion/lib/layouts";
import { OFFLINE_FARM } from "./landData";

/**
 * In-memory stand-in for the server's `layouts` collection, used when
 * ART_MODE is on (no API): the Saved Layouts modal and the ascension prompts
 * run their full flows — save/rename/overwrite/delete/apply — against this
 * store (see the ART_MODE branches in actions/layoutEffects.ts). Resets on
 * reload, like the rest of the offline farm.
 *
 * Seeded with two dummies snapshotted from OFFLINE_FARM so previews render
 * real art; the second is marked as the ascension re-apply target so that UI
 * shows too.
 *
 * ## Manual testing in ART_MODE (run without VITE_API_URL)
 *
 * These flows have no jest coverage on the FE (server behavior is covered in
 * the API repo; UI is verified in-browser per house convention):
 *
 * Saved Layouts modal (landscaping → map button, needs SAVED_LAYOUTS access):
 * 1. Open the modal — both dummies list with previews; "Ascension Layout"
 *    carries the re-apply badge.
 * 2. Save current farm (with and without a name) — the new card appears
 *    ("Layout N" when unnamed); a third save disables via the cap message.
 * 3. Move an item in landscaping, then Overwrite a layout — its preview
 *    updates with the move (proves the pending-actions flush ordering).
 * 4. Rename / Delete — deleting the badged layout also clears its badge.
 * 5. Apply a layout after rearranging — the farm snaps back without leaving
 *    landscaping, and the toast shows partial counts if items were blocked.
 *
 * Island upgrade prompts (IslandUpgrader raft):
 * 6. With DYNAMIC_OFFLINE_FARM = getDynamicIsland("volcano", 30, 0, true):
 *    the ascend confirmation shows the "Save my current layout" checkbox
 *    (hint text instead when 3 slots are full); ascending with it checked
 *    adds the layout and badges it.
 * 7. With getDynamicIsland("swamp", 42, undefined, true): ascending resets
 *    the land and the post-upgrade modal offers "Re-apply 'Ascension
 *    Layout'" — one tap restores the arrangement; declining just continues.
 */

const seededAt = Date.now();

const makeDummyLayout = (id: string, name: string): SavedLayout => ({
  id,
  name,
  createdAt: seededAt,
  updatedAt: seededAt,
  ...snapshotFarm(OFFLINE_FARM),
});

let store: LayoutsData = {
  layouts: [
    makeDummyLayout("art-layout-1", "Layout 1"),
    makeDummyLayout("art-layout-2", "Ascension Layout"),
  ],
  ascensionLayoutId: "art-layout-2",
};

export const getArtModeLayouts = (): LayoutsData => ({
  layouts: [...store.layouts],
  ascensionLayoutId: store.ascensionLayoutId,
});

export const setArtModeLayouts = (data: LayoutsData): LayoutsData => {
  store = data;
  return getArtModeLayouts();
};
