import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { sanitizeHTTPResponse } from "lib/network";
import { PastAction } from "../lib/gameMachine";
import { makeGame } from "../lib/transforms";
import { serialize, squashEvents } from "./autosave";

type Request = {
  actions: PastAction[];
  guestKey: string;
  deviceTrackerId: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function guestAutosaveRequest(
  request: Omit<Request, "actions"> & { actions: any[] }
) {
  const ttl = (window as any)["x-amz-ttl"];

  return await window.fetch(`${API_URL}/guest-autosave`, {
    method: "POST",
    headers: {
      ...{
        "content-type": "application/json;charset=UTF-8",
        "Guest-Key": request.guestKey,
        "X-Transaction-ID": request.transactionId,
      },
      ...(ttl ? { "X-Amz-TTL": (window as any)["x-amz-ttl"] } : {}),
    },
    body: JSON.stringify({
      actions: request.actions,
      clientVersion: CONFIG.CLIENT_VERSION as string,
      deviceTrackerId: request.deviceTrackerId,
    }),
  });
}

export async function guestAutosave(request: Request) {
  if (!API_URL) return { verified: true };

  // Shorten the payload
  const events = squashEvents(request.actions);

  // Serialize values before sending
  const actions = serialize(events);

  if (actions.length === 0) {
    return { verified: true };
  }

  const response = await guestAutosaveRequest({
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
    console.log({ data });

    throw new Error(ERRORS.AUTOSAVE_SERVER_ERROR);
  }

  const { farm, changeset } = await sanitizeHTTPResponse<{
    farm: any;
    changeset: any;
  }>(response);

  const game = makeGame(farm);

  return { verified: true, farm: game, changeset };
}
