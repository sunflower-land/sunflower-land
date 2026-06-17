import type { GameState } from "../types/game";

/**
 * The farm loaded when the game runs without the API (offline / local dev and
 * the portal example — see gameMachine.ts and portalMachine.ts).
 *
 * Swap which line below is active to pick the farm you want to develop against:
 *
 * - INITIAL_FARM (default): the untouched farm a brand-new player starts with.
 *
 * - STATIC_OFFLINE_FARM (./landDataStatic): a hand-authored snapshot. Edit that
 *   file to hard-code specific inventory, buildings, levels, etc. for testing —
 *   nothing is derived, so it can drift from the canonical layouts.
 *
 * - DYNAMIC_OFFLINE_FARM (./landDataDynamic): a farm built by replaying the real
 *   progression (revealLand + upgrade via getDynamicIsland), so node layouts
 *   always track the canonical expansion data. Change the island / expansion
 *   count in that file to land on a different island or size.
 */
import { INITIAL_FARM } from "./constants";
export const OFFLINE_FARM: GameState = INITIAL_FARM;

// import { STATIC_OFFLINE_FARM } from "./landDataStatic";
// export const OFFLINE_FARM: GameState = STATIC_OFFLINE_FARM;

// import { DYNAMIC_OFFLINE_FARM } from "./landDataDynamic";
// export const OFFLINE_FARM: GameState = DYNAMIC_OFFLINE_FARM;
