import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";

type Request = {
  sessionId: string;
  farmId: number;
  sender: string;
  signature: string;
};

const API_URL = CONFIG.API_URL;

async function signTransaction(request: Request) {
  const response = await window.fetch(`${API_URL}/sync`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      ...request,
    }),
  });

  const data = await response.json();

  return data;
}

type Options = {
  farmId: number;
  sessionId: string;
  signature: string;
};
export async function sync({ farmId, sessionId, signature }: Options) {
  if (!API_URL) return;

  const transaction = await signTransaction({
    farmId,
    sessionId,
    sender: metamask.myAccount as string,
    signature,
  });

  console.log({ transaction });

  const session = await metamask.getSessionManager().sync(transaction);
  console.log({ session });

  return session;
}
