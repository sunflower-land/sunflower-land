import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";

type Request = {
  sessionId: string;
  farmId: number;
  sfl: number;
  ids: number[];
  amounts: string[];
  token: string;
};

const API_URL = CONFIG.API_URL;

async function signTransaction(request: Request) {
  const response = await window.fetch(`${API_URL}/withdraw`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
    },
    body: JSON.stringify({
      sessionId: request.sessionId,
      farmId: request.farmId,
      sfl: request.sfl,
      ids: request.ids,
      amounts: request.amounts,
    }),
  });

  const data = await response.json();

  return data;
}

type Options = {
  farmId: number;
  sessionId: string;
  sfl: number;
  ids: number[];
  amounts: string[];
  token: string;
};
export async function withdraw({
  farmId,
  sessionId,
  sfl,
  ids,
  amounts,
  token,
}: Options) {
  if (!API_URL) return;

  const transaction = await signTransaction({
    farmId,
    sessionId,
    sfl,
    ids,
    amounts,
    token,
  });

  const session = await metamask.getSessionManager().withdraw(transaction);

  return session;
}
