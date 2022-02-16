import { metamask } from "lib/blockchain/metamask";

type Request = {
  sessionId: string;
  farmId: number;
  sender: string;
  signature: string;
  sfl: number;
  ids: number[];
  amounts: string[];
};

const API_URL = import.meta.env.VITE_API_URL;

async function signTransaction(request: Request) {
  const response = await window.fetch(`${API_URL}/withdraw`, {
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
  sfl: number;
  ids: number[];
  amounts: string[];
};
export async function withdraw({
  farmId,
  sessionId,
  signature,
  sfl,
  ids,
  amounts,
}: Options) {
  if (!API_URL) return;

  const transaction = await signTransaction({
    farmId,
    sessionId,
    sender: metamask.myAccount as string,
    signature,
    sfl,
    ids,
    amounts,
  });

  console.log({ transaction });

  const session = await metamask.getSessionManager().withdraw(transaction);

  return session;
}
