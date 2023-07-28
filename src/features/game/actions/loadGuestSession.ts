import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { sanitizeHTTPResponse } from "lib/network";
import { makeGame } from "../lib/transforms";
import { GameState, InventoryItemName } from "../types/game";

type Request = {
  transactionId: string;
  guestKey: string;
};

export type MintedAt = Partial<Record<InventoryItemName, number>>;

type Response = {
  game: GameState;
  isBlacklisted?: boolean;
  whitelistedAt?: string;
  itemsMintedAt?: MintedAt;
  deviceTrackerId: string;
  status?: "COOL_DOWN";
};

const API_URL = CONFIG.API_URL;

export async function loadGuestSession(
  request: Request
): Promise<Response | undefined> {
  if (!API_URL) return;

  const response = await window.fetch(`${API_URL}/guest-session`, {
    method: "POST",
    //mode: "no-cors",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      accept: "application/json",
      "X-Transaction-ID": request.transactionId,
      "Guest-Key": request.guestKey,
    },
    body: JSON.stringify({
      clientVersion: CONFIG.CLIENT_VERSION as string,
    }),
  });

  if (response.status === 503) {
    throw new Error(ERRORS.MAINTENANCE);
  }

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status === 401) {
    throw new Error(ERRORS.SESSION_EXPIRED);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.SESSION_SERVER_ERROR);
  }

  const { farm, isBlacklisted, deviceTrackerId } = await sanitizeHTTPResponse<{
    farm: any;
    startedAt: string;
    isBlacklisted: boolean;
    deviceTrackerId: string;
  }>(response);

  return {
    game: makeGame(farm),
    isBlacklisted,
    deviceTrackerId,
  };
}
