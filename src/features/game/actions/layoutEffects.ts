import { produce } from "immer";
import type { GameState, SavedLayout } from "features/game/types/game";
import { MAX_SAVED_LAYOUTS } from "features/game/types/game";
import type {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import {
  applyFarmLayout,
  defaultLayoutName,
  snapshotFarm,
} from "features/game/events/landExpansion/lib/layouts";
import { ART_MODE } from "features/auth/lib/authMachine";
import {
  getArtModeLayouts,
  setArtModeLayouts,
} from "features/game/lib/artModeLayouts";
import { randomID } from "lib/utils/random";
import { postEffect } from "./effect";

/**
 * The layout effects are posted directly (not via machine effect states) so
 * they work from the `landscaping` state, where the Saved Layouts modal
 * lives. Only `layout.applied` changes the farm — its returned gameState must
 * be pushed into the machine with the `LAYOUT_APPLIED` event; the others are
 * collection-only writes whose gameState is discarded.
 *
 * Callers MUST `flushPendingActions` first for snapshot/apply effects: the
 * server builds snapshots from (and applies layouts to) the farm it loads, so
 * unflushed local actions would be missing from a snapshot, or replayed on
 * top of an applied layout.
 *
 * ART_MODE (no API) runs every flow against the in-memory store in
 * lib/artModeLayouts.ts instead — snapshots/applies use the caller-passed
 * state, mirroring the server's rules (cap, default naming, pointer).
 */

export type LayoutsData = {
  layouts: SavedLayout[];
  /** The layout offered for one-tap re-apply after an ascension. */
  ascensionLayoutId?: string;
};

export type AppliedLayoutData = LayoutsData & {
  applied: number;
  skipped: number;
  noInventory: number;
};

type EffectArgs = {
  farmId: number;
  token: string;
};

export async function createLayoutEffect({
  farmId,
  token,
  state,
  name,
  markAscension,
}: EffectArgs & {
  /** Current farm — used only by the ART_MODE client-side snapshot. */
  state: GameState;
  name?: string;
  markAscension?: boolean;
}): Promise<LayoutsData> {
  if (ART_MODE) {
    const store = getArtModeLayouts();

    if (store.layouts.length >= MAX_SAVED_LAYOUTS) {
      throw new Error("LAYOUT_CAP_REACHED");
    }

    const layout: SavedLayout = {
      id: `art-${randomID()}`,
      name: name?.trim() || defaultLayoutName(store.layouts),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...snapshotFarm(state),
    };

    return setArtModeLayouts({
      layouts: [...store.layouts, layout],
      ascensionLayoutId: markAscension ? layout.id : store.ascensionLayoutId,
    });
  }

  const { data } = await postEffect({
    farmId,
    token,
    transactionId: randomID(),
    effect: {
      type: "layout.created",
      ...(name ? { name } : {}),
      ...(markAscension ? { markAscension } : {}),
    },
  });

  return data as LayoutsData;
}

export async function editLayoutEffect({
  farmId,
  token,
  state,
  id,
  name,
  updateSnapshot,
  markAscension,
}: EffectArgs & {
  /** Current farm — used only by the ART_MODE client-side snapshot. */
  state: GameState;
  id: string;
  name?: string;
  updateSnapshot?: boolean;
  markAscension?: boolean;
}): Promise<LayoutsData> {
  if (ART_MODE) {
    const store = getArtModeLayouts();
    const index = store.layouts.findIndex((layout) => layout.id === id);

    if (index === -1) {
      throw new Error("LAYOUT_NOT_FOUND");
    }

    const layout: SavedLayout = {
      ...store.layouts[index],
      ...(name ? { name: name.trim() } : {}),
      ...(updateSnapshot ? snapshotFarm(state) : {}),
      updatedAt: Date.now(),
    };

    return setArtModeLayouts({
      layouts: [
        ...store.layouts.slice(0, index),
        layout,
        ...store.layouts.slice(index + 1),
      ],
      ascensionLayoutId: markAscension ? layout.id : store.ascensionLayoutId,
    });
  }

  const { data } = await postEffect({
    farmId,
    token,
    transactionId: randomID(),
    effect: {
      type: "layout.edited",
      id,
      ...(name ? { name } : {}),
      ...(updateSnapshot ? { updateSnapshot } : {}),
      ...(markAscension ? { markAscension } : {}),
    },
  });

  return data as LayoutsData;
}

export async function deleteLayoutEffect({
  farmId,
  token,
  id,
}: EffectArgs & { id: string }): Promise<LayoutsData> {
  if (ART_MODE) {
    const store = getArtModeLayouts();

    return setArtModeLayouts({
      layouts: store.layouts.filter((layout) => layout.id !== id),
      ascensionLayoutId:
        store.ascensionLayoutId === id ? undefined : store.ascensionLayoutId,
    });
  }

  const { data } = await postEffect({
    farmId,
    token,
    transactionId: randomID(),
    effect: { type: "layout.deleted", id },
  });

  return data as LayoutsData;
}

export async function applyLayoutEffect({
  farmId,
  token,
  id,
  state,
}: EffectArgs & {
  id: string;
  /** Current machine state — the pruned response is merged over it. */
  state: GameState;
}): Promise<{ gameState: GameState } & AppliedLayoutData> {
  if (ART_MODE) {
    const store = getArtModeLayouts();
    const layout = store.layouts.find((candidate) => candidate.id === id);

    if (!layout) {
      throw new Error("LAYOUT_NOT_FOUND");
    }

    let counts = { applied: 0, skipped: 0, noInventory: 0 };

    const gameState = produce(state, (draft) => {
      counts = applyFarmLayout(draft, layout, Date.now());
    });

    return { gameState, ...counts, ...store };
  }

  const { gameState, data } = await postEffect({
    farmId,
    token,
    transactionId: randomID(),
    effect: { type: "layout.applied", id },
    state,
  });

  return { gameState, ...(data as AppliedLayoutData) };
}

const FLUSH_POLL_MS = 100;
const FLUSH_TIMEOUT_MS = 15_000;

const isSaveInFlight = (state: MachineState): boolean => {
  // Normal play: the parent machine itself autosaves.
  if (state.matches("autosaving")) return true;

  // Landscaping: the invoked child machine runs the autosave (its parallel
  // `saving` region), reporting SAVE_SUCCESS/SAVE_ERROR back to the parent.
  const child = state.children?.landscaping as
    | { getSnapshot?: () => { matches: (value: unknown) => boolean } }
    | undefined;

  return !!child?.getSnapshot?.()?.matches({ saving: "autosaving" });
};

/**
 * Flushes any queued (unsent) autosave actions and resolves once the server
 * farm is up to date. Works from both `playing` (parent autosave) and
 * `landscaping` (child-machine autosave). Re-sends SAVE as needed — actions
 * queued while a save was in flight survive it (handleSuccessfulSave keeps
 * them), so one round is not always enough.
 */
export async function flushPendingActions(
  gameService: MachineInterpreter,
): Promise<void> {
  // ART_MODE never talks to the server — there is nothing to sync.
  if (ART_MODE) return;

  const deadline = Date.now() + FLUSH_TIMEOUT_MS;

  for (;;) {
    const state = gameService.getSnapshot();

    if (state.matches("error")) {
      throw new Error("SAVE_FAILED");
    }

    const saving = isSaveInFlight(state);

    if (!saving && state.context.actions.length === 0) {
      return;
    }

    if (!saving) {
      // Both the parent (playing) and the landscaping forward path transition
      // into their saving state synchronously, so re-sending each poll while
      // idle-with-actions is safe — and a dropped SAVE (sent while the child
      // was mid-save) gets retried this way.
      gameService.send("SAVE");
    }

    if (Date.now() > deadline) {
      throw new Error("SAVE_TIMED_OUT");
    }

    await new Promise((resolve) => setTimeout(resolve, FLUSH_POLL_MS));
  }
}
