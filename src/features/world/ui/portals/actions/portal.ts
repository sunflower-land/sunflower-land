import jwt_decode from "jwt-decode";
import { Token } from "features/auth/actions/login";
import { MinigameName } from "features/game/types/minigames";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  portalId: MinigameName;
  token: string;
  farmId: number;
};

const API_URL = CONFIG.API_URL;

export async function portal(request: Request) {
  // TODO check cache for valid token;
  const cachedToken = getMinigameToken(request.portalId);

  if (cachedToken) {
    const token = decodeToken(cachedToken);
    const isFresh = token.exp * 1000 > Date.now() + TOKEN_BUFFER_MS;
    const isValid = !!token.userAccess;

    if (isFresh && isValid) {
      return { token: cachedToken };
    }
  }

  // Uses same autosave event driven endpoint
  const response = await window.fetch(
    `${API_URL}/portal/${request.portalId}/login`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
      },
      body: JSON.stringify({
        farmId: request.farmId,
      }),
    },
  );

  if (response.status >= 400) {
    throw new Error(ERRORS.PORTAL_LOGIN_ERROR);
  }

  const data: { token: string } = await response.json();

  saveJWT({ token: data.token, name: request.portalId });

  return data;
}

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `sb_wiz.zpc.minigame.${host}-${window.location.pathname}`;

type MinigameSessions = Partial<Record<MinigameName, string>>;

function getMinigameToken(name: MinigameName): string | null {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!item) {
    return null;
  }

  const sessions = JSON.parse(item) as MinigameSessions;

  return sessions[name] as string;
}

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
 * Reduce 1 hours as a buffer for a user session
 * This will mitigate people in the middle of their session becoming unauthorised
 */
const TOKEN_BUFFER_MS = 1000 * 60 * 60 * 1;

export function saveJWT({
  token,
  name,
}: {
  token: string;
  name: MinigameName;
}) {
  let sessions: MinigameSessions = {};
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      sessions = JSON.parse(stored);
    } catch {
      sessions = {};
    }
  }

  sessions[name] = token;

  return localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
}

export function removeMinigameJWTs() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}
