import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  farmId: number;
  sessionId: string;
  amount: string;
  token: string;
  captcha: string;
};

const API_URL = CONFIG.API_URL;

export async function collectFromWell({
  farmId,
  sessionId,
  token,
  amount,
  captcha,
}: Request) {
  if (!API_URL) return;

  const response = await window.fetch(`${API_URL}/wishing-well`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sessionId: sessionId,
      farmId: farmId,
      tokens: amount,
      captcha,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  const transaction = await response.json();

  await metamask.getWishingWell().collectFromWell(transaction);
}
