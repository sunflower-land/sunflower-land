import { buyBlockBucksMATIC as _buyBlockBucksMATIC } from "lib/blockchain/BuyBlockBucks";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

export type Currency = "USDC" | "MATIC";

type Request = {
  farmId: number;
  token: string;
  type: Currency;
  amount: number;
  transactionId: string;
};

type Response = {
  signature: string;
  type: Currency;
  farmId: number;
  deadline: number;
  amount: number;
  fee: number;
};

const API_URL = CONFIG.API_URL;

export async function buyBlockBucks(request: Request): Promise<Response> {
  const response = await window.fetch(
    `${API_URL}/buy-block-bucks/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
      body: JSON.stringify({
        type: request.type,
        amount: request.amount,
      }),
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.MINT_COLLECTIBLE_SERVER_ERROR);
  }

  return await response.json();
}

export async function buyBlockBucksMATIC(request: Request) {
  const transaction = await buyBlockBucks(request);

  await _buyBlockBucksMATIC({
    ...transaction,
    web3: wallet.web3Provider,
    account: wallet.myAccount as string,
  });

  return { success: true, verified: true };
}

export async function buyBlockBucksXsolla(
  request: Request
): Promise<{ url: string }> {
  const response = await window.fetch(
    `${API_URL}/payments/create/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.MINT_COLLECTIBLE_SERVER_ERROR);
  }

  return await response.json();
}
