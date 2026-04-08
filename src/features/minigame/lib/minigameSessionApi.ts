import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { randomID } from "lib/utils/random";
import type { PlayerEconomyConfig } from "./types";

export type MinigameSessionApiPayload = {
  farm: { balance: string; bumpkin: unknown };
  playerEconomy: {
    balances: Record<string, number>;
    /** Some API deployments mirror economy `items` here instead of the top-level `items` field. */
    items?: PlayerEconomyConfig["items"];
    generating: Record<string, unknown>;
    activity: number;
    dailyActivity: { date: string; count: number };
    dailyMinted: { utcDay: string; minted: Record<string, number> };
    dailyActionUses?: {
      utcDay: string;
      byAction: Record<string, number>;
    };
    purchaseCounts?: Record<string, number>;
  };
  actions: Record<string, unknown>;
  items?: PlayerEconomyConfig["items"];
  descriptions?: PlayerEconomyConfig["descriptions"];
  visualTheme?: PlayerEconomyConfig["visualTheme"];
  playUrl?: PlayerEconomyConfig["playUrl"];
  mainCurrencyToken?: PlayerEconomyConfig["mainCurrencyToken"];
  /** Legacy keys; merged in `migrateLegacyPlayerEconomyConfigFields` when loading the dashboard. */
  initialBalances?: Record<string, number>;
  productionCollectByStartId?: Record<string, string>;
  dashboard?: {
    productionCollectByStartId?: Record<string, string>;
    visualTheme?: string;
  };
};

/** Merges top-level `items` with optional `playerEconomy.items` mirror from the API. */
export function resolvePlayerEconomySessionItems(
  raw: MinigameSessionApiPayload,
): PlayerEconomyConfig["items"] | undefined {
  if (raw.items != null) return raw.items;
  const pe = raw.playerEconomy;
  if (
    pe &&
    typeof pe === "object" &&
    "items" in pe &&
    (pe as { items?: PlayerEconomyConfig["items"] }).items != null
  ) {
    return (pe as { items?: PlayerEconomyConfig["items"] }).items;
  }
  return undefined;
}

export type MinigameActionApiResponse = {
  playerEconomy: MinigameSessionApiPayload["playerEconomy"];
  generatorJobId?: string;
  collectGrants?: { token: string; amount: number }[];
};

function playerEconomyUrl(portalId: string): string {
  const base = CONFIG.API_URL;
  if (!base) throw new Error("API_URL is not configured");
  return `${base}/portal/${encodeURIComponent(portalId)}/player-economy`;
}

/** Response shape from `GET /data?type=economy.loaded&farmId&portalId` (`sunflowerland/data` handler). */
type EconomyLoadedHandlerResult =
  | { status: "ok"; data: MinigameSessionApiPayload }
  | { status: "unknown_player_economy" }
  | { status: "farm_not_found" }
  | { status: "feature_disabled" };

function economyLoadedQueryUrl(portalId: string, farmId: number): string {
  const base = CONFIG.API_URL;
  if (!base) throw new Error("API_URL is not configured");
  const params = new URLSearchParams({
    type: "economy.loaded",
    farmId: String(farmId),
    portalId,
  });
  return `${base}/data?${params.toString()}`;
}

export async function getMinigameSession(
  portalId: string,
  portalJwt: string,
  farmId: number,
): Promise<MinigameSessionApiPayload> {
  const res = await fetch(economyLoadedQueryUrl(portalId, farmId), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${portalJwt}`,
      Accept: "application/json",
    },
  });
  const json = (await res.json().catch(() => ({}))) as {
    data?: EconomyLoadedHandlerResult;
    error?: string;
  };
  if (!res.ok) {
    throw new Error(
      typeof json.error === "string"
        ? json.error
        : `Load failed (${res.status})`,
    );
  }
  const payload = json.data;
  if (!payload || typeof payload !== "object" || !("status" in payload)) {
    throw new Error("Invalid player economy response");
  }
  if (payload.status === "unknown_player_economy") {
    throw new Error("Unknown player economy");
  }
  if (payload.status === "farm_not_found") {
    throw new Error("Farm not found");
  }
  if (payload.status === "feature_disabled") {
    throw new Error("Player economies are not enabled for this farm");
  }
  if (payload.status !== "ok" || payload.data == null) {
    throw new Error("Load failed");
  }
  return payload.data;
}

export async function postPlayerEconomyActionRequest(
  portalId: string,
  portalJwt: string,
  body: { action: string; itemId?: string; amounts?: Record<string, number> },
): Promise<MinigameActionApiResponse> {
  const res = await fetch(`${playerEconomyUrl(portalId)}/action`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${portalJwt}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res
    .json()
    .catch(() => ({}))) as MinigameActionApiResponse & {
    error?: string;
  };
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : `Action failed (${res.status})`,
    );
  }
  return data;
}

/**
 * Persists a player economy action via the main game event API (`playerEconomy.actioned`),
 * same path as `event.ts` / POST `/event/:farmId`.
 */
export async function postPlayerEconomyActionedEvent(opts: {
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
    type: "playerEconomy.actioned";
    portalId: string;
    action: string;
    itemId?: string;
    amounts?: Record<string, number>;
  } = {
    type: "playerEconomy.actioned",
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

  if (!response.ok || body.data?.playerEconomy == null) {
    throw new Error(ERRORS.EFFECT_SERVER_ERROR);
  }

  return body.data;
}
