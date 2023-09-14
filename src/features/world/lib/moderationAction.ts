import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type KickRequest = {
  farmId: number;
  kickedId: number;
  kickedReason: string;
  token: string;
};

type MuteRequest = {
  farmId: number;
  mutedId: number;
  mutedReason: string;
  mutedDuration: number;
  token: string;
};

const API_URL = CONFIG.API_URL;

export async function kickPlayer(request: KickRequest) {
  const response = await window.fetch(`${API_URL}/kick/${request.farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
    },
    body: JSON.stringify({
      kickedId: request.kickedId,
      kickedReason: request.kickedReason,
    }),
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const data: { success: boolean } = await response.json();

  return data;
}

export async function mutePlayer(request: MuteRequest) {
  const response = await window.fetch(`${API_URL}/mute/${request.farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
    },
    body: JSON.stringify({
      mutedId: request.mutedId,
      mutedReason: request.mutedReason,
      mutedDuration: request.mutedDuration,
    }),
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const data: { success: boolean } = await response.json();

  return data;
}
