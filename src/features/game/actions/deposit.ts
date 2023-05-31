import { depositBumpkinTransaction } from "lib/blockchain/Deposit";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

const API_URL = CONFIG.API_URL;

type BumpkinOptions = {
  farmId: number;
  tokenUri: string;
  transactionId: string;
  token: string;
};

export async function depositBumpkin({
  farmId,
  tokenUri,
  transactionId,
  token,
}: BumpkinOptions) {
  const response = await window.fetch(`${API_URL}/deposit-bumpkin/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
      "X-Transaction-ID": transactionId,
    },
    body: JSON.stringify({
      tokenUri,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.WITHDRAW_SERVER_ERROR);
  }

  const transaction = await response.json();

  await depositBumpkinTransaction({
    ...transaction,
    web3: wallet.web3Provider,
    account: wallet.myAccount,
  });

  return true;
}
