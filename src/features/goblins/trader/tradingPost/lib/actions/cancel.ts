import { cancelTrade } from "lib/blockchain/Game";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

type Request = {
  listingId: number;
  farmId: number;
  token: string;
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
};

type Response = {
  signature: string;
  payload: Payload;
};

export async function cancelRequest(request: Request): Promise<Response> {
  // Call backend list-trade
  const response = await window.fetch(
    `${API_URL}/cancel-trade/${request.farmId}`,
    {
      method: "POST",
      //mode: "no-cors",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        accept: "application/json",
        "X-Transaction-ID": request.transactionId,
      },
      body: JSON.stringify({
        listingId: request.listingId,
      }),
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.CANCEL_TRADE_SERVER_ERROR);
  }

  const data = await response.json();
  return data;
}

export async function cancel(request: Request) {
  const response = await cancelRequest(request);

  await cancelTrade({
    ...response.payload,
    signature: response.signature,
    web3: wallet.web3Provider,
    account: request.account,
  });
}
