import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { CommunityIsland } from "features/game/types/game";

type Request = {
  islandId: string;
  farmId: number;
};

type Response = {
  island: CommunityIsland;
};

const API_URL = CONFIG.API_URL;

export async function loadIsland(
  request: Request,
): Promise<Response | undefined> {
  if (!API_URL) return;

  const response = await window.fetch(
    `${API_URL}/island/${request.islandId}/farm/${request.farmId}`,
    {
      method: "GET",
      //mode: "no-cors",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
      },
    },
  );

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
    throw new Error(ERRORS.SESSION_SERVER_ERROR);
  }

  const { island } = await response.json();

  return {
    island,
  };
}
