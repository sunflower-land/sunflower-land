import type { GameState } from "features/game/types/game";
import type { PlaceableLocation } from "features/game/types/collectibles";
import type { MachineInterpreter } from "features/game/lib/gameMachine";
import {
  applyArrangement,
  snapshotSurface,
  ArrangementConflictError,
  type ArrangementConflict,
} from "features/game/events/landExpansion/applyArrangement";
import { ART_MODE } from "features/auth/lib/authMachine";
import { randomID } from "lib/utils/random";
import { createEffectError, postEffect, type EffectError } from "./effect";
import { flushPendingActions } from "./layoutEffects";
import { serializeByKey } from "lib/utils/serializeByKey";
import {
  createErrorLogger,
  isExpectedErrorCode,
  isNetworkError,
} from "lib/errorLogger";
import { getApiErrorDetail } from "lib/apiError";

/**
 * The landscaping sandbox commit. Like the layout effects, this is posted
 * directly (not via a machine effect state) so it works from `landscaping`.
 * The draft is the machine's `context.state`; the server diffs the posted
 * arrangement against its own farm, so pending live actions (purchases) MUST
 * be flushed first or the server won't own the items the draft placed.
 */

export const ARRANGEMENT_CONFLICT = "ARRANGEMENT_CONFLICT";

export type ArrangementConflictData = { conflicts: ArrangementConflict[] };

export const isArrangementConflict = (
  error: unknown,
): error is EffectError & { data: ArrangementConflictData } =>
  error instanceof Error &&
  error.message === ARRANGEMENT_CONFLICT &&
  Array.isArray(
    ((error as EffectError).data as Partial<ArrangementConflictData>)
      ?.conflicts,
  );

export async function saveArrangementEffect({
  farmId,
  token,
  state,
  location,
}: {
  farmId: number;
  token: string;
  /** The draft - the arrangement is snapshotted from it. */
  state: GameState;
  location: PlaceableLocation;
}): Promise<{ gameState: GameState }> {
  const arrangement = snapshotSurface(state, location);

  if (ART_MODE) {
    try {
      const gameState = applyArrangement({
        state,
        action: { type: "arrangement.saved", location, arrangement },
        createdAt: Date.now(),
      });
      return { gameState };
    } catch (e) {
      if (e instanceof ArrangementConflictError) {
        throw createEffectError(ARRANGEMENT_CONFLICT, {
          conflicts: e.conflicts,
        });
      }
      throw e;
    }
  }

  const { gameState } = await postEffect({
    farmId,
    token,
    transactionId: randomID(),
    effect: { type: "arrangement.saved", location, arrangement },
    state,
  });

  return { gameState };
}

/**
 * Save the landscaping draft: flush live actions, post the arrangement, and
 * push the result into the machine. Resolves `true` when the surface was
 * saved. Conflicts are handed to the machine (the draft stays open, the HUD
 * highlights them) and resolve `false`; any other failure is rethrown for
 * the caller to surface.
 *
 * With `nextLocation` the player is switching interior floors: the current
 * surface is saved and landscaping continues on `nextLocation` instead of
 * ending. The caller navigates only when this resolves `true`.
 *
 * Commits for one game run one at a time, each reading the machine only once
 * the previous one has landed. Two HUDs can each start one (a floor button,
 * then a browser-back arrival on a freshly mounted HUD); without the queue
 * their responses could land out of order and an older reply would re-key
 * the draft to a floor the player has already left.
 */
const runCommitsInOrder = serializeByKey<MachineInterpreter>();

/**
 * True while any arrangement commit for this game is queued or in flight,
 * from any HUD. A HUD mounted meanwhile must not accept edits: the pending
 * reply replaces the draft (and may re-key it to another floor).
 */
export const isArrangementCommitPending = (gameService: MachineInterpreter) =>
  runCommitsInOrder.isPending(gameService);

export const subscribeArrangementCommits = (
  gameService: MachineInterpreter,
  listener: () => void,
) => runCommitsInOrder.subscribe(gameService, listener);

export function commitArrangement(
  gameService: MachineInterpreter,
  options: { nextLocation?: PlaceableLocation } = {},
): Promise<boolean> {
  return runCommitsInOrder(gameService, () =>
    commitArrangementNow(gameService, options),
  );
}

async function commitArrangementNow(
  gameService: MachineInterpreter,
  { nextLocation }: { nextLocation?: PlaceableLocation },
): Promise<boolean> {
  // Which step a failure belongs to: syncing queued actions, or the post.
  let stage: CommitStage = "flush";

  // Read up front: a failed sync leaves landscaping and clears both.
  const before = gameService.getSnapshot().context;
  const draft: CommitDraft = {
    location: before.landscapingLocation ?? "farm",
    pendingActions: before.actions.length,
  };

  try {
    await flushPendingActions(gameService);
    stage = "post";

    const { farmId, rawToken, state, landscapingLocation } =
      gameService.getSnapshot().context;

    const { gameState } = await saveArrangementEffect({
      farmId,
      token: rawToken as string,
      state,
      location: landscapingLocation ?? "farm",
    });
    gameService.send({
      type: "ARRANGEMENT_SAVED",
      state: gameState,
      ...(nextLocation ? { nextLocation } : {}),
    });
    return true;
  } catch (e) {
    if (isArrangementConflict(e)) {
      gameService.send({
        type: "ARRANGEMENT_REJECTED",
        conflicts: e.data.conflicts,
      });
      return false;
    }
    reportCommitFailure(gameService, e, stage, draft);
    throw e;
  }
}

type CommitStage = "flush" | "post";

/** What was being saved, as it stood when the commit started. */
type CommitDraft = { location: PlaceableLocation; pendingActions: number };

/**
 * The HUD only shows a generic "could not save" message, so the reason is
 * reported here. Connection problems are left out, as everywhere else.
 */
function reportCommitFailure(
  gameService: MachineInterpreter,
  error: unknown,
  stage: CommitStage,
  draft: CommitDraft,
) {
  const snapshot = gameService.getSnapshot();
  const { farmId, errorCode } = snapshot.context;

  // A failed sync only says SAVE_FAILED; the machine holds what caused it.
  // A timeout sets nothing there, so an older error must not be read for it.
  const syncFailed =
    stage === "flush" &&
    error instanceof Error &&
    error.message === "SAVE_FAILED";
  const syncCause = syncFailed ? errorCode : undefined;

  if (isNetworkError(error) || isNetworkError(syncCause)) return;

  // The sync's own cause decides whether this is an outcome we never report.
  if (isExpectedErrorCode(syncCause)) return;

  const detail = getApiErrorDetail(error);
  const cause = error instanceof Error ? error.message : String(error);

  void createErrorLogger(
    "landscaping_save",
    farmId,
  )({
    // Plain errors carry their code as the message (e.g. a rate limit).
    code: detail?.code ?? cause,
    message: `Landscaping save failed (${stage}): ${cause}`,
    status: detail?.status,
    endpoint: detail?.endpoint,
    transactionId: detail?.transactionId,
    stack: error instanceof Error ? error.stack : undefined,
    meta: {
      ...detail?.meta,
      stage,
      syncCause,
      ...draft,
      machineState: JSON.stringify(snapshot.value),
    },
  });
}
