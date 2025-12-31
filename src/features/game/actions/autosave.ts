import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { sanitizeHTTPResponse } from "lib/network";
import { GameEvent, GameEventName } from "../events";
import { PastAction } from "../lib/gameMachine";
import { makeGame } from "../lib/transforms";
import { getSessionId } from "./loadSession";
import Decimal from "decimal.js-light";
import { SeedBoughtAction } from "../events/landExpansion/seedBought";
import { GameState } from "../types/game";
import { getObjectEntries } from "../expansion/lib/utils";
import { AUTO_SAVE_INTERVAL } from "../expansion/Game";

// Browser-friendly SHA-256 → hex
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str); // UTF-8
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return "sha256:" + hashHex;
}

type StateHash = Record<keyof GameState, string>;

/**
 * Returns a hash of each field in the gamestate
 * { balance: "sha256:1234567890", inventory: "sha256:1234567890", ... }
 */
export async function getGameHash(gameState: GameState): Promise<StateHash> {
  const hashes = {} as StateHash;

  for (const [key, value] of getObjectEntries(gameState)) {
    // TODO - sort keys or use object-hash for deeper checks and consistency
    const stable = JSON.stringify(value);
    hashes[key] = await hashString(stable);
  }

  return hashes;
}

type Request = {
  actions: PastAction[];
  farmId: number;
  sessionId: string;
  token: string;
  fingerprint: string;
  deviceTrackerId: string;
  transactionId: string;
  state: GameState;
};

const API_URL = CONFIG.API_URL;

const EXCLUDED_EVENTS: GameEventName<GameEvent>[] = ["bot.detected"];

/**
 * Squashes similar events into a single event
 * Filters out UI only events
 */
export function squashEvents(events: PastAction[]): PastAction[] {
  return events.reduce((items, event, index) => {
    if (EXCLUDED_EVENTS.includes(event.type)) {
      return items;
    }

    if (index > 0) {
      const previous = items[items.length - 1];

      const isShopEvent =
        event.type === "seed.bought" && previous.type === "seed.bought";

      // We can combine the amounts when buying/selling the same item
      if (isShopEvent && event.item === previous.item) {
        return [
          ...items.slice(0, -1),
          {
            ...event,
            amount: new Decimal((previous as SeedBoughtAction).amount)
              .plus(new Decimal(event.amount))
              .toNumber(),
          } as PastAction,
        ];
      }
    }

    return [...items, event];
  }, [] as PastAction[]);
}

export function serialize(events: PastAction[]) {
  return events.map((action) => ({
    ...action,
    createdAt: new Date(action.createdAt.getTime()).toISOString(),
  }));
}

export async function autosaveRequest(
  request: Omit<Request, "actions" | "state"> & {
    actions: any[];
    stateHash?: Record<keyof GameState, string>;
  },
) {
  const ttl = (window as any)["x-amz-ttl"];

  // Useful for using cached results
  const cachedKey = getSessionId();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, AUTO_SAVE_INTERVAL);

  try {
    return await window.fetch(`${API_URL}/autosave/${request.farmId}`, {
      method: "POST",
      headers: {
        ...{
          "content-type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${request.token}`,
          "X-Fingerprint": request.fingerprint,
          "X-Transaction-ID": request.transactionId,
        },
        ...(ttl ? { "X-Amz-TTL": (window as any)["x-amz-ttl"] } : {}),
      },
      body: JSON.stringify({
        sessionId: request.sessionId,
        actions: request.actions,
        clientVersion: CONFIG.CLIENT_VERSION as string,
        cachedKey,
        deviceTrackerId: request.deviceTrackerId,
        stateHash: request.stateHash,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

let autosaveErrors = 0;

export async function autosave(request: Request, retries = 0) {
  if (!API_URL) return { verified: true };

  // Shorten the payload
  const events = squashEvents(request.actions);

  // Serialize values before sending
  const actions = serialize(events);

  if (actions.length === 0) {
    return { verified: true };
  }

  if (autosaveErrors) {
    await new Promise((res) => setTimeout(res, autosaveErrors * 5000));
  }

  // eslint-disable-next-line no-console
  console.time("getGameHash");
  const stateHash = await getGameHash(request.state);
  // eslint-disable-next-line no-console
  console.timeEnd("getGameHash");

  const response = await autosaveRequest({
    ...request,
    actions,
    stateHash,
  });

  if (response.status === 503) {
    const data = await response.json();
    if (data.message === "Temporary maintenance") {
      throw new Error(ERRORS.MAINTENANCE);
    } else {
      // Throttling. Do exponential backoff with jitter
      const backoff = Math.min(1000 * Math.pow(2, retries), 10000);
      const jitter = Math.random() * 1000;

      await new Promise((resolve) => setTimeout(resolve, backoff + jitter));

      if (retries < 3) {
        return await autosave(request, retries + 1);
      }

      throw new Error(ERRORS.AUTOSAVE_SERVER_ERROR);
    }
  }

  if (response.status === 401) {
    throw new Error(ERRORS.SESSION_EXPIRED);
  }

  if (response.status === 400) {
    throw new Error(ERRORS.AUTOSAVE_CLOCK_ERROR);
  }

  if (response.status === 403) {
    throw new Error(ERRORS.AUTOSAVE_CLIENT_ERROR);
  }

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    autosaveErrors += 1;
    throw new Error(ERRORS.AUTOSAVE_SERVER_ERROR);
  }

  autosaveErrors = 0;

  // eslint-disable-next-line prefer-const
  let { farm, changeset, announcements } = await sanitizeHTTPResponse<{
    farm: any;
    changeset: any;
    announcements: any;
  }>(response);

  farm.id = request.farmId;

  // Merge the changes over the previous
  farm = {
    ...request.state,
    ...farm,
  };

  const game = makeGame(farm);

  return { verified: true, farm: game, changeset, announcements };
}
