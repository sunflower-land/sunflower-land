import { wallet } from "lib/blockchain/wallet";
import { collectFromWellOnChain } from "lib/blockchain/WishingWell";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

type Request = {
  farmId: number;
  sessionId: string;
  amount: string;
  token: string;
  captcha: string;
  transactionId: string;
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
  transactionId,
}: Request): Promise<SignedTransaction | void> {
  if (!API_URL) return;

  const response = await window.fetch(`${API_URL}/wishing-well`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
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

  if (response.status >= 400) {
    throw new Error(ERRORS.WISHING_WELL_SERVER_ERROR);
  }

  const transaction = await response.json();

  return transaction as SignedTransaction;
}

export async function collectFromWell(
  account: string,
  transaction: SignedTransaction,
) {
  const receipt = await collectFromWellOnChain({
    ...transaction,
    web3: wallet.web3Provider,
    account: account,
  });

  return receipt;
}
