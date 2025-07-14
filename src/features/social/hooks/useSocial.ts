import { useCallback, useSyncExternalStore } from "react";
import { Room, Client } from "colyseus.js";
import { CONFIG } from "lib/config";
import { FollowUpdate, Interaction } from "../types/types";

const HEARTBEAT_INTERVAL = 15 * 60 * 1000;
const MAX_RETRY_INTERVAL = 15 * 60 * 1000;

// Private data specific to the connection to the colyseus server
const subscribers: Map<
  () => void,
  {
    following: number[];
    callbacks?: {
      onFollow?: (update: FollowUpdate) => void;
      onUnfollow?: (update: FollowUpdate) => void;
      onChat?: (update: Interaction) => void;
    };
  }
> = new Map();
let room: Room<unknown> | undefined = undefined;
let heartBeatTimeout: NodeJS.Timeout | undefined = undefined;
let reconnectTimeout: NodeJS.Timeout | undefined = undefined;
let retries = 0;

// Global snapshot of the player's social data
type Snapshot = {
  status: "loading" | "connected" | "error";
  online: Record<number, number>;
};
let snapshot: Snapshot = {
  status: "loading",
  online: {},
};

type UseSocialParams = {
  farmId: number;
  following?: number[];
  callbacks?: {
    onFollow?: (update: FollowUpdate) => void;
    onUnfollow?: (update: FollowUpdate) => void;
    onChat?: (update: Interaction) => void;
  };
};

const updateStatus = (status: "loading" | "connected" | "error") => {
  snapshot = { ...snapshot, status };
  notifyAllSubscribers();
};

const reconnect = (notifySubscriber: () => void, farmId: number) => {
  const backoffDelay = Math.min(
    1000 * (Math.pow(2, retries) - 1),
    MAX_RETRY_INTERVAL,
  );
  retries++;

  reconnectTimeout && clearTimeout(reconnectTimeout);
  reconnectTimeout = setTimeout(() => {
    if (snapshot.status === "connected") return;
    joinRoom(notifySubscriber, farmId);
  }, backoffDelay);
};

const onLoading = () => {
  updateStatus("loading");
};

const onError = (notifySubscriber: () => void, farmId: number) => {
  updateStatus("error");
  leaveRoom();
  reconnect(notifySubscriber, farmId);
};

const onConnected = (notifySubscriber: () => void) => {
  retries = 0;
  updateStatus("connected");
  notifySubscriber();
};

const updateOnline = (online: Record<number, number>) => {
  snapshot = {
    ...snapshot,
    online: {
      ...snapshot.online,
      ...online,
    },
  };
  notifyAllSubscribers();
};

const notifyAllSubscribers = () => {
  [...subscribers.keys()].forEach((notifySubscriber) => notifySubscriber());
};

const onFollow = (update: FollowUpdate) => {
  [...subscribers.values()].forEach((subscriber) => {
    if (subscriber.callbacks?.onFollow) {
      subscriber.callbacks.onFollow(update);
    }
  });
};

const onUnfollow = (update: FollowUpdate) => {
  [...subscribers.values()].forEach((subscriber) => {
    if (subscriber.callbacks?.onUnfollow) {
      subscriber.callbacks.onUnfollow(update);
    }
  });
};

const onChat = (update: Interaction) => {
  [...subscribers.values()].forEach((subscriber) => {
    if (subscriber.callbacks?.onChat) {
      subscriber.callbacks.onChat(update);
    }
  });
};

const clearListeners = () => {
  room?.removeAllListeners();
  heartBeatTimeout && clearInterval(heartBeatTimeout);
};

const setupListeners = (
  room: Room<unknown>,
  cb: () => void,
  farmId: number,
) => {
  heartBeatTimeout = setInterval(
    () => room?.send("heartbeat"),
    HEARTBEAT_INTERVAL,
  );
  room.onError(() => onError(cb, farmId));
  room.onLeave(() => onError(cb, farmId));
  room.onMessage("heartbeat", updateOnline);
  room.onMessage("follow", onFollow);
  room.onMessage("unfollow", onUnfollow);
  room.onMessage("chat", onChat);
};

const updateFollowing = () => {
  room?.send(
    "updateFollowing",
    [...subscribers.values()].flatMap((s) => s.following),
  );
};

const leaveRoom = async () => {
  clearListeners();
  await room?.leave();
  room = undefined;
};

const joinRoom = async (notifySubscriber: () => void, farmId: number) => {
  const client = new Client(CONFIG.ROOM_URL);

  try {
    onLoading();
    leaveRoom();

    room = await client.joinOrCreate("sunflorea_social", {
      farmId,
      following: [...subscribers.values()].flatMap((s) => s.following),
    });
    setupListeners(room, notifySubscriber, farmId);

    onConnected(notifySubscriber);
  } catch (e) {
    onError(notifySubscriber, farmId);
  }
};

const getSnapshot = () => snapshot;

/**
 * Gets online status from the sunflorea_social room in the Colyseus WebSocket Server
 * Used to both retrieve the online status of farms and updating your own online status
 *
 * Pings the server every HEARTBEAT_INTERVAL to update your online status
 * Retrieves the online status of the farms you are following when a "heartbeat" message is received
 *
 * @param farmId Your farm id
 * @param following The IDs of the farms you want presence data about
 * @param callbacks An object of callbacks registering for different events
 * @returns The presence data of the farms
 */
export const useSocial = ({
  farmId,
  following = [],
  callbacks,
}: UseSocialParams) => {
  const subscribe = useCallback(
    (notifySubscriber: () => void) => {
      subscribers.set(notifySubscriber, { following, callbacks });

      // Only connect to server when the first component subscribes
      if (subscribers.size === 1) joinRoom(notifySubscriber, farmId);
      // Force a reconnection attempt if the connection is down when a component subscribes
      else if (snapshot.status === "error") {
        retries = 0;
        reconnect(notifySubscriber, farmId);
      } else updateFollowing();

      return () => {
        subscribers.delete(notifySubscriber);
        // Leave the room if no component is subscribed
        if (subscribers.size === 0) leaveRoom();
        else updateFollowing();
      };
    },
    [following.length],
  );

  return useSyncExternalStore(subscribe, getSnapshot);
};
