import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { RaffleDefinition } from "../types";

type Request = {
  token: string;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

export async function loadRaffles(
  request: Request,
): Promise<RaffleDefinition[]> {
  if (!CONFIG.API_URL) {
    return [
      {
        id: "1",
        startAt: Date.now(),
        endAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        prizes: {
          1: {
            wearables: {
              "Master Chef's Cleaver": 1,
            },
          },
        },
      },
    ];
  }
  const response = await window.fetch(`${API_URL}/data?type=raffles`, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Transaction-ID": request.transactionId,
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.EFFECT_SERVER_ERROR);
  }

  const { data } = await response.json();

  return data;
}
