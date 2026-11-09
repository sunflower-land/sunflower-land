/**
 * @jest-environment jsdom
 */
import type * as ReactType from "react";
import type * as ReactDOMClient from "react-dom/client";
import type * as UseSocialModule from "./useSocial";

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
};

const deferred = <T,>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

type MockRoom = {
  handlers: Record<string, (message: unknown) => void>;
  leaveHandlers: (() => void)[];
  left: Deferred<number>;
  onMessage: jest.Mock;
  onLeave: jest.Mock;
  removeAllListeners: jest.Mock;
  leave: jest.Mock;
  send: jest.Mock;
  emit: (type: string, message: unknown) => void;
};

const makeRoom = (): MockRoom => {
  const room: MockRoom = {
    handlers: {},
    leaveHandlers: [],
    left: deferred<number>(),
    onMessage: jest.fn((type: string, cb: (message: unknown) => void) => {
      room.handlers[type] = cb;
    }),
    onLeave: jest.fn((cb: () => void) => {
      room.leaveHandlers.push(cb);
    }),
    removeAllListeners: jest.fn(() => {
      room.handlers = {};
      room.leaveHandlers = [];
    }),
    leave: jest.fn(() => room.left.promise),
    send: jest.fn(),
    emit: (type, message) => room.handlers[type]?.(message),
  };
  return room;
};

// One pending join per joinOrCreate call, resolved by the test
let joins: Deferred<MockRoom>[] = [];

jest.mock("colyseus.js", () => ({
  Client: jest.fn().mockImplementation(() => ({
    joinOrCreate: jest.fn(() => {
      const join = deferred<MockRoom>();
      joins.push(join);
      return join.promise;
    }),
  })),
}));

jest.mock("lib/config", () => ({ CONFIG: { ROOM_URL: "ws://test" } }));

type SubscriberProps = {
  farmId: number;
  onInteraction: (update: unknown) => void;
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("useSocial", () => {
  let React: typeof ReactType;
  let act: typeof ReactType.act;
  let createRoot: typeof ReactDOMClient.createRoot;
  let social: typeof UseSocialModule;

  beforeEach(() => {
    joins = [];
    // The connection lives in module state: start every test from scratch
    /* eslint-disable @typescript-eslint/no-require-imports */
    jest.isolateModules(() => {
      React = require("react");
      act = React.act;
      createRoot = require("react-dom/client").createRoot;
      social = require("./useSocial");
    });
    /* eslint-enable @typescript-eslint/no-require-imports */
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  });

  const Subscriber = (props: SubscriberProps) => {
    social.useSocial({
      farmId: props.farmId,
      callbacks: { onInteraction: props.onInteraction },
    });
    return null;
  };

  const mount = () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    const render = async (props: SubscriberProps) => {
      await act(async () => {
        root.render(React.createElement(Subscriber, props));
      });
    };
    const unmount = async () => {
      await act(async () => {
        root.render(null);
      });
    };
    return { render, unmount };
  };

  const resolveJoin = async (index: number, room: MockRoom) => {
    await act(async () => {
      joins[index].resolve(room);
      await flush();
    });
  };

  it("keeps the new room when the old one finishes leaving after the join", async () => {
    const onInteraction = jest.fn();
    const { render } = mount();

    await render({ farmId: 1, onInteraction });
    const first = makeRoom();
    await resolveJoin(0, first);

    // The farm changes: the old room is asked to leave, a new join starts
    await render({ farmId: 2, onInteraction });
    expect(first.leave).toHaveBeenCalled();

    // The new join resolves before the old room's leave does
    const second = makeRoom();
    await resolveJoin(1, second);
    await act(async () => {
      first.left.resolve(1000);
      await flush();
    });

    // The new room is still the live one
    social.announceSession("hash");
    expect(second.send).toHaveBeenCalledWith("session", { hash: "hash" });

    second.emit("interaction", { type: "cheer" });
    expect(onInteraction).toHaveBeenCalledTimes(1);
  });

  it("leaves a join that resolves after a newer one started, so events arrive once", async () => {
    const onInteraction = jest.fn();
    const { render, unmount } = mount();

    await render({ farmId: 1, onInteraction });
    // Unsubscribe and resubscribe while the first join is still in flight
    await unmount();
    await render({ farmId: 1, onInteraction });
    expect(joins).toHaveLength(2);

    const second = makeRoom();
    await resolveJoin(1, second);
    // The stale join resolves last
    const first = makeRoom();
    await resolveJoin(0, first);

    expect(first.leave).toHaveBeenCalled();
    expect(first.onMessage).not.toHaveBeenCalled();

    second.emit("interaction", { type: "cheer" });
    first.emit("interaction", { type: "cheer" });
    expect(onInteraction).toHaveBeenCalledTimes(1);
  });

  it("leaves a join that resolves after everyone unsubscribed", async () => {
    const { render, unmount } = mount();

    await render({ farmId: 1, onInteraction: jest.fn() });
    await unmount();

    const room = makeRoom();
    await resolveJoin(0, room);

    expect(room.leave).toHaveBeenCalled();
    expect(room.onMessage).not.toHaveBeenCalled();
  });

  it("cancels a pending retry when the farm changes", async () => {
    const { render } = mount();
    const failJoin = async (index: number) => {
      await act(async () => {
        joins[index].reject(new Error("offline"));
        // Let the failure land, then any immediate (0ms) retry run
        await flush();
        await flush();
      });
    };

    await render({ farmId: 1, onInteraction: jest.fn() });
    // First failure retries at once; the second schedules a 1s retry
    await failJoin(0);
    expect(joins).toHaveLength(2);
    await failJoin(1);

    // The farm changes before that retry fires
    await render({ farmId: 2, onInteraction: jest.fn() });
    expect(joins).toHaveLength(3);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1_100));
    });

    // The old farm's retry did not start a join that supersedes farm 2's
    expect(joins).toHaveLength(3);
    const room = makeRoom();
    await resolveJoin(2, room);
    expect(room.onMessage).toHaveBeenCalled();
  });

  it("calls the callbacks from the latest render", async () => {
    const first = jest.fn();
    const latest = jest.fn();
    const { render } = mount();

    await render({ farmId: 1, onInteraction: first });
    const room = makeRoom();
    await resolveJoin(0, room);

    await render({ farmId: 1, onInteraction: latest });
    room.emit("interaction", { type: "help" });

    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledWith({ type: "help" });
  });
});
