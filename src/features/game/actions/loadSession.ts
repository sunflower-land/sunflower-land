import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { sanitizeHTTPResponse } from "lib/network";
import { makeGame } from "../lib/transforms";
import { GameState, Purchase } from "../types/game";
import { Announcements } from "../types/announcements";
import {
  getReferrerId,
  getSignupMethod,
} from "features/auth/actions/createAccount";
import { Moderation } from "../lib/gameMachine";

type Request = {
  token: string;
  transactionId: string;
};

type Response = {
  farmId: string;
  farmAddress?: string;
  game: GameState;
  isBlacklisted?: boolean;
  deviceTrackerId: string;
  announcements: Announcements;

  verified: boolean;
  promoCode?: string;
  moderation: Moderation[];
  sessionId: string;
  analyticsId: string;
  linkedWallet?: string;
  wallet?: string;
  nftId?: number;
  purchases: Purchase[];
  discordId?: string;
  fslId?: string;
  oauthNonce: string;
};

const API_URL = CONFIG.API_URL;

let loadSessionErrors = 0;

export async function loadSession(request: Request): Promise<Response> {
  if (loadSessionErrors) {
    await new Promise((res) => setTimeout(res, loadSessionErrors * 5000));
  }

  const promoCode = getPromoCode();
  const referrerId = getReferrerId();
  const signUpMethod = getSignupMethod();

  const response = await window.fetch(`${API_URL}/session`, {
    method: "POST",
    //mode: "no-cors",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      accept: "application/json",
      "X-Transaction-ID": request.transactionId,
    },
    body: JSON.stringify({
      clientVersion: CONFIG.CLIENT_VERSION as string,
      promoCode,
      referrerId,
      signUpMethod,
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
    loadSessionErrors += 1;

    throw new Error(ERRORS.SESSION_SERVER_ERROR);
  }

  loadSessionErrors = 0;

  const {
    farm,
    isBlacklisted,
    deviceTrackerId,
    announcements,
    verified,
    moderation,
    promoCode: promo,
    farmId,
    sessionId,
    farmAddress,
    analyticsId,
    linkedWallet,
    wallet,
    nftId,
    purchases,
    discordId,
    fslId,
    oauthNonce,
  } = await sanitizeHTTPResponse<{
    farm: any;
    startedAt: string;
    isBlacklisted: boolean;
    deviceTrackerId: string;
    status?: "COOL_DOWN";
    announcements: Announcements;
    verified: boolean;
    moderation: Moderation[];
    promoCode?: string;
    sessionId: string;
    farmId: string;
    analyticsId: string;
    farmAddress?: string;
    nftId?: number;
    linkedWallet?: string;
    wallet?: string;
    purchases: Purchase[];
    discordId?: string;
    fslId?: string;
    oauthNonce: string;
  }>(response);

  saveSession(farm.id);

  return {
    farmAddress,
    sessionId,
    farmId,
    game: makeGame(farm),
    isBlacklisted,
    deviceTrackerId,
    announcements,
    verified,
    moderation,
    promoCode: promo,
    analyticsId,
    linkedWallet,
    wallet,
    nftId,
    purchases,
    fslId,
    discordId,
    oauthNonce,
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
    account: wallet.getAccount(),
  };

  const cacheKey = Buffer.from(JSON.stringify(farmSession)).toString("base64");

  const newSessions = {
    ...sessions,
    [farmId]: cacheKey,
  };

  return localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSessions));
}

const PROMO_LS_KEY = `sb_wiz.promo-key.v.${host}`;

export function savePromoCode(id: string) {
  localStorage.setItem(PROMO_LS_KEY, id);
}

export function getPromoCode() {
  const item = localStorage.getItem(PROMO_LS_KEY);

  if (!item) {
    return undefined;
  }

  return item;
}
