import jwt_decode from "jwt-decode";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  address: string;
  signature: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function loginRequest(request: Request) {
  const response = await window.fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Transaction-ID": request.transactionId,
    },
    body: JSON.stringify({
      address: request.address,
      signature: request.signature,
    }),
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.LOGIN_SERVER_ERROR);
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

export type Token = {
  address: string;
  exp: number;
  userAccess: {
    withdraw: boolean;
    createFarm: boolean;
    sync: boolean;
    mintCollectible: boolean;
    admin?: boolean;
    landExpansion?: boolean;
    verified?: boolean;
  };
  discordId?: string;
  farmId?: number;
};

export function decodeToken(token: string): Token {
  let decoded = jwt_decode(token) as any;

  decoded = {
    ...decoded,
    // SSO token puts fields in the properties so we need to elevate them
    ...decoded.properties,
  };
  console.log({ decoded });

  return decoded;
}

/**
 * Reduce 4 hours as a buffer for a user session
 * This will mitigate people in the middle of their session becoming unauthorised
 */
const TOKEN_BUFFER_MS = 1000 * 60 * 60 * 4;

export function hasValidSession(): boolean {
  const address = wallet.myAccount as string;
  const session = getSession(address);

  if (session) {
    const token = decodeToken(session.token);
    const isFresh = token.exp * 1000 > Date.now() + TOKEN_BUFFER_MS;
    const isValid = !!token.userAccess;

    if (isFresh && isValid) {
      return true;
    }
  }
  return false;
}

export async function login({
  transactionId,
  address,
  signature,
}: {
  transactionId: string;
  address: string;
  signature: string;
}): Promise<{ token: string }> {
  console.log({ login: true, transactionId, address, signature });
  const { token } = await loginRequest({
    address,
    signature,
    transactionId,
  });

  return { token };
}
