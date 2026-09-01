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
