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
 * push the result into the machine. Conflicts are handed to the machine too
 * (the draft stays open, the HUD highlights them); any other failure is
 * rethrown for the caller to surface.
 */
export async function commitArrangement(
  gameService: MachineInterpreter,
): Promise<void> {
  await flushPendingActions(gameService);

  const { farmId, rawToken, state, landscapingLocation } =
    gameService.getSnapshot().context;

  try {
    const { gameState } = await saveArrangementEffect({
      farmId,
      token: rawToken as string,
      state,
      location: landscapingLocation ?? "farm",
    });
    gameService.send({ type: "ARRANGEMENT_SAVED", state: gameState });
  } catch (e) {
    if (isArrangementConflict(e)) {
      gameService.send({
        type: "ARRANGEMENT_REJECTED",
        conflicts: e.data.conflicts,
      });
      return;
    }
    throw e;
  }
}
