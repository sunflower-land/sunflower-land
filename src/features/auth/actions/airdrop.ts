import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

type AirdropArgs = {
  token: string;
  farmId: number;
  fromAddress: string;
};

export async function airdrop({ token, farmId, fromAddress }: AirdropArgs) {
  const timestamp = Math.floor(Date.now() / 8.64e7);

  console.log("Try sign");
  const { signature } = await metamask.signTransaction(timestamp, fromAddress);

  const response = await window.fetch(`${API_URL}/airdrop/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      signature,
      fromAddress,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const data: { status: "already_migrated" | "migrated" } =
    await response.json();

  console.log({ data });

  return data;
}
