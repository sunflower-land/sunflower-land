import { buyGemsMATIC } from "lib/blockchain/BuyGems";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

export type Currency = "MATIC";

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
  const response = await window.fetch(`${API_URL}/buy-gems/${request.farmId}`, {
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
  });

  if (response.status === 409) {
    const { error } = await response.json();
    throw new Error(error);
  }

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.BUY_GEMS_SERVER_ERROR);
  }

  return await response.json();
}

export async function buyBlockBucksMATIC(transaction: any) {
  await buyGemsMATIC({
    ...transaction,
    account: wallet.getConnection(),
  });

  return { success: true, verified: true };
}

export async function buyBlockBucksXsolla(
  request: Omit<Request, "type">,
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
      body: JSON.stringify({
        amount: request.amount,
      }),
    },
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.BUY_GEMS_SERVER_ERROR);
  }

  return await response.json();
}
