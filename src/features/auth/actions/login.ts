import jwt_decode from "jwt-decode";
import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  address: string;
  signature: string;
};

const API_URL = CONFIG.API_URL;

export async function loginRequest(request: Request) {
  const response = await window.fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      ...request,
    }),
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const { token } = await response.json();

  return { token };
}

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `sb_wiz.zpc.v.${host}-${window.location.pathname}`;

type Session = {
  token: string;
};

/**
 * Address -> Session
 */
type Sessions = Record<string, Session>;

function getSession(address: string): Session | null {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!item) {
    return null;
  }

  const sessions = JSON.parse(item) as Sessions;

  return sessions[address];
}

export function getSessionId(): string {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);

  let id = "";
  if (item) {
    const sessions = JSON.parse(item) as Sessions;
    // Unique key to bust the cache
    id = Buffer.from(Object.keys(sessions).join("-")).toString("base64");
  }

  return id;
}

export function saveSession(address: string, session: Session) {
  let sessions: Sessions = {};

  const item = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (item) {
    sessions = JSON.parse(item) as Sessions;
  }

  const newSessions = {
    ...sessions,
    [address]: session,
  };

  return localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSessions));
}

export function removeSession(address: string) {
  let sessions: Sessions = {};

  const item = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (item) {
    sessions = JSON.parse(item) as Sessions;
  }

  delete sessions[address];

  return localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
}

export type Token = {
  address: string;
  exp: number;
  userAccess: {
    withdraw: boolean;
    createFarm: boolean;
    sync: boolean;
    mintCollectible: boolean;
  };
  discordId?: string;
};

export function decodeToken(token: string): Token {
  return jwt_decode(token);
}

/**
 * Reduce 4 hours as a buffer for a user session
 * This will mitigate people in the middle of their session becoming unauthorised
 */
const TOKEN_BUFFER_MS = 1000 * 60 * 60 * 4;

export async function login(): Promise<{ token: string }> {
  const address = metamask.myAccount as string;
  const session = getSession(address);

  if (session) {
    const token = decodeToken(session.token);

    const isFresh = token.exp * 1000 > Date.now() + TOKEN_BUFFER_MS;

    // Migration from token that did not have user access
    const isValid = !!token.userAccess;

    if (isFresh && isValid) {
      // Raw token
      return { token: session.token };
    }
  }

  const timestamp = Math.floor(Date.now() / 8.64e7);

  const { signature } = await metamask.signTransaction(timestamp);

  const { token } = await loginRequest({
    address,
    signature,
  });

  saveSession(address, { token });

  return { token };
}
