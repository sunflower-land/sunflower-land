import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

type Options = {
  farmId: number;
  sessionId: string;
  sfl: number;
  ids: number[];
  amounts: string[];
  token: string;
  captcha: string;
};
export async function withdraw({
  farmId,
  sessionId,
  sfl,
  ids,
  amounts,
  token,
  captcha,
}: Options) {
  const response = await window.fetch(`${API_URL}/withdraw/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sessionId: sessionId,
      sfl: sfl,
      ids: ids,
      amounts: amounts,
      captcha,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const transaction = await response.json();

  const newSessionId = await metamask.getSessionManager().withdraw(transaction);

  return { sessionId: newSessionId, verified: true };
}
