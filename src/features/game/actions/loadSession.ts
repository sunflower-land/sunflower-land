import { removeSession } from "features/auth/actions/login";
import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { sanitizeHTTPResponse } from "lib/network";
import { makeGame } from "../lib/transforms";
import { GameState, InventoryItemName } from "../types/game";

type Request = {
  sessionId: string;
  farmId: number;
  token: string;
};

export type MintedAt = Partial<Record<InventoryItemName, number>>;
type Response = {
  game: GameState;
  offset: number;
  isBlacklisted?: boolean;
  whitelistedAt?: string;
  itemsMintedAt?: MintedAt;
  blacklistStatus?: "investigating" | "permanent";
};

const API_URL = CONFIG.API_URL;

export async function loadSession(
  request: Request
): Promise<Response | undefined> {
  if (!API_URL) return;

  const response = await window.fetch(`${API_URL}/session/${request.farmId}`, {
    method: "POST",
    //mode: "no-cors",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      accept: "application/json",
    },
    body: JSON.stringify({
      sessionId: request.sessionId,
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
    removeSession(metamask.myAccount as string);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  const {
    farm,
    startedAt,
    isBlacklisted,
    whitelistedAt,
    itemsMintedAt,
    blacklistStatus,
  } = await sanitizeHTTPResponse<{
    farm: any;
    startedAt: string;
    isBlacklisted: boolean;
    whitelistedAt: string;
    itemsMintedAt: MintedAt;
    blacklistStatus: Response["blacklistStatus"];
  }>(response);

  saveSession(request.farmId);

  const startedTime = new Date(startedAt);

  let offset = 0;
  // Clock is not in sync with actual UTC time
  if (Math.abs(startedTime.getTime() - Date.now()) > 1000 * 30) {
    offset = startedTime.getTime() - Date.now();
  }

  return {
    offset,
    game: makeGame(farm),
    isBlacklisted,
    whitelistedAt,
    itemsMintedAt,
    blacklistStatus,
  };
}

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `sb_wiz.xtc.t.${host}-${window.location.pathname}`;

// Farm ID -> ISO Date
type FarmSessions = Record<number, { account: string }>;

export function getSessionId(): string {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);

  let id = "";
  if (item) {
    const sessions = JSON.parse(item) as FarmSessions;
    id = Object.values(sessions).join(":");
  }

  return id;
}

export function saveSession(farmId: number) {
  let sessions: FarmSessions = {};

  const item = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (item) {
    sessions = JSON.parse(item) as FarmSessions;
  }

  const farmSession = {
    farmId,
    loggedInAt: Date.now(),
    account: metamask.myAccount,
  };

  const cacheKey = Buffer.from(JSON.stringify(farmSession)).toString("base64");

  const newSessions = {
    ...sessions,
    [farmId]: cacheKey,
  };

  return localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSessions));
}
