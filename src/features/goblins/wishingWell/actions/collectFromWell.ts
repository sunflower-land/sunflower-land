import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  farmId: number;
  sessionId: string;
  amount: string;
  token: string;
  captcha: string;
};

const API_URL = CONFIG.API_URL;

export interface SignedTransaction {
  signature: string;
  tokens: string;
  deadline: number;
  farmId: number;
}

export async function signCollectFromWell({
  farmId,
  sessionId,
  token,
  amount,
  captcha,
}: Request): Promise<SignedTransaction | void> {
  if (!API_URL) return;

  const response = await window.fetch(`${API_URL}/wishing-well`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sessionId: sessionId,
      farmId: farmId,
      tokens: amount,
      captcha,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  const transaction = await response.json();

  return transaction as SignedTransaction;
}

export async function collectFromWell(transaction: SignedTransaction) {
  const receipt = await wallet.getWishingWell().collectFromWell(transaction);

  return receipt;
}
