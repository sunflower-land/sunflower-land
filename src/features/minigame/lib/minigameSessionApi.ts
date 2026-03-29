import { CONFIG } from "lib/config";

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
