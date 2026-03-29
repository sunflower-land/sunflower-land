import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { randomID } from "lib/utils/random";
import type { MinigameRuntimeState } from "./types";

export type MinigameSessionApiPayload = {
  farm: { balance: string; bumpkin: unknown };
  minigame: {
    balances: Record<string, number>;
    producing: Record<string, unknown>;
    activity: number;
    dailyActivity: { date: string; count: number };
    dailyMinted: { utcDay: string; minted: Record<string, number> };
  };
  actions: Record<string, unknown>;
};

export type MinigameActionApiResponse = {
  minigame: MinigameSessionApiPayload["minigame"];
  producingId?: string;
};

export function runtimeStateFromActionResponse(
  minigame: MinigameActionApiResponse["minigame"],
): MinigameRuntimeState {
  return {
    balances: minigame.balances,
    producing: minigame.producing as MinigameRuntimeState["producing"],
    dailyMinted: minigame.dailyMinted,
    activity: minigame.activity,
    dailyActivity: minigame.dailyActivity,
  };
}

function minigameUrl(portalId: string): string {
  const base = CONFIG.API_URL;
  if (!base) throw new Error("API_URL is not configured");
  return `${base}/portal/${encodeURIComponent(portalId)}/minigame`;
}

export async function getMinigameSession(
  portalId: string,
  portalJwt: string,
): Promise<MinigameSessionApiPayload> {
  const res = await fetch(minigameUrl(portalId), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${portalJwt}`,
      Accept: "application/json",
    },
  });
  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
  };
  if (!res.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : `Load failed (${res.status})`,
    );
  }
  return body as MinigameSessionApiPayload;
}

export async function postMinigameActionRequest(
  portalId: string,
  portalJwt: string,
  body: { action: string; itemId?: string; amounts?: Record<string, number> },
): Promise<MinigameActionApiResponse> {
  const res = await fetch(minigameUrl(portalId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${portalJwt}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as MinigameActionApiResponse & {
    error?: string;
  };
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : `Action failed (${res.status})`,
    );
  }
  return data;
}

/**
 * Persists a minigame action via the main game event API (`minigame.actioned`),
 * same path as `event.ts` / POST `/event/:farmId`.
 */
export async function postMinigameActionedEvent(opts: {
  farmId: number;
  userToken: string;
  portalId: string;
  action: string;
  itemId?: string;
  amounts?: Record<string, number>;
}): Promise<MinigameActionApiResponse> {
  const base = CONFIG.API_URL;
  if (!base) throw new Error("API_URL is not configured");

  const eventPayload: {
    type: "minigame.actioned";
    portalId: string;
    action: string;
    itemId?: string;
    amounts?: Record<string, number>;
  } = {
    type: "minigame.actioned",
    portalId: opts.portalId,
    action: opts.action,
  };
  if (opts.itemId !== undefined) {
    eventPayload.itemId = opts.itemId;
  }
  if (opts.amounts !== undefined) {
    eventPayload.amounts = opts.amounts;
  }

  const response = await fetch(`${base}/event/${opts.farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "X-Transaction-ID": randomID(),
      Authorization: `Bearer ${opts.userToken}`,
      accept: "application/json",
      ...((window as { "x-amz-ttl"?: string })["x-amz-ttl"]
        ? {
            "X-Amz-TTL": String(
              (window as { "x-amz-ttl"?: string })["x-amz-ttl"],
            ),
          }
        : {}),
    },
    body: JSON.stringify({
      event: eventPayload,
      createdAt: new Date().toISOString(),
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.EFFECT_TOO_MANY_REQUESTS);
  }

  const body = (await response.json().catch(() => ({}))) as {
    gameState?: unknown;
    data?: MinigameActionApiResponse;
    errorCode?: string;
  };

  if (response.status === 400) {
    throw new Error(
      typeof body.errorCode === "string"
        ? body.errorCode
        : ERRORS.EFFECT_SERVER_ERROR,
    );
  }

  if (!response.ok || body.data?.minigame == null) {
    throw new Error(ERRORS.EFFECT_SERVER_ERROR);
  }

  return body.data;
}
