import type {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";

export type Unsubscribe = () => void;

export type StateSelector<S> = (state: MachineState) => S;

export type EqualityFn<S> = (a: S, b: S) => boolean;

/**
 * The non-React equivalent of useSelector: run `selector` over every machine
 * transition and call `onChange` only when the selected slice actually changes
 * per `equals`. This is the ONLY way engine code reads game state — no
 * whole-state pushes, no registry.
 *
 * Never fires on subscribe; callers that need the initial slice read it
 * synchronously (bridge.select) before subscribing, which keeps sync() call
 * sites explicit about mount vs change.
 */
export function subscribeSelector<S>(
  service: MachineInterpreter,
  selector: StateSelector<S>,
  onChange: (slice: S) => void,
  equals: EqualityFn<S> = Object.is,
): Unsubscribe {
  let current = selector(service.getSnapshot());
  let failures = 0;

  const subscription = service.subscribe((state) => {
    const next = selector(state);
    if (equals(current, next)) return;
    // Isolate every subscriber. xstate v4's Interpreter.update() iterates its
    // listeners in a loop that RETHROWS, so one renderer throwing inside
    // sync() aborts every listener queued behind it AND propagates out of
    // gameService.send(). The farm then looks alive — it still paints and
    // pans, because rendering doesn't depend on subscriptions — while nothing
    // reacts to state any more. That is the "everything crashed behind the
    // scenes" freeze.
    try {
      onChange(next);
      // Only commit the slice once the subscriber actually consumed it, so a
      // transient failure re-syncs on the next change instead of going
      // permanently stale.
      current = next;
      failures = 0;
    } catch (error) {
      failures += 1;
      // eslint-disable-next-line no-console
      if (failures <= 3) console.error("[farmEngine] subscriber threw", error);
    }
  });

  return () => subscription.unsubscribe();
}

/**
 * Shallow equality over a Record keyed by entity id — the right comparator for
 * most entity slices ({ [id]: entity }): reference-equal values, same key set.
 * Event handlers produce fresh objects only for what they touch, so this keeps
 * an untouched slice from waking its renderer.
 */
export function shallowRecordEquals<V>(
  a: Record<string, V>,
  b: Record<string, V>,
): boolean {
  if (a === b) return true;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}
