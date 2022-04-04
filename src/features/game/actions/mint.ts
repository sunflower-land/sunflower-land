import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { LimitedItem } from "../types/craftables";

type Request = {
  farmId: number;
  sessionId: string;
  item: LimitedItem;
  token: string;
  captcha: string;
};

const API_URL = CONFIG.API_URL;

export async function mint(request: Request) {
  const response = await window.fetch(`${API_URL}/mint`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
    },
    body: JSON.stringify({
      farmId: request.farmId,
      sessionId: request.sessionId,
      item: request.item,
      captcha: request.captcha,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error("Could not mint your object");
  }

  const transaction = await response.json();

  const sessionId = await metamask.getSessionManager().sync(transaction);

  return { sessionId, verified: true };
}
