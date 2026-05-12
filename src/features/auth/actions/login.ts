import jwt_decode from "jwt-decode";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  address: string;
  signature: string;
  transactionId: string;
};

export type LoginCandidate = {
  farmId: number;
  username?: string;
  experience: number;
  balance: string;
  islandType?: string;
  equipped?: Record<string, string>;
  lastActivityAt: number;
};

export type LoginResponse =
  | { token: string; requiresFarmSelection?: false }
  | {
      requiresFarmSelection: true;
      disambiguationToken: string;
      candidates: LoginCandidate[];
    };

const API_URL = CONFIG.API_URL;

export async function loginRequest(request: Request): Promise<LoginResponse> {
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

  return (await response.json()) as LoginResponse;
}

export async function fetchLoginCandidates(
  disambiguationToken: string,
): Promise<LoginCandidate[]> {
  const response = await window.fetch(`${API_URL}/login/candidates`, {
    method: "POST",
    headers: { "content-type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ disambiguationToken }),
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.LOGIN_SERVER_ERROR);
  }

  const { candidates } = (await response.json()) as {
    candidates: LoginCandidate[];
  };
  return candidates;
}

export async function resolveFarmSelection(
  disambiguationToken: string,
  farmId: number,
): Promise<{ token: string }> {
  const response = await window.fetch(`${API_URL}/login/resolve`, {
    method: "POST",
    headers: { "content-type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ disambiguationToken, farmId }),
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.LOGIN_SERVER_ERROR);
  }

  return (await response.json()) as { token: string };
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
  farmId?: number;
};

export function decodeToken(token: string): Token {
  let decoded = jwt_decode(token) as any;

  decoded = {
    ...decoded,
    // SSO token puts fields in the properties so we need to elevate them
    ...decoded.properties,
  };

  return decoded;
}

/**
 * Reduce 4 hours as a buffer for a user session
 * This will mitigate people in the middle of their session becoming unauthorised
 */
const TOKEN_BUFFER_MS = 1000 * 60 * 60 * 4;

export function hasValidSession(): boolean {
  const address = wallet.getConnection();
  const session = getSession(address as string);

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
}): Promise<LoginResponse> {
  return await loginRequest({
    address,
    signature,
    transactionId,
  });
}
