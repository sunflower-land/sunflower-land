import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";

type Request = {
  farmId: number;
  token: string;
  receiver: string;
};

const API_URL = CONFIG.API_URL;

export async function transferAccount(request: Request) {
  const response = await window.fetch(
    `${API_URL}/transfer-owner/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
      },
      body: JSON.stringify({
        receiver: request.receiver,
      }),
    }
  );

  const data: { success: boolean } = await response.json();

  await metamask
    .getFarm()
    .transfer({ to: request.receiver, tokenId: request.farmId });

  return data;
}
