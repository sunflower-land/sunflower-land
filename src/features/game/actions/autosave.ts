import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { sanitizeHTTPResponse } from "lib/network";
import { GameEventName, PlacementEvent, PlayingEvent } from "../events";
import { PastAction } from "../lib/gameMachine";
import { makeGame } from "../lib/transforms";
import { getSessionId } from "./loadSession";
import Decimal from "decimal.js-light";
import { SeedBoughtAction } from "../events/landExpansion/seedBought";

type Request = {
  actions: PastAction[];
  farmId: number;
  sessionId: string;
  token: string;
  fingerprint: string;
  deviceTrackerId: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

const EXCLUDED_EVENTS: GameEventName<PlayingEvent | PlacementEvent>[] = [
  "bot.detected",
];

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
  request: Omit<Request, "actions"> & { actions: any[] },
) {
  const ttl = (window as any)["x-amz-ttl"];

  // Useful for using cached results
  const cachedKey = getSessionId();

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
    }),
  });
}

let autosaveErrors = 0;

export async function autosave(request: Request) {
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

  const response = await autosaveRequest({
    ...request,
    actions,
  });

  if (response.status === 503) {
    throw new Error(ERRORS.MAINTENANCE);
  }

  if (response.status === 401) {
    throw new Error(ERRORS.SESSION_EXPIRED);
  }

  if (response.status === 400) {
    throw new Error(ERRORS.AUTOSAVE_CLOCK_ERROR);
  }

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    const data = await response.json();

    autosaveErrors += 1;

    throw new Error(ERRORS.AUTOSAVE_SERVER_ERROR);
  }

  autosaveErrors = 0;

  const { farm, changeset, announcements } = await sanitizeHTTPResponse<{
    farm: any;
    changeset: any;
    announcements: any;
  }>(response);

  farm.id = request.farmId;

  const game = makeGame(farm);

  return { verified: true, farm: game, changeset, announcements };
}
