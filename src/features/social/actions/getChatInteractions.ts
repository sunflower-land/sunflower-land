import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import type { Interaction } from "../types/types";

type Request = {
  token: string;
  farmId: number;
  followedPlayerId: number;
  cursor?: number;
  /** Id of the entry `cursor` came from, to break createdAt ties. */
  cursorId?: string;
};

export const getChatInteractions = async ({
  token,
  farmId,
  followedPlayerId,
  cursor,
  cursorId,
}: Request): Promise<Interaction[]> => {
  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "chatInteractions");
  url.searchParams.set("farmId", farmId.toString());
  url.searchParams.set("followedPlayerId", followedPlayerId.toString());
  url.searchParams.set("cursor", (cursor ?? 0).toString());
  if (cursorId) url.searchParams.set("cursorId", cursorId);

  const res = await fetchWithRetry(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await res.json();

  return response.data.interactions ?? [];
};
