import type { GameState } from "features/game/types/game";
import type { PlaceableLocation } from "features/game/types/collectibles";
import { PLACEMENT_EVENTS, type GameEvent } from "features/game/events";
import { processEvent } from "features/game/lib/processEvent";
import type { ArrangementConflict } from "features/game/events/landExpansion/applyArrangement";

/**
 * The landscaping sandbox's bookkeeping, kept pure so it can be unit-tested
 * without XState.
 *
 * While landscaping the farm, `state` (the rendered farm) is a DRAFT: every
 * placement edit is applied to it locally and logged in `draftActions`, but
 * never autosaved. `baseState` is the farm WITHOUT those edits - what the
 * player gets back on Cancel. Events that must settle immediately (purchases,
 * biome changes) are "live": applied to both states and queued in `actions`
 * for autosave as usual. Save posts one `arrangement.saved` effect built from
 * the draft; on success the server's farm replaces both states.
 */

export type PastAction = GameEvent & { createdAt: Date };

export type DraftContext = {
  state: GameState;
  actions: PastAction[];
  /** The farm without the draft edits; set while landscaping. */
  baseState?: GameState;
  /** The landscaping edits, in order; never autosaved. */
  draftActions: PastAction[];
  landscapingLocation?: PlaceableLocation;
  /** Conflicts the server reported for the last rejected commit. */
  arrangementConflicts?: ArrangementConflict[];
};

/**
 * Landscaping events that are real transactions and must reach the server
 * even if the draft is discarded: the item is bought live and lands in the
 * chest; only its placement is drafted.
 */
export const LIVE_LANDSCAPING_EVENTS: ReadonlySet<string> = new Set([
  "collectible.crafted",
  "decoration.bought",
  "monument.bought",
  "building.constructed",
  "biome.bought",
  "biome.applied",
]);

/**
 * Placement events that live in PLAYING_EVENTS rather than PLACEMENT_EVENTS
 * but are dispatched from landscaping all the same.
 */
export const PERSON_PLACEMENT_EVENT_NAMES = [
  "farmHand.placed",
  "farmHand.moved",
  "farmHand.removed",
  "farmHand.flipped",
  "bumpkin.placed",
  "bumpkin.moved",
  "bumpkin.removedPlacement",
  "bumpkin.flipped",
] as const;

const PERSON_PLACEMENT_EVENTS: ReadonlySet<string> = new Set(
  PERSON_PLACEMENT_EVENT_NAMES,
);

/**
 * True when an event dispatched while landscaping should be drafted rather
 * than sent live. Every placeable surface is sandboxed; only purchases and
 * biome changes still settle immediately.
 */
export const isDraftEvent = (
  type: string,
  location: PlaceableLocation | undefined,
): boolean =>
  !!location &&
  !LIVE_LANDSCAPING_EVENTS.has(type) &&
  (type in PLACEMENT_EVENTS || PERSON_PLACEMENT_EVENTS.has(type));

export const isDraftDirty = (context: Pick<DraftContext, "draftActions">) =>
  context.draftActions.length > 0;

export const beginDraft = (
  state: GameState,
  location: PlaceableLocation,
): Pick<
  DraftContext,
  "baseState" | "draftActions" | "landscapingLocation" | "arrangementConflicts"
> => ({
  baseState: state,
  draftActions: [],
  landscapingLocation: location,
  arrangementConflicts: undefined,
});

const run = (
  state: GameState,
  action: PastAction,
  farmId: number,
): GameState => {
  const next = processEvent({
    state,
    action,
    farmId,
    createdAt: action.createdAt.getTime(),
  });
  // Placement events never touch a visitor state.
  return Array.isArray(next) ? next[0] : next;
};

/**
 * Successive edits of the same instance collapse into the last one, so a long
 * drag session costs one replay step, not hundreds. Only pure moves/flips are
 * coalesced; place/remove pairs are left alone (their reducers carry
 * side-effects the draft should keep faithful to a real sequence).
 */
export const compactDraftActions = (
  draftActions: PastAction[],
  next: PastAction,
): PastAction[] => {
  const type = next.type as string;
  const isMove = type.endsWith(".moved");
  if (!isMove) return [...draftActions, next];

  const id = (next as { id?: string }).id;
  const last = draftActions[draftActions.length - 1];
  const lastId = (last as { id?: string } | undefined)?.id;
  if (last && last.type === next.type && lastId === id) {
    return [...draftActions.slice(0, -1), next];
  }
  return [...draftActions, next];
};

/** Apply a landscaping edit to the draft only. */
export const applyDraftEvent = (
  context: Pick<DraftContext, "state" | "draftActions">,
  event: GameEvent,
  farmId: number,
  createdAt: Date,
): Pick<DraftContext, "state" | "draftActions" | "arrangementConflicts"> => {
  const action: PastAction = { ...event, createdAt };
  return {
    state: run(context.state, action, farmId),
    draftActions: compactDraftActions(context.draftActions, action),
    // Any edit invalidates the last rejection's highlights.
    arrangementConflicts: undefined,
  };
};

/** Apply a live event to both the draft and its base, and queue it. */
export const applyLiveEvent = (
  context: Pick<DraftContext, "state" | "baseState" | "actions">,
  event: GameEvent,
  farmId: number,
  createdAt: Date,
): Pick<DraftContext, "state" | "baseState" | "actions"> => {
  const action: PastAction = { ...event, createdAt };
  return {
    state: run(context.state, action, farmId),
    baseState: context.baseState
      ? run(context.baseState, action, farmId)
      : undefined,
    actions: [...context.actions, action],
  };
};

/**
 * Replay the draft over a fresh base (after a mid-session autosave brought the
 * server's farm back). Edits that no longer apply - the farm changed under
 * them - are dropped; the survivors are returned so the caller can tell the
 * player.
 */
export const replayDraft = (
  baseState: GameState,
  draftActions: PastAction[],
  farmId: number,
): { state: GameState; draftActions: PastAction[] } =>
  draftActions.reduce(
    (acc, action) => {
      try {
        return {
          state: run(acc.state, action, farmId),
          draftActions: [...acc.draftActions, action],
        };
      } catch {
        return acc;
      }
    },
    { state: baseState, draftActions: [] as PastAction[] },
  );

/** After a successful autosave while landscaping: rebase the draft. */
export const rebaseDraft = (
  saved: { state: GameState },
  context: Pick<DraftContext, "draftActions">,
  farmId: number,
): Pick<DraftContext, "state" | "baseState" | "draftActions"> => {
  const replayed = replayDraft(saved.state, context.draftActions, farmId);
  return {
    baseState: saved.state,
    state: replayed.state,
    draftActions: replayed.draftActions,
  };
};

/** Cancel: back to the farm without the draft. */
export const discardDraft = (
  context: Pick<DraftContext, "state" | "baseState">,
): Pick<
  DraftContext,
  | "state"
  | "baseState"
  | "draftActions"
  | "landscapingLocation"
  | "arrangementConflicts"
> => ({
  state: context.baseState ?? context.state,
  baseState: undefined,
  draftActions: [],
  landscapingLocation: undefined,
  arrangementConflicts: undefined,
});

/** Save succeeded: the server's farm is the new truth. */
export const commitDraft = (
  serverState: GameState,
): Pick<
  DraftContext,
  | "state"
  | "baseState"
  | "draftActions"
  | "landscapingLocation"
  | "arrangementConflicts"
> => ({
  state: serverState,
  baseState: undefined,
  draftActions: [],
  landscapingLocation: undefined,
  arrangementConflicts: undefined,
});
