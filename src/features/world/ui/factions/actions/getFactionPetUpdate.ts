import { CollectivePet } from "features/game/types/game";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

export async function getFactionPetUpdate({
  farmId,
}: {
  farmId: number;
}): Promise<CollectivePet | undefined> {
  const url = `${CONFIG.API_URL}/factions/pet/${farmId}`;

  const response = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    return;
  }

  const data = await response.json();

  return data;
}
