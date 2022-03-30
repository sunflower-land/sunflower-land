import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";

type Request = {
  farmId: number;
  sessionId: string;
  amount: string;
  token: string;
};

const API_URL = CONFIG.API_URL;

async function signTransaction(request: Request) {
  const response = await window.fetch(`${API_URL}/wishing-well`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
    },
    body: JSON.stringify({
      sessionId: request.sessionId,
      farmId: request.farmId,
      tokens: request.amount,
    }),
  });

  const data = await response.json();

  return data;
}

export async function collectFromWell({
  farmId,
  sessionId,
  token,
  amount,
}: Request) {
  if (!API_URL) return;

  const transaction = await signTransaction({
    farmId,
    sessionId,
    token,
    amount,
  });

  await metamask.getWishingWell().collectFromWell(transaction);
}
