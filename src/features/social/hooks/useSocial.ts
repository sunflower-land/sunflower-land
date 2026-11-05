import { useEffect } from "react";
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
const subscribers: Set<{ callbacks?: Callbacks }> = new Set();
let room: Room<unknown> | undefined = undefined;
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
    if (subscriber.callbacks?.onFollow) {
      subscriber.callbacks.onFollow(update);
    }
  });
};

const onUnfollow = (update: PlayerUpdate) => {
  [...subscribers.values()].forEach((subscriber) => {
    if (subscriber.callbacks?.onUnfollow) {
      subscriber.callbacks.onUnfollow(update);
    }
  });
};

const onInteraction = (update: Interaction) => {
  [...subscribers.values()].forEach((subscriber) => {
    if (subscriber.callbacks?.onInteraction) {
      subscriber.callbacks.onInteraction(update);
    }
  });
};

const onMilestone = (update: Milestone) => {
  [...subscribers.values()].forEach((subscriber) => {
    if (subscriber.callbacks?.onMilestone) {
      subscriber.callbacks.onMilestone(update);
    }
  });
};

const onSessionReplaced = () => {
  [...subscribers.values()].forEach((subscriber) => {
    if (subscriber.callbacks?.onSessionReplaced) {
      subscriber.callbacks.onSessionReplaced();
    }
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

const clearListeners = () => {
  room?.removeAllListeners();
};

const setupListeners = (room: Room<unknown>, farmId: number) => {
  room.onMessage("follow", onFollow);
  room.onMessage("unfollow", onUnfollow);
  room.onMessage("interaction", onInteraction);
  room.onMessage("milestone", onMilestone);
  room.onMessage("replaced", onSessionReplaced);

  // A socket that drops after connecting (laptop asleep, flaky network) used
  // to stay dead until a component remounted. Rejoin with the same backoff as
  // a failed join. `leaveRoom` removes this listener before a deliberate
  // leave, so only unexpected drops land here.
  room.onLeave(() => onError(farmId));
};

const leaveRoom = async () => {
  clearListeners();
  await room?.leave();
  room = undefined;
};

const joinRoom = async (farmId: number) => {
  const client = new Client(CONFIG.ROOM_URL);
  joinedFarmId = farmId;

  try {
    onLoading();
    leaveRoom();

    room = await client.joinOrCreate("sunflorea_social", {
      farmId,
    });
    setupListeners(room, farmId);

    onConnected();
    if (sessionHash) room.send("session", { hash: sessionHash });
  } catch (e) {
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
  useEffect(() => {
    const subscriber = { callbacks };
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
