import { purchaseTrade } from "lib/blockchain/Game";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { toWei } from "web3-utils";

const API_URL = CONFIG.API_URL;

type Request = {
  listingId: number;
  sfl: number;
  farmId: number;
  token: string;
  deviceTrackerId: string;
  transactionId: string;
  account: string;
};

type Payload = {
  deadline: number;
  farmId: number;
  listingId: number;
  sender: string;
  sessionId: string;
  nextSessionId: string;
  sfl: number;
};

type Response = {
  signature: string;
  payload: Payload;
};

export async function purchaseRequest(request: Request): Promise<Response> {
  // Call backend list-trade
  const response = await window.fetch(
    `${API_URL}/purchase-trade/${request.farmId}`,
    {
      method: "POST",
      //mode: "no-cors",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        accept: "application/json",
        ...((window as any)["x-amz-ttl"]
          ? { "X-Amz-TTL": (window as any)["x-amz-ttl"] }
          : {}),
        "X-Transaction-ID": request.transactionId,
      },
      body: JSON.stringify({
        listingId: request.listingId,
        sfl: toWei(String(request.sfl)),
        deviceTrackerId: request.deviceTrackerId,
      }),
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.PURCHASE_TRADE_SERVER_ERROR);
  }

  const data = await response.json();

  // eslint-disable-next-line no-console
  console.log(data);
  return data;
}

export async function purchase(request: Request) {
  const response = await purchaseRequest(request);

  await purchaseTrade({
    ...response.payload,
    signature: response.signature,
    web3: wallet.web3Provider,
    account: request.account,
  });
}
