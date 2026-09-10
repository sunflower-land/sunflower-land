import type { MachineInterpreter } from "features/game/lib/gameMachine";
import { shallowRecordEquals, subscribeSelector } from "./subscriptions";

type Listener = (state: unknown) => void;

/**
 * Minimal stand-in for the xstate interpreter surface subscribeSelector uses:
 * getSnapshot + subscribe (which, like xstate v4, immediately emits the
 * current state to a new listener).
 */
const createFakeService = (initialState: unknown) => {
  const listeners = new Set<Listener>();
  let state = initialState;

  return {
    service: {
      getSnapshot: () => state,
      subscribe: (listener: Listener) => {
        listeners.add(listener);
        listener(state);
        return { unsubscribe: () => listeners.delete(listener) };
      },
    } as unknown as MachineInterpreter,
    transition: (next: unknown) => {
      state = next;
      listeners.forEach((listener) => listener(state));
    },
  };
};

describe("subscribeSelector", () => {
  it("does not fire on subscribe (xstate's immediate emit is swallowed)", () => {
    const { service } = createFakeService({ crops: { "1": "a" } });
    const onChange = jest.fn();

    subscribeSelector(service, (state: any) => state.crops, onChange);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("fires with the new slice when the selected slice changes", () => {
    const { service, transition } = createFakeService({
      crops: "a",
      trees: "x",
    });
    const onChange = jest.fn();

    subscribeSelector(service, (state: any) => state.crops, onChange);
    transition({ crops: "b", trees: "x" });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("stays silent when a different slice changes", () => {
    const { service, transition } = createFakeService({
      crops: "a",
      trees: "x",
    });
    const onChange = jest.fn();

    subscribeSelector(service, (state: any) => state.crops, onChange);
    transition({ crops: "a", trees: "y" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("respects a custom equality function", () => {
    const { service, transition } = createFakeService({ crops: { "1": "a" } });
    const onChange = jest.fn();

    subscribeSelector(
      service,
      (state: any) => state.crops,
      onChange,
      shallowRecordEquals,
    );

    // Fresh object, same keys and values: shallow-equal, no wake.
    transition({ crops: { "1": "a" } });
    expect(onChange).not.toHaveBeenCalled();

    transition({ crops: { "1": "b" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  describe("subscriber isolation", () => {
    // xstate v4's Interpreter.update() iterates its listeners in a loop that
    // rethrows, so one renderer throwing inside sync() used to abort every
    // listener behind it and propagate out of gameService.send(). The farm
    // kept painting and panning (rendering doesn't read subscriptions) while
    // nothing responded to state again — the "crashed behind the scenes"
    // freeze. A subscriber must not be able to do that to its neighbours.
    let consoleError: jest.SpyInstance;

    beforeEach(() => {
      consoleError = jest.spyOn(console, "error").mockImplementation(() => {
        // silence the intentional logging under test
      });
    });
    afterEach(() => consoleError.mockRestore());

    it("keeps later subscribers running when an earlier one throws", () => {
      const { service, transition } = createFakeService({ crops: "a" });
      const boom = jest.fn(() => {
        throw new Error("renderer blew up");
      });
      const after = jest.fn();

      subscribeSelector(service, (state: any) => state.crops, boom);
      subscribeSelector(service, (state: any) => state.crops, after);

      transition({ crops: "b" });

      expect(boom).toHaveBeenCalledTimes(1);
      expect(after).toHaveBeenCalledWith("b");
    });

    it("does not propagate the throw back to the dispatcher", () => {
      const { service, transition } = createFakeService({ crops: "a" });

      subscribeSelector(
        service,
        (state: any) => state.crops,
        () => {
          throw new Error("renderer blew up");
        },
      );

      expect(() => transition({ crops: "b" })).not.toThrow();
    });

    it("re-syncs a subscriber that recovers instead of leaving it stale", () => {
      const { service, transition } = createFakeService({ crops: "a" });
      let fail = true;
      const onChange = jest.fn(() => {
        if (fail) throw new Error("not ready yet");
      });

      subscribeSelector(service, (state: any) => state.crops, onChange);

      transition({ crops: "b" });
      expect(onChange).toHaveBeenCalledTimes(1);

      // The failed slice was never committed, so the next change still looks
      // like a change and the renderer gets another go.
      fail = false;
      transition({ crops: "c" });
      expect(onChange).toHaveBeenNthCalledWith(2, "c");

      // ...and once it succeeds, the slice commits and stops re-firing.
      transition({ crops: "c" });
      expect(onChange).toHaveBeenCalledTimes(2);
    });
  });

  it("stops firing after unsubscribe", () => {
    const { service, transition } = createFakeService({ crops: "a" });
    const onChange = jest.fn();

    const unsubscribe = subscribeSelector(
      service,
      (state: any) => state.crops,
      onChange,
    );
    unsubscribe();
    transition({ crops: "b" });

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("shallowRecordEquals", () => {
  it("compares by key set and reference-equal values", () => {
    const entity = { id: 1 };
    expect(shallowRecordEquals({ a: entity }, { a: entity })).toBe(true);
    expect(shallowRecordEquals({ a: entity }, { a: { id: 1 } })).toBe(false);
    expect(shallowRecordEquals({ a: entity }, { a: entity, b: entity })).toBe(
      false,
    );
    expect(shallowRecordEquals({}, {})).toBe(true);
  });
});
