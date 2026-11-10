import { useEffect, useLayoutEffect, useRef } from "react";
import { type Room, Client } from "colyseus.js";
import { CONFIG } from "lib/config";
import type { Interaction, Milestone, PlayerUpdate } from "../types/types";

const MAX_RETRY_INTERVAL = 15 * 60 * 1000;

type Callbacks = {
  onFollow?: (update: PlayerUpdate) => void;
  onUnfollow?: (update: PlayerUpdate) => void;
  onInteraction?: (update: Interaction) => void;
  onMilestone?: (update: Milestone) => void;
  /** Another tab or device loaded a session for this farm; this one is stale. */
  onSessionReplaced?: () => void;
};

// Private data specific to the connection to the colyseus server
// Each subscriber holds a ref to its latest callbacks, so a component's
// handlers always see its current props and state (filter, SWR key, ...)
// rather than whatever they closed over on mount.
type Subscriber = { callbacks: { current?: Callbacks } };
const subscribers: Set<Subscriber> = new Set();
let room: Room<unknown> | undefined = undefined;
// Bumped on every join and leave. A join that resolves after a newer join or a
// leave was started is stale: it must not become the live room, or it stays
// connected beside the new one and every event is delivered once per room.
let connectionAttempt = 0;
// The farm the room was last asked to join (set before the join resolves, so
// a second subscriber for the same farm does not join twice).
let joinedFarmId: number | undefined = undefined;
let reconnectTimeout: NodeJS.Timeout | undefined = undefined;
let retries = 0;
let status: "loading" | "connected" | "error" = "loading";
// The session this tab holds, re-announced on every (re)connect so the room
// can tell a reconnect of the live session from a new one or a stale tab.
let sessionHash: string | undefined = undefined;

type UseSocialParams = {
  farmId: number;
  callbacks?: Callbacks;
};

const updateStatus = (updatedStatus: "loading" | "connected" | "error") => {
  status = updatedStatus;
};

const reconnect = (farmId: number) => {
  const backoffDelay = Math.min(
    1000 * (Math.pow(2, retries) - 1),
    MAX_RETRY_INTERVAL,
  );
  retries++;

  reconnectTimeout && clearTimeout(reconnectTimeout);
  reconnectTimeout = setTimeout(() => {
    if (status === "connected") return;
    // Everyone unsubscribed while we were waiting: nothing to reconnect for
    if (subscribers.size === 0) return;
    joinRoom(farmId);
  }, backoffDelay);
};

const onLoading = () => {
  updateStatus("loading");
};

const onError = (farmId: number) => {
  updateStatus("error");
  leaveRoom();
  reconnect(farmId);
};

const onConnected = () => {
  retries = 0;
  updateStatus("connected");
};

const onFollow = (update: PlayerUpdate) => {
  [...subscribers.values()].forEach((subscriber) => {
    subscriber.callbacks.current?.onFollow?.(update);
  });
};

const onUnfollow = (update: PlayerUpdate) => {
  [...subscribers.values()].forEach((subscriber) => {
    subscriber.callbacks.current?.onUnfollow?.(update);
  });
};

const onInteraction = (update: Interaction) => {
  [...subscribers.values()].forEach((subscriber) => {
    subscriber.callbacks.current?.onInteraction?.(update);
  });
};

const onMilestone = (update: Milestone) => {
  [...subscribers.values()].forEach((subscriber) => {
    subscriber.callbacks.current?.onMilestone?.(update);
  });
};

const onSessionReplaced = () => {
  [...subscribers.values()].forEach((subscriber) => {
    subscriber.callbacks.current?.onSessionReplaced?.();
  });
};

/**
 * Tell the room which session this tab holds. Safe to call before the room is
 * connected: the hash is kept and sent once it is, and again on every rejoin.
 */
export const announceSession = (hash: string) => {
  sessionHash = hash;
  if (status === "connected") room?.send("session", { hash });
};

const setupListeners = (joined: Room<unknown>, farmId: number) => {
  joined.onMessage("follow", onFollow);
  joined.onMessage("unfollow", onUnfollow);
  joined.onMessage("interaction", onInteraction);
  joined.onMessage("milestone", onMilestone);
  joined.onMessage("replaced", onSessionReplaced);

  // A socket that drops after connecting (laptop asleep, flaky network) used
  // to stay dead until a component remounted. Rejoin with the same backoff as
  // a failed join. `leaveRoom` removes this listener before a deliberate
  // leave, so only unexpected drops land here.
  joined.onLeave(() => {
    // Only the live room's closure starts the retry flow
    if (room !== joined) return;
    // The socket is already closed: forget it rather than asking it to leave
    room = undefined;
    onError(farmId);
  });
};

/**
 * Leave the live room, and cancel any join still in flight (it will leave
 * itself when it resolves). Synchronous on purpose: the global `room` is
 * cleared before anything awaits, so a join that resolves in the meantime
 * can never be overwritten with `undefined` and left connected unseen.
 */
const leaveRoom = () => {
  connectionAttempt++;
  // A pending retry belongs to the connection being left: fired later, it
  // would supersede the join that replaces it (possibly for another farm)
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  reconnectTimeout = undefined;

  const previous = room;
  room = undefined;
  if (!previous) return;

  previous.removeAllListeners();
  previous.leave().catch(() => undefined);
};

const joinRoom = async (farmId: number) => {
  leaveRoom();
  const attempt = connectionAttempt;
  const client = new Client(CONFIG.ROOM_URL);
  joinedFarmId = farmId;

  try {
    onLoading();

    const joined = await client.joinOrCreate("sunflorea_social", {
      farmId,
    });

    // A newer join (or a leave) started while this one was in flight
    if (attempt !== connectionAttempt) {
      joined.removeAllListeners();
      joined.leave().catch(() => undefined);
      return;
    }

    room = joined;
    setupListeners(joined, farmId);

    onConnected();
    if (sessionHash) joined.send("session", { hash: sessionHash });
  } catch (e) {
    // Superseded attempts fail quietly; the newer attempt owns the status
    if (attempt !== connectionAttempt) return;
    onError(farmId);
  }
};

/**
 * Maintains a persistent connection to the sunflorea_social room in the Colyseus WebSocket Server
 * for receiving real-time events, such as follow/unfollow, interactions, and milestones.
 * Check @callbacks for the events you can subscribe to.
 *
 * @param farmId Your farm id
 * @param callbacks An object of callbacks registering for different events
 * @returns void
 */
export const useSocial = ({ farmId, callbacks }: UseSocialParams) => {
  const callbacksRef = useRef(callbacks);

  // Keep the subscriber pointed at this render's callbacks
  useLayoutEffect(() => {
    callbacksRef.current = callbacks;
  });

  useEffect(() => {
    const subscriber: Subscriber = { callbacks: callbacksRef };
    subscribers.add(subscriber);

    // Only connect to server when the first component subscribes
    if (subscribers.size === 1) joinRoom(farmId);
    // The room is for one farm; a subscriber for another farm moves it
    else if (joinedFarmId !== farmId) joinRoom(farmId);
    // Force a reconnection attempt if the connection is down when a component subscribes
    else if (status === "error") {
      retries = 0;
      reconnect(farmId);
    }

    return () => {
      subscribers.delete(subscriber);
      // Leave the room if no component is subscribed
      if (subscribers.size === 0) leaveRoom();
    };
    // Re-run on a farm change so the room follows it (the session watcher
    // joins before the game has loaded, when the farm id can still change).
  }, [farmId]);
};
