import type { GameState, SavedLayout } from "features/game/types/game";
import type {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
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
  name,
  markAscension,
}: EffectArgs & {
  name?: string;
  markAscension?: boolean;
}): Promise<LayoutsData> {
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
  id,
  name,
  updateSnapshot,
  markAscension,
}: EffectArgs & {
  id: string;
  name?: string;
  updateSnapshot?: boolean;
  markAscension?: boolean;
}): Promise<LayoutsData> {
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
