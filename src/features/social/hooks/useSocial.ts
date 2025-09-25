import { useEffect } from "react";
import { Room, Client } from "colyseus.js";
import { CONFIG } from "lib/config";
import { Interaction, Milestone, PlayerUpdate } from "../types/types";

const MAX_RETRY_INTERVAL = 15 * 60 * 1000;

// Private data specific to the connection to the colyseus server
const subscribers: Set<{
  callbacks?: {
    onFollow?: (update: PlayerUpdate) => void;
    onUnfollow?: (update: PlayerUpdate) => void;
    onInteraction?: (update: Interaction) => void;
    onMilestone?: (update: Milestone) => void;
  };
}> = new Set();
let room: Room<unknown> | undefined = undefined;
let reconnectTimeout: NodeJS.Timeout | undefined = undefined;
let retries = 0;
let status: "loading" | "connected" | "error" = "loading";

type UseSocialParams = {
  farmId: number;
  callbacks?: {
    onFollow?: (update: PlayerUpdate) => void;
    onUnfollow?: (update: PlayerUpdate) => void;
    onInteraction?: (update: Interaction) => void;
    onMilestone?: (update: Milestone) => void;
  };
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

const clearListeners = () => {
  room?.removeAllListeners();
};

const setupListeners = (room: Room<unknown>) => {
  room.onMessage("follow", onFollow);
  room.onMessage("unfollow", onUnfollow);
  room.onMessage("interaction", onInteraction);
  room.onMessage("milestone", onMilestone);
};

const leaveRoom = async () => {
  clearListeners();
  await room?.leave();
  room = undefined;
};

const joinRoom = async (farmId: number) => {
  const client = new Client(CONFIG.ROOM_URL);

  try {
    onLoading();
    leaveRoom();

    room = await client.joinOrCreate("sunflorea_social", {
      farmId,
    });
    setupListeners(room);

    onConnected();
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
  }, []);
};
