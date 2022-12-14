import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { toWei } from "web3-utils";

const API_URL = CONFIG.API_URL;

type Request = {
  fileName: string;
  token: string;
};

type Response = {
  image: string;
};

export async function buildImage(request: Request): Promise<Response> {
  const response = await window.fetch(
    `${API_URL}/bumpkins/metadata/${request.fileName}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        // TODO Authorization: `Bearer ${request.token}`,
        accept: "application/json",
      },
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.PURCHASE_TRADE_SERVER_ERROR);
  }

  const data = await response.json();

  console.log(data);
  return data;
}

export async function purchase(request: Request) {
  const response = await purchaseRequest(request);

  await wallet
    .getSessionManager()
    .purchaseTrade({ ...response.payload, signature: response.signature });
}
