import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { LimitedItem } from "../types/craftables";

type Request = {
  farmId: number;
  sessionId: string;
  item: LimitedItem;
  token: string;
};

const API_URL = CONFIG.API_URL;

async function mintRequest(request: Request) {
  if (!API_URL) return;
  console.log("Send off that request");

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
    }),
  });

  if (response.status !== 200 || !response.ok) {
    throw new Error("Could not mint your object");
  }

  const data = await response.json();

  return data;
}

export async function mint(request: Request) {
  const transaction = await mintRequest(request);
  const session = await metamask.getSessionManager().sync(transaction);

  return session;
}
