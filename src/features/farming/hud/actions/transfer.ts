import { transfer } from "lib/blockchain/Farm";
import { CONFIG } from "lib/config";

type Request = {
  farmId: number;
  nftId: number;
  token: string;
  receiver: string;
  account: string;
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
    },
  );

  const data: { success: boolean } = await response.json();

  await transfer({
    account: request.account as `0x${string}`,
    to: request.receiver as `0x${string}`,
    tokenId: request.nftId,
  });

  return data;
}
