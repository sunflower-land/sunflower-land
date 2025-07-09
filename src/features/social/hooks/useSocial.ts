import { useCallback, useSyncExternalStore } from "react";
import { Room, Client } from "colyseus.js";

const HEARTBEAT_INTERVAL = 1_000;
const MAX_RETRY_INTERVAL = 15 * 60 * 1000;

const subscribers: Map<() => void, { following: number[] }> = new Map();

let room: Room<unknown> | undefined = undefined;
let heartBeatTimeout: NodeJS.Timeout | undefined = undefined;
let reconnectTimeout: NodeJS.Timeout | undefined = undefined;

let retries = 0;

type Snapshot = {
  status: "loading" | "connected" | "error";
  online: Record<number, number>;
};
let snapshot: Snapshot = {
  status: "loading",
  online: {},
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
};

const leaveRoom = async () => {
  clearListeners();
  await room?.leave();
  room = undefined;
};

const joinRoom = async (notifySubscriber: () => void, farmId: number) => {
  const client = new Client("http://localhost:2567");

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

const updateFollowing = () => {
  room?.send(
    "updateFollowing",
    [...subscribers.values()].flatMap((s) => s.following),
  );
};

const getSnapshot = () => snapshot;

export const useSocial = (farmId: number, following: number[]) => {
  const subscribe = useCallback(
    (notifySubscriber: () => void) => {
      subscribers.set(notifySubscriber, { following });

      if (subscribers.size === 1) joinRoom(notifySubscriber, farmId);
      else if (snapshot.status === "error") {
        retries = 0;
        reconnect(notifySubscriber, farmId);
      } else updateFollowing();

      return () => {
        subscribers.delete(notifySubscriber);
        if (subscribers.size === 0) leaveRoom();
        else updateFollowing();
      };
    },
    [...following],
  );
  return useSyncExternalStore(subscribe, getSnapshot);
};
