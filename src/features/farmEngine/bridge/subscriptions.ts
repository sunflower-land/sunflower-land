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

  const subscription = service.subscribe((state) => {
    const next = selector(state);
    if (!equals(current, next)) {
      current = next;
      onChange(next);
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
