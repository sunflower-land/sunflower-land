import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

type Options = {
  farmId: number;
  sessionId: string;
  token: string;
  captcha?: string;
};

export async function sync({ farmId, sessionId, token, captcha }: Options) {
  if (CONFIG.NETWORK === "mumbai") {
    return syncProgress({ farmId, sessionId, token, captcha });
  }

  const response = await window.fetch(`${API_URL}/sync/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sessionId: sessionId,
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

  const newSessionId = await metamask.getSessionManager().sync(transaction);

  return { verified: true, sessionId: newSessionId };
}

export async function syncProgress({
  farmId,
  sessionId,
  token,
  captcha,
}: Options) {
  const response = await window.fetch(`${API_URL}/sync-progress/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sessionId: sessionId,
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

  // TODO
  const newSessionId = await metamask
    .getSessionManager()
    .syncProgress(transaction);

  return { verified: true, sessionId: newSessionId };
}
